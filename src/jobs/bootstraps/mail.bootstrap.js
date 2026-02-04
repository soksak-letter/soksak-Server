import { Queue, Worker } from "bullmq";
import { ioredisConnection } from "../../configs/db.config.js";
import { transporter } from "../../configs/mailer.config.js";

export const mailQueue = new Queue("send-mail", {connection: ioredisConnection});

export const sendMailWorker = () => {
    const worker = new Worker("send-mail", async (job) => {
        if(job.name === "SEND_MAIL_FOR_CODE") {
            console.log(`[Job Start] 인증코드 전송 중.`);

            await transporter.sendMail(job.data);

            console.log(`[Job Success] 인증코드 전송에 성공했습니다.`);
        }
    }, {connection: ioredisConnection});

    worker.on('failed', (job, err) => {
        console.error(`[Job Failed] ID: ${job.id} | 에러: ${err.message}`);
    });

    worker.on('error', (err) => {
        console.error(`[Worker Error] 시스템 오류: ${err.message}`);
    });
}