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
