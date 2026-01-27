import { findUserById } from "../repositories/user.repository.js";
import { InvalidUserError } from "../errors/user.error.js";
import {
  countSentLettersAiKeywordsByUserId,
  insertWeeklyReport,
  findWeeklyReportKeywordByReportId,
  findWeeklyReportByUserIdAndDate,
  findWeeklyReportHighlightByRId,
  findWeeklyReportEmotionByRId,
  insertWeeklyReportEmotion,
  createWeeklyReportHighlightsByLatestLetters,
  insertWeeklyReportEmotions
} from "../repositories/weeklyReport.repository.js";
import {
  WeeklyReportNotFoundError,
  WeeklyReportAlreadyExistsError,
  WeeklyReportInternalError,
} from "../errors/weeklyReport.error.js";

async function weeklyReportKeywordsToString(keywords) {
  if (!keywords) return "";

  // 1) 이미 배열이면 그대로
  if (Array.isArray(keywords)) {
    return keywords
      .map(({ keyword, count }) => `${keyword}(${count})`)
      .join(", ");
  }

  // 2) 객체({키워드: count})면 entries로 변환
  if (typeof keywords === "object") {
    return Object.entries(keywords)
      .map(([keyword, count]) => `${keyword}(${count})`)
      .join(", ");
  }

  return "";
}

export const createWeeklyReport = async (userId, year, week) => {
  const user = await findUserById(userId);
  if (user == null) throw new InvalidUserError();
  try {
    const weeklyReport = await findWeeklyReportByUserIdAndDate(
      userId,
      year,
      week
    );
    if (weeklyReport != null)
      throw new WeeklyReportAlreadyExistsError(undefined, undefined, { userId, year, week });
    const keyWordResult = await countSentLettersAiKeywordsByUserId(userId);
    const keyWordResultAsString = weeklyReportKeywordsToString(keyWordResult);
    //위의 weeklyReportKeyword 기반 ai 처리로 텍스트 return -> WeeklyReport의 summaryText에 저장
    const summaryTextByAi = "잘했어요";
    const weeklyReportResult = await insertWeeklyReport(userId, year, week, summaryTextByAi);
    const highlight = await createWeeklyReportHighlightsByLatestLetters(year, week, userId);
    const weeklyReportKeywords = await findWeeklyReportKeywordByReportId(
      weeklyReportResult.id
    );
    const weeklyReportKeyword = await weeklyReportKeywordsToString(
      weeklyReportKeywords
    ); 
    //위의 weeklyReportKeyword 기반으로 ai 처리해 사전 지정된 감정들 return -> WeeklyReportEmotion에 저장
    const weeklyReportEmotionByAi = {
  0: [ // ✅ 주간 요약
    { emotion: "평온", ratio: 0.28 },
    { emotion: "기쁨", ratio: 0.22 },
    { emotion: "감사", ratio: 0.16 },
    { emotion: "불안", ratio: 0.14 },
    { emotion: "피로", ratio: 0.12 },
    { emotion: "슬픔", ratio: 0.08 },
  ],

  1: [ // 월
    { emotion: "불안", ratio: 0.40 },
    { emotion: "피로", ratio: 0.35 },
    { emotion: "평온", ratio: 0.25 },
  ],
  2: [ // 화
    { emotion: "평온", ratio: 0.45 },
    { emotion: "감사", ratio: 0.30 },
    { emotion: "기쁨", ratio: 0.25 },
  ],
  3: [ // 수
    { emotion: "기쁨", ratio: 0.50 },
    { emotion: "평온", ratio: 0.30 },
    { emotion: "피로", ratio: 0.20 },
  ],
  4: [ // 목
    { emotion: "피로", ratio: 0.45 },
    { emotion: "불안", ratio: 0.30 },
    { emotion: "평온", ratio: 0.25 },
  ],
  5: [ // 금
    { emotion: "기쁨", ratio: 0.55 },
    { emotion: "감사", ratio: 0.30 },
    { emotion: "평온", ratio: 0.15 },
  ],
  6: [ // 토
    { emotion: "평온", ratio: 0.50 },
    { emotion: "기쁨", ratio: 0.30 },
    { emotion: "감사", ratio: 0.20 },
  ],
  7: [ // 일
    { emotion: "슬픔", ratio: 0.35 },
    { emotion: "평온", ratio: 0.35 },
    { emotion: "감사", ratio: 0.30 },
  ],
};


const emotionRows = Object.entries(weeklyReportEmotionByAi).flatMap(([dayIndex, list]) =>
  list.map(({ emotion, ratio }) => ({
    reportId: weeklyReportResult.id,
    emotion,
    ratio,
    count: Number(dayIndex), // ✅ 0..7
  }))
);
await insertWeeklyReportEmotions(emotionRows);
    return weeklyReportResult;
  } catch (error) {
    if (error?.code === "P2025") {
      throw new WeeklyReportNotFoundError(undefined, undefined, {
        userId,
        year,
        week,
      });
    } else if (error?.code === "P2002") {
      throw new WeeklyReportAlreadyExistsError(undefined, undefined, {
        userId,
        year,
        week,
      });
    }

    throw new WeeklyReportInternalError(undefined, undefined, {
      reason: error.message,
      action: "CREATE_WEEKLY_REPORT",
      userId,
      year,
      week,
    });
  }
};

export const readWeeklyReport = async (userId, year, week) => {
  try {
    const weeklyReport = await findWeeklyReportByUserIdAndDate(userId, year, week);
    if (!weeklyReport) {
      throw new WeeklyReportNotFoundError(undefined, undefined, { userId, year, week });
    }

    console.log("DDD" + JSON.stringify(weeklyReport));

    const keywords = await findWeeklyReportKeywordByReportId(weeklyReport.id);
    console.log("DDD" + (weeklyReport.summaryText ?? "null") + "   " + weeklyReport.id);

    const highlights = await findWeeklyReportHighlightByRId(weeklyReport.id);
    const emotionsRaw = await findWeeklyReportEmotionByRId(weeklyReport.id);

// count(0..7)별로 그룹핑
const emotionsByIndex = (emotionsRaw ?? []).reduce((acc, e) => {
  const idx = e.count; // 0..7
  if (!acc[idx]) acc[idx] = [];
  acc[idx].push({ emotion: e.emotion, ratio: e.ratio });
  return acc;
}, {});

    return {
      status: 200,
      message: "주간 리포트 조회 성공",
      data: {
        report: {
          id: weeklyReport.id,
          userId: weeklyReport.userId,
          year: weeklyReport.year,
          week: weeklyReport.week,
          summaryText: weeklyReport.summaryText ?? null,
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
      throw new WeeklyReportNotFoundError(undefined, undefined, { userId, year, week });
    }
    throw new WeeklyReportInternalError(undefined, undefined, {
      reason: error.message,
      action: "READ_WEEKLY_REPORT",
      userId,
      year,
      week,
    });
  }
};

/**
 * 화면에 있어야 할 것
 * 1. 월, 주차 -> 프론트가 보낼테니 알아서
 * 2. ai 태그와 갯수 -> WeeklyReportKeyword.keyword + count
 * 3. highlight 편지 세 개 -> WeeklyReportHighlight.letterId * 3
 * 4. 해당 주차 감정 분포 -> WeeklyReportEmotion.emotion + ratio
 * 5. 요일별 감정 흐름 -> ㅅㅂ;;
 * 6. 주간 마음 편지 (ai) -> WeeklyReport.summaryText
 */
