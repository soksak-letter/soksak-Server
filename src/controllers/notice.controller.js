import { getNotices, getNoticeDetail } from "../services/notice.service.js";

// ========== Notice Controllers ==========
export const handleGetNotices = async (req, res, next) => {
  try {
    const data = await getNotices();
    return res.status(200).success(data);
  } catch (err) {
    next(err);
  }
};

export const handleGetNoticeDetail = async (req, res, next) => {
  try {
    const { noticeId } = req.params;
    const data = await getNoticeDetail(noticeId);
    return res.status(200).success(data);
  } catch (err) {
    next(err);
  }
};
