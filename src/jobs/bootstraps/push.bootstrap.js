import { Queue, Worker } from "bullmq";
import { ioredisConnection } from "../../configs/db.config.js";
import { sendPushNotification } from "../../services/push.service.js";
import { findRecentNotices, findUsersWithMarketingPushEnabled } from "../../repositories/user.repository.js";
import { enqueueJob } from "../../utils/queue.util.js";

export const pushQueue = new Queue("send-push", { connection: ioredisConnection });

export const sendPushNotificationWorker = () => {
    const worker = new Worker("send-push", async (job) => {
        if(job.name === "PUSH_BY_LETTER") {
            console.log(`[Job Start] 푸시알람 전송 중.`);
            await sendPushNotification(job.data);

            console.log(`[Job Success] 푸시 알람 전송에 성공했습니다.`);
        }

        if(job.name === "PUSH_BY_NOTICE") {
            console.log(`[Job Start] 공지사항 푸시알림 전송 중. userId: ${job.data.userId}`);
            await sendPushNotification({
                userId: job.data.userId,
                type: "NOTICE",
                data: {},
                useMarketing: true,
            });

            console.log(`[Job Success] 공지사항 푸시 알림 전송에 성공했습니다. userId: ${job.data.userId}`);
        }
    }, {connection: ioredisConnection});
    
    worker.on('failed', (job, err) => {
        console.error(`[Job Failed] ID: ${job.id} | 에러: ${err.message}`);
    });

    worker.on('error', (err) => {
        console.error(`[Worker Error] 시스템 오류: ${err.message}`);
    });
};

/**
 * 최근 공지사항을 찾아서 큐에 푸시 알림 job 추가
 */
export const sendNoticePushNotifications = async () => {
    // 10분 이내 생성된 공지사항 조회 (기존 함수 재사용)
    const recentNotices = await findRecentNotices(10);

    if (recentNotices.length === 0) {
        console.log("[Cron Info] 최근 10분 이내 생성된 공지사항이 없습니다.");
        return { queued: 0, notices: [] };
    }

    console.log(`[Cron Info] ${recentNotices.length}개의 최근 공지사항을 찾았습니다.`);

    // marketingEnabled: true인 사용자 조회 (기존 함수 재사용)
    const userIds = await findUsersWithMarketingPushEnabled();

    if (userIds.length === 0) {
        console.log("[Cron Info] 푸시 알림이 활성화된 사용자가 없습니다.");
        return { queued: 0, notices: recentNotices, users: 0 };
    }

    console.log(`[Cron Info] ${userIds.length}명의 사용자에게 푸시 알림을 큐에 추가합니다.`);

    // 각 사용자에게 푸시 알림 job 추가
    const jobs = await Promise.allSettled(
        userIds.map((userId) =>
            enqueueJob(pushQueue, "PUSH_BY_NOTICE", { userId })
        )
    );

    const successCount = jobs.filter((r) => r.status === "fulfilled").length;
    const failCount = jobs.filter((r) => r.status === "rejected").length;

    console.log(`[Cron Success] 푸시 알림 job 추가 완료: 성공 ${successCount}건, 실패 ${failCount}건`);

    return {
        queued: successCount,
        failed: failCount,
        notices: recentNotices,
        users: userIds.length,
    };
};