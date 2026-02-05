import cron from "node-cron";
import { sendNoticePushNotifications } from "../bootstraps/push.bootstrap.js";

export const sendNoticePushCron = () => {
    // 10분마다 실행
    cron.schedule(
        '*/10 * * * *',
        async () => {
            console.log("[Cron Start] 공지사항 푸시 알림 전송을 시작합니다.");
            await sendNoticePushNotifications();
        },
        {
            scheduled: true,
            timezone: "Asia/Seoul"
        }
    );
};
