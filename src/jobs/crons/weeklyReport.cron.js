// jobs/weeklyReport.cron.js
import cron from "node-cron";
import { bootstrapWeeklyReports } from "../bootstraps/weeklyReport.bootstrap.js";

export const startWeeklyReportCron = () => {
  // 매주 월요일 00:05 KST에 실행 (주차 갱신 직후)
  cron.schedule(
    "5 0 * * 1",
    async () => {
      await bootstrapWeeklyReports();
    },
    { timezone: "Asia/Seoul" }
  );
};
