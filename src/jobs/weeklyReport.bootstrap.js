// jobs/weeklyReport.bootstrap.js
import { prisma } from "../db.config.js";
import { getCurrentISOYear, getCurrentISOWeek } from "../jobs/date.js";
import { createWeeklyReport } from "../services/weeklyReport.service.js";

const FAIL_FAST = (process.env.WEEKLY_REPORT_FAIL_FAST ?? "false") === "true";

export const bootstrapWeeklyReports = async () => {
  const year = getCurrentISOYear();
  const week = getCurrentISOWeek();

  const users = await prisma.user.findMany({
    where: { isDeleted: false },
    select: { id: true },
  });

  for (const u of users) {
    try {
      await createWeeklyReport(u.id, year, week);
    } catch (e) {
      console.error("[BOOTSTRAP_WEEKLY_REPORT_ERROR]", {
        userId: u.id,
        year,
        week,
        name: e?.name,
        message: e?.message,
        stack: e?.stack,
        cause: e?.cause,
      });

      if (FAIL_FAST) throw e;
      continue;
    }
  }
};
