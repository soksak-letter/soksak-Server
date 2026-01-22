import { findActiveNotices, findNoticeById } from "../repositories/notice.repository.js";
import { InvalidNoticeIdError, NoticeNotFoundError } from "../errors/notice.error.js";

export const getNotices = async () => {
  const items = await findActiveNotices();
  return { items };
};

export const getNoticeDetail = async (noticeId) => {
  const id = Number(noticeId);
  if (!Number.isInteger(id) || id <= 0) throw new InvalidNoticeIdError(noticeId);

  const notice = await findNoticeById(id);
  if (!notice) throw new NoticeNotFoundError(id);

  return notice;
};
