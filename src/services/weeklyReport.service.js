// src/services/weeklyReport.service.js

import { findUserById } from "../repositories/user.repository.js";
import { InvalidUserError } from "../errors/user.error.js";
import {
  countSentLettersAiKeywordsByUserId,
  insertWeeklyReport,
  findWeeklyReportKeywordByReportId,
  findWeeklyReportByUserIdAndDate,
  findWeeklyReportHighlightByRId,
  findWeeklyReportEmotionByRId,
  createWeeklyReportHighlightsByLatestLetters,
  insertWeeklyReportEmotions,
} from "../repositories/weeklyReport.repository.js";
import {
  WeeklyReportNotFoundError,
  WeeklyReportAlreadyExistsError,
  WeeklyReportInternalError,
} from "../errors/weeklyReport.error.js";
import { generateKoreanLetterFromKeywords } from "../utils/ai/letterFromKeywords.ai.js";
import { analyzeWeeklyReportEmotionByKeywords } from "../utils/weeklyEmotion.util.js";

/** @typedef {Record<string, number>} KeywordCountMap */

/**
 * countSentLettersAiKeywordsByUserId / findWeeklyReportKeywordByReportId 결과가
 * (1) {키워드:count} object 형태거나
 * (2) [{keyword,count}] 배열 형태거나
 * (3) 기타 이상한 형태여도
 * 최종적으로 KeywordCountMap으로 통일.
 */
function normalizeKeywordCountMap(input) {
  if (!input) return {};

  // 배열: [{keyword,count}]
  if (Array.isArray(input)) {
    const out = {};
    for (const row of input) {
      const k = row?.keyword;
      const c = Number(row?.count);
      if (!k || !Number.isFinite(c) || c <= 0) continue;
      out[String(k)] = (out[String(k)] ?? 0) + Math.floor(c);
    }
    return out;
  }

  // 객체: {키워드: count}
  if (typeof input === "object") {
    const out = {};
    for (const [k, v] of Object.entries(input)) {
      const c = Number(v);
      if (!k || !Number.isFinite(c) || c <= 0) continue;
      out[String(k)] = Math.floor(c);
    }
    return out;
  }

  return {};
}

/**
 * 키워드들을 사람이 읽기 좋은 string으로 변환.
 * - 배열이면: keyword(count), ...
 * - 객체면: keyword(count), ...
 */
function keywordsToString(keywordsOrMap) {
  if (!keywordsOrMap) return "";

  if (Array.isArray(keywordsOrMap)) {
    return keywordsOrMap
      .map(({ keyword, count }) => `${keyword}(${count})`)
      .join(", ");
  }

  if (typeof keywordsOrMap === "object") {
    return Object.entries(keywordsOrMap)
      .map(([keyword, count]) => `${keyword}(${count})`)
      .join(", ");
  }

  return "";
}

/**
 * 키워드 기반 한국어 마음편지(주간 summaryText 본문) 생성
 * - 중복 쿼리 방지: keywordCounts / nickname을 외부에서 전달받음
 */
async function createLetterDraft({ keywordCounts, nickname, weeklyEmotions }) {
  const receiver = nickname ?? "당신";

  const emotionLine = Array.isArray(weeklyEmotions) && weeklyEmotions.length
    ? weeklyEmotions.map(e => `${e.emotion}:${e.ratio}`).join(", ")
    : "없음";

  const basePrompt = `
너는 상담사가 아니라 친한 친구처럼 다정하고 담백한 한국어 존댓말 편지를 쓴다.
첫 문장은 "생각 많이 나요" 같은 3인칭 관찰 문장으로 시작하지 말고, 바로 상대의 한 주를 다정하게 받아주는 말로 시작하라.
이 편지는 감정 분석 결과를 설명하는 글이 아니라, 상대가 잘 해내고 있음을 확인해 주는 편지다.
다만 아래 '이번 주 감정 분포'는 문장 톤을 잡는 힌트로만 쓰고, 숫자/비율을 그대로 인용하지 말라.
이번 주 감정 분포: ${emotionLine}
출력은 한 문단으로만 작성하고 줄바꿈을 만들지 말라.
마지막 문장은 반드시 다음 문장으로 끝내라. 스스로에게 따뜻한 위로의 편지를 보내보세요.
`.trim();

  const letterText = await generateKoreanLetterFromKeywords({
    keywordCounts,
    basePrompt,
    context: {
      receiverName: receiver,
      relationship: "친구",
      mood: "따뜻하고 담백하게",
      occasion: "이번 주를 돌아보며",
      closingName: "친구",
    },
    topN: 8,
    lengthHint: "300~500자",
    temperature: 0.45,
    maxNewTokens: 320,
  });

  return { letterText };
}



/**
 * analyzeWeeklyReportEmotionByKeywords 결과(0..7)를 DB insert용 rows로 변환
 * - count 컬럼을 0..7 인덱스로 사용(네 기존 코드 의도 유지)
 */
function buildEmotionRows(reportId, emotionByIndex) {
  if (!emotionByIndex || typeof emotionByIndex !== "object") return [];

  const rows = [];
  for (const [dayIndex, list] of Object.entries(emotionByIndex)) {
    const idx = Number(dayIndex);
    if (!Number.isInteger(idx) || idx < 0 || idx > 7) continue;
    if (!Array.isArray(list)) continue;

    for (const item of list) {
      const emotion = item?.emotion;
      const ratio = Number(item?.ratio);
      if (!emotion || !Number.isFinite(ratio) || ratio <= 0) continue;

      rows.push({
        reportId,
        emotion: String(emotion),
        ratio,
        count: idx, // ✅ 0..7
      });
    }
  }
  return rows;
}

