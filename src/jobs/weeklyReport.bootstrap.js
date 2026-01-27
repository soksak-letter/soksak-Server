// jobs/weeklyReport.bootstrap.js
import { prisma } from "../configs/db.config.js";
import { getCurrentISOYear, getCurrentISOWeek } from "../jobs/date.js";
import { createWeeklyReport } from "../services/weeklyReport.service.js";

// 동시에 몇 명까지 처리할지(너무 크게 잡으면 DB 터짐)
const CONCURRENCY = Number(15);

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

      const results = await Promise.allSettled(
        batch.map(({ id }) =>
          createWeeklyReport(id, year, week).catch((e) => {
            logError(id, e);
            throw e;
          })
        )
      );
  }
};
