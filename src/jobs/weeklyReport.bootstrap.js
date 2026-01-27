// jobs/weeklyReport.bootstrap.js
import { prisma } from "../configs/db.config.js";
import { getCurrentISOYear, getCurrentISOWeek } from "../jobs/date.js";
import { createWeeklyReport } from "../services/weeklyReport.service.js";

const CONCURRENCY = Number(process.env.WEEKLY_REPORT_CONCURRENCY ?? 2);

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export const bootstrapWeeklyReports = async () => {
  const year = getCurrentISOYear();
  const week = getCurrentISOWeek();

  const users = await prisma.user.findMany({
    where: { isDeleted: false },
    select: { id: true },
  });

  const logError = (userId, e) => {
    console.error("[BOOTSTRAP_WEEKLY_REPORT_ERROR]", {
      userId,
      year,
      week,
      name: e?.name,
      message: e?.message,
      stack: e?.stack,
      cause: e?.cause,
    });
  };

  for (let i = 0; i < users.length; i += CONCURRENCY) {
    const batch = users.slice(i, i + CONCURRENCY);

    await Promise.allSettled(
      batch.map(({ id }) =>
        createWeeklyReport(id, year, week).catch((e) => {
          logError(id, e);
          // ❗ 여기서 throw 안 해도 됨 (allSettled라 의미 없음)
          return null;
        })
      )
    );

    // ✅ 배치 간 쉬어주면 TPM 스파이크가 훨씬 줄어듦
    await sleep(Number(process.env.WEEKLY_REPORT_BATCH_DELAY_MS ?? 800));
  }
};
