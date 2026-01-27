import { findActiveNotices, findNoticeById } from "../repositories/user.repository.js";
import { InvalidNoticeIdError, NoticeNotFoundError } from "../errors/notice.error.js";

// ------------------------------
// Notice
// ------------------------------
export const getNotices = async () => {
  const items = await findActiveNotices();
  return { items };
};

export const getNoticeDetail = async (noticeId) => {
  const id = Number(noticeId);
  if (!Number.isInteger(id) || id <= 0) {
    throw new InvalidNoticeIdError("NOTICE_INVALID_ID", `noticeId는 양의 정수여야 합니다. noticeId=${noticeId}`, { noticeId });
  }

  const notice = await findNoticeById(id);
  if (!notice) {
    throw new NoticeNotFoundError("NOTICE_NOT_FOUND", `해당 공지사항을 찾을 수 없습니다. noticeId=${id}`, { noticeId: id });
  }

  return notice;
};
