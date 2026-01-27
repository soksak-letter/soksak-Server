import { sendScheduledLettersCron } from "./crons/letter.cron.js";
import { startWeeklyReportCron } from "./crons/weeklyReport.cron.js"

export const startBatch = async () => {
    startWeeklyReportCron();
    sendScheduledLettersCron();
}