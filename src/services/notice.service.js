import { findActiveNotices, findNoticeById } from "../repositories/user.repository.js";
import { NoticeNotFoundError } from "../errors/notice.error.js";

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

// sendNoticePushNotification 함수는 삭제됨
// jobs/bootstraps/push.bootstrap.js의 sendNoticePushNotifications로 대체됨
// 비동기 메시지 큐(BullMQ)를 통해 처리됩니다.
