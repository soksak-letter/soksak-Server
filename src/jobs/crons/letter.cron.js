import cron from "node-cron";
import { sendScheduledLetters } from "../bootstraps/letter.bootstrap.js";

export const sendScheduledLettersCron = () => {
    cron.schedule(
        '0 0 * * *', 
        async () => {
            console.log("편지 전송을 시작합니다.");
            await sendScheduledLetters();
        }, 
        {
            scheduled: false,
            timezone: "Asia/Seoul"
        }
    );
}