import { sendScheduledLettersCron } from "./crons/letter.cron.js";
import { startWeeklyReportCron } from "./crons/weeklyReport.cron.js"
import { sendQueuedLettersWorker } from "./bootstraps/letter.bootstrap.js"

export const startBatch = async () => {
    startWeeklyReportCron();
    sendScheduledLettersCron();

    sendQueuedLettersWorker();
}