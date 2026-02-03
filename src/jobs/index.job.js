import { sendScheduledLettersCron } from "./crons/letter.cron.js";
import { startWeeklyReportCron } from "./crons/weeklyReport.cron.js"
import { sendQueuedLettersWorker } from "./bootstraps/letter.bootstrap.js"
import { sendPushNotificationWorker } from "./bootstraps/push.bootstrap.js";
import { sendMailWorker } from "./bootstraps/mail.bootstrap.js";

export const startBatch = async () => {
    startWeeklyReportCron();
    sendScheduledLettersCron();

    sendQueuedLettersWorker();
    sendPushNotificationWorker();
    sendMailWorker();
}