export const createWeeklyReport = async (userId, year, week) => {
  const user = await findUserById(userId);
  if (!user) throw new InvalidUserError();

  try {
    // 0) 중복 리포트 방지
    const existing = await findWeeklyReportByUserIdAndDate(userId, year, week);
    if (existing) return;

    // 1) 키워드 집계
    const rawCounts = await countSentLettersAiKeywordsByUserId(userId);
    const keywordCounts = normalizeKeywordCountMap(rawCounts);
    const hasKeywords = Object.keys(keywordCounts).length > 0;

    // 2) 감정 분석(키워드 기반)
    const emotions = hasKeywords
      ? await analyzeWeeklyReportEmotionByKeywords(keywordCounts, { maxEmotions: 6, minRatio: 0.05, temperature: 0.2 })
      : null;

    // 3) 편지 생성(감정+키워드)
    const { letterText } = hasKeywords
      ? await createLetterDraft({ keywordCounts, nickname: user.nickname, weeklyEmotions: emotions?.[0] })
      : { letterText: "이번 주는 기록된 키워드가 없어 마음 편지를 생성하지 않았어요." };

    // 4) insertWeeklyReport(...summaryText)
    // 5) emotionRows = buildEmotionRows(..., emotions) 후 insertWeeklyReportEmotions


    // 3) weekly_report 생성 (+ repo 내부에서 weekly_report_keyword를 같이 넣는 구조일 가능성)
    const weeklyReportResult = await insertWeeklyReport(userId, year, week, letterText);

    // 4) 하이라이트 생성(최근 편지 3개 등)
    await createWeeklyReportHighlightsByLatestLetters(year, week, userId);

    // 5) 감정 분석 입력은 “실제로 저장된 keyword rows” 기준이 가장 안전
    const keywordRows = await findWeeklyReportKeywordByReportId(weeklyReportResult.id);

    // ✅ 배열 그대로 넘겨라 (객체/문자열 fallback 제거)
    const weeklyReportEmotionByAi = await analyzeWeeklyReportEmotionByKeywords(keywordRows, {
      maxEmotions: 6,
      minRatio: 0.05,
      temperature: 0.2,
    });

    const emotionRows = buildEmotionRows(weeklyReportResult.id, weeklyReportEmotionByAi);
    if (emotionRows.length > 0) {
      await insertWeeklyReportEmotions(emotionRows);
    }

    return weeklyReportResult;
  } catch (err) {
    console.error("[createWeeklyReport] REAL ERROR", {
      userId,
      year,
      week,
      name: err?.name,
      message: err?.message,
      stack: err?.stack,
      cause: err?.cause,
    });
    throw new Error("주간 리포트 처리 중 서버 오류가 발생했습니다.", { cause: err });
  }
};

export const readWeeklyReport = async (userId) => {
  try {
    const weeklyReport = await findWeeklyReportByUserIdAndDate(userId);
    if (!weeklyReport) {
      throw new WeeklyReportNotFoundError({ userId });
    }

    const keywords = await findWeeklyReportKeywordByReportId(weeklyReport.id);
    const highlights = await findWeeklyReportHighlightByRId(weeklyReport.id);
    const emotionsRaw = await findWeeklyReportEmotionByRId(weeklyReport.id);

    // count(0..7)별로 그룹핑
    const emotionsByIndex = (emotionsRaw ?? []).reduce((acc, e) => {
      const idx = e.count; // 0..7
      if (!acc[idx]) acc[idx] = [];
      acc[idx].push({ emotion: e.emotion, ratio: e.ratio });
      return acc;
    }, {});

    // ✅ 과거에 summaryText를 JSON.stringify로 저장한 데이터가 남아있을 수 있어 복구 처리
    let summaryText = weeklyReport.summaryText ?? null;
    if (typeof summaryText === "string") {
      const t = summaryText.trim();
      if (
        (t.startsWith('"') && t.endsWith('"')) ||
        (t.startsWith("'") && t.endsWith("'"))
      ) {
        try {
          summaryText = JSON.parse(t);
        } catch (_) {
          // 그냥 원문 유지
        }
      }
    }

    return {
      data: {
        report: {
          id: weeklyReport.id,
          userId: weeklyReport.userId,
          year: weeklyReport.year,
          week: weeklyReport.week,
          summaryText,
          generatedAt: weeklyReport.generatedAt,
        },

        keywords: (keywords ?? []).map((k) => ({
          keyword: k.keyword,
          count: k.count,
        })),

        emotions: emotionsByIndex,

        highlights: (highlights ?? []).map((h) => ({
          letterId: h.letterId,
        })),
      },
    };
  } catch (error) {
    if (error?.code === "P2025") {
      throw new WeeklyReportNotFoundError({ userId });
    }
    throw new WeeklyReportInternalError({
      reason: error.message,
      action: "READ_WEEKLY_REPORT",
      userId,
    });
  }
};

/**
 * 화면에 있어야 할 것
 * 1. 월, 주차 -> 프론트가 보낼테니 알아서
 * 2. ai 태그와 갯수 -> WeeklyReportKeyword.keyword + count
 * 3. highlight 편지 세 개 -> WeeklyReportHighlight.letterId * 3
 * 4. 해당 주차 감정 분포 -> WeeklyReportEmotion.emotion + ratio (count=0)
 * 5. 요일별 감정 흐름 -> WeeklyReportEmotion.emotion + ratio (count=1..7)
 * 6. 주간 마음 편지 (ai) -> WeeklyReport.summaryText
 */
