// jobs/weeklyReport.bootstrap.js
import { prisma } from "../db.config.js";
import { getCurrentISOYear, getCurrentISOWeek } from "../jobs/date.js";
import { createWeeklyReport } from "../services/weeklyReport.service.js"; 
// ↑ 너가 올린 createWeeklyReport(서비스) 함수 이름을 이렇게 바꾸는 걸 추천

export const bootstrapWeeklyReports = async () => {
  const year = getCurrentISOYear();
  const week = getCurrentISOWeek();

  const users = await prisma.User.findMany({
    where: { isDeleted: false },
    select: { id: true },
  });

  for (const u of users) {
    try {
      await createWeeklyReport(u.id, year, week);
    } catch (e) {
      // 이미 존재/중복이면 조용히 스킵 (너 로직에서 이미 막음)
      if (e?.code === "P2002") continue;
      // 도메인 에러라면 errorCode로도 스킵 가능
      if (e?.errorCode === "WEEKLY_REPORT_409_01") continue;

      console.error("[BOOTSTRAP_WEEKLY_REPORT_ERROR]", {
        userId: u.id,
        message: e?.message,
        code: e?.code,
      });
    }
  }
};
