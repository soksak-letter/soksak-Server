import { Queue, Worker } from "bullmq";
import { ioredisConnection } from "../../configs/db.config.js";
import { sendPushNotification } from "../../services/push.service.js";

export const pushQueue = new Queue("send-push", { connection: ioredisConnection });

export const sendPushNotificationWorker = () => {
    const worker = new Worker("send-push", async (job) => {
        if(job.name === "PUSH_BY_LETTER") {
            console.log(`[Job Start] 푸시알람 전송 중.`);
            await sendPushNotification(job.data);

            console.log(`[Job Success] 푸시 알람 전송에 성공했습니다.`);
        }
    }, {connection: ioredisConnection});
    
    worker.on('failed', (job, err) => {
        console.error(`[Job Failed] ID: ${job.id} | 에러: ${err.message}`);
    });

    worker.on('error', (err) => {
        console.error(`[Worker Error] 시스템 오류: ${err.message}`);
    });
}