import { Queue, Worker } from "bullmq";
import { sendReservedLetter } from "../../repositories/letter.repository.js";
import { getDayStartAndEnd } from "../../utils/date.util.js"
import { ioredisConnection } from "../../configs/db.config.js";
import { sendQueuedLetters } from "../../services/letter.service.js";

export const sendScheduledLetters = async () => {
    const today = new Date();
    const { startTime, endTime } = getDayStartAndEnd(today);

    const isUpdated = await sendReservedLetter({startTime, endTime});
    if(isUpdated != 0){
        console.log("[Cron Success] 편지 전송에 성공했습니다.");
    }
}

export const letterQueue = new Queue("letter-matching", { connection: ioredisConnection });

export const sendQueuedLettersWorker = () => {
    const worker = new Worker("letter-matching", async (job) => {
        if(job.name === "MATCH_BY_LETTER") {
            console.log(`[Job Start] ${job.data.letterId}번 편지 매칭중`);
            await sendQueuedLetters(job.data);

            console.log(`[Job Success] 편지 전송에 성공했습니다.`);
        }
    }, {connection: ioredisConnection});

    worker.on('failed', (job, err) => {
        console.error(`[Job Failed] ID: ${job.id} | 에러: ${err.message}`);
    });

    worker.on('error', (err) => {
        console.error(`[Worker Error] 시스템 오류: ${err.message}`);
    });
}