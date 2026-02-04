import { findActiveNotices, findNoticeById, findRecentNotices, findUsersWithMarketingPushEnabled } from "../repositories/user.repository.js";
import { NoticeNotFoundError } from "../errors/notice.error.js";
import { sendPushNotification } from "./push.service.js";

// ------------------------------
// Notice
// ------------------------------
export const getNotices = async () => {
  const items = await findActiveNotices();
  return { items };
};

export const getNoticeDetail = async (noticeId) => {
  const id = Number(noticeId);

  const notice = await findNoticeById(id);
  if (!notice) {
    throw new NoticeNotFoundError("NOTICE_NOT_FOUND", `해당 공지사항을 찾을 수 없습니다. noticeId=${id}`, { noticeId: id });
  }

  return notice;
};

export const sendNoticePushNotification = async () => {
  // 10분 이내 생성된 공지사항 조회
  const recentNotices = await findRecentNotices(10);

  if (recentNotices.length === 0) {
    console.log("최근 10분 이내 생성된 공지사항이 없습니다.");
    return { sent: 0, notices: [] };
  }

  console.log(`${recentNotices.length}개의 최근 공지사항을 찾았습니다.`);

  // marketingEnabled: true인 사용자 조회
  const userIds = await findUsersWithMarketingPushEnabled();

  if (userIds.length === 0) {
    console.log("푸시 알림이 활성화된 사용자가 없습니다.");
    return { sent: 0, notices: recentNotices, users: 0 };
  }

  console.log(`${userIds.length}명의 사용자에게 푸시 알림을 전송합니다.`);

  // 각 사용자에게 푸시 알림 전송
  const results = await Promise.allSettled(
    userIds.map((userId) =>
      sendPushNotification({
        userId,
        type: "NOTICE",
        data: {},
        useMarketing: true, // marketingEnabled 체크
      })
    )
  );

  const successCount = results.filter((r) => r.status === "fulfilled").length;
  const failCount = results.filter((r) => r.status === "rejected").length;

  console.log(`푸시 알림 전송 완료: 성공 ${successCount}건, 실패 ${failCount}건`);

  return {
    sent: successCount,
    failed: failCount,
    notices: recentNotices,
    users: userIds.length,
  };
};
