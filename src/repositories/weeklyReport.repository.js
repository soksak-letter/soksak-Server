import { prisma } from "../configs/db.config.js";
import { WeeklyReportInternalError } from "../errors/weeklyReport.error.js"

export async function countSentLettersAiKeywordsByUserId(userId) {
  const grouped = await prisma.LetterAiKeyword.groupBy({
    by: ["keywordId"],
    where: {
      letter: { senderUserId: userId },
    },
    _count: { keywordId: true },
  });

  if (grouped.length === 0) return {};

  const keywordIds = grouped.map((g) => g.keywordId);

  const keywords = await prisma.AiKeyword.findMany({
    where: { id: { in: keywordIds } },
    select: { id: true, name: true },
  });

  const idToName = new Map(keywords.map((k) => [k.id, k.name]));

  const result = {};
  for (const g of grouped) {
    const name = idToName.get(g.keywordId) ?? `keywordId:${g.keywordId}`;
    result[name] = g._count.keywordId;
  }

  return result;
}

/**
 * input: (reportId, keywordCountsObject)
 * output: WeeklyReportKeyword.createMany()에 넣을 data 배열
 *
 * keywordCountsObject 예:
 * { "위로": 12, "일상": 5 }
 *
 * output 예:
 * [
 *   { reportId: 1, keyword: "위로", count: 12 },
 *   { reportId: 1, keyword: "일상", count: 5 }
 * ]
 */
export function toWeeklyReportKeywordRows(reportId, keywordCountsObject) {
  return Object.entries(keywordCountsObject).map(([keyword, count]) => ({
    reportId,
    keyword,
    count: Number(count),
  }));
}

export const insertWeeklyReport = async (userId, year, week, summaryText) => {
  const uid = Number(userId);
  if (!Number.isInteger(uid)) throw new Error("Invalid userId (must be an integer)");

  return prisma.$transaction(async (tx) => {
    const weeklyReport = await tx.WeeklyReport.create({
      data: { userId: uid, year, week, summaryText },
      select: { id: true, userId: true, year: true, week: true },
    });

    const reportId = weeklyReport.id;

    const keywordCounts = await countSentLettersAiKeywordsByUserId(uid);
    const keywordRows = toWeeklyReportKeywordRows(reportId, keywordCounts);

    if (keywordRows.length > 0) {
      await tx.WeeklyReportKeyword.createMany({
        data: keywordRows,
        skipDuplicates: true, // (reportId, keyword) 복합 PK 중복 방지
      });
    }

    return weeklyReport;
  });
};

export const createWeeklyReportHighlightsByLatestLetters = async (
  year,
  week,
  userId,
  take = 3,
  highlightType = "LATEST"
) => {
  // ISO week 시작(월요일) 계산 (UTC 기준)
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const jan4Weekday = jan4.getUTCDay() || 7; // Mon=1..Sun=7

  const week1Start = new Date(jan4);
  week1Start.setUTCDate(jan4.getUTCDate() - (jan4Weekday - 1));
  week1Start.setUTCHours(0, 0, 0, 0);

  const weekStart = new Date(week1Start);
  weekStart.setUTCDate(week1Start.getUTCDate() + (week - 1) * 7);

  const weekEnd = new Date(weekStart);
  weekEnd.setUTCDate(weekStart.getUTCDate() + 7);

  const report = await prisma.WeeklyReport.findFirst({
    where: { userId, year, week },
    orderBy: { generatedAt: "desc" },
    select: { id: true },
  });

  if (!report) {
    // 여기만은 진짜 이상한 케이스라 throw 유지 추천
    throw new WeeklyReportInternalError({
      reason: "WeeklyReport not found for highlight creation",
      action: "CREATE_WEEKLY_REPORT_HIGHLIGHTS",
      userId,
      year,
      week,
    });
  }

  const letters = await prisma.Letter.findMany({
    where: {
      senderUserId: userId,
      createdAt: { gte: weekStart, lt: weekEnd },
    },
    select: { id: true },
    orderBy: { createdAt: "desc" },
    take,
  });

  // ✅ 핵심 수정: 편지 없으면 하이라이트는 0개가 정상일 수 있음
  if (letters.length === 0) {
    return { count: 0 };
  }

  const result = await prisma.WeeklyReportHighlight.createMany({
    data: letters.map((l) => ({
      reportId: report.id,
      letterId: l.id,
      highlightType,
    })),
    skipDuplicates: true,
  });

  // 중복으로 다 무시된 케이스도 "정상적인 0개"로 처리 가능
  return result; // { count }
};



export const findWeeklyReportKeywordByReportId = async(rId) => {
    const result = await prisma.WeeklyReportKeyword.findMany({
        where: {
            reportId: rId
        },
        select: {
            keyword: true,
            count: true,
        }
    })
    return result;
}

export const findWeeklyReportByUserIdAndDate = async(uId) => {
    return await prisma.WeeklyReport.findFirst({
        where: {
            userId: uId,
        },
        orderBy: {
          generatedAt: "desc",
        }
    })
}

export const findWeeklyReportHighlightByRId = async(rId) => {
    return await prisma.WeeklyReportHighlight.findMany({
        where: {
            reportId: rId
        },
        select: {
            letterId: true
        }
    })
}

export const findWeeklyReportEmotionByRId = async(rId) => {
    return await prisma.WeeklyReportEmotion.findMany({
        where: {
            reportId: rId,
        },
        select: {
            emotion: true,
            ratio: true,
            count: true,
        },
        orderBy: [{ count: "asc"}, {ratio: "desc"}]
    })
}

export const insertWeeklyReportEmotion = async (rId, emotion, ratio, dayIndex = 0) => {
  return await prisma.WeeklyReportEmotion.create({
    data: { reportId: rId, emotion, ratio, count: dayIndex },
  });
};

export const insertWeeklyReportEmotions = async (rows) => {
  if (!rows?.length) return { count: 0 };

  return prisma.WeeklyReportEmotion.createMany({
    data: rows.map((r) => ({
      reportId: r.reportId,
      emotion: r.emotion,
      ratio: r.ratio,
      count: r.count, // ✅ 0..7 (주간/요일 인덱스)
    })),
    // skipDuplicates: true, // 아래 "스키마 이슈" 해결 전에는 켜도 데이터가 일부만 들어갈 수 있음
  });
};

//WeeklyReport O, WeeklyReportEmotion, WeeklyReportKeyword O, WeeklyReportHighlight O 넷 다 트랜잭션으로 묶기