import { getNoticeDetail, getNotices } from "../services/user.service.js";

export const handleGetNotices = async (req, res, next) => {
  try {
    const data = await getNotices();
    return res.status(200).json({ resultType: "SUCCESS", error: null, success: data });
  } catch (err) {
    next(err);
  }
};

export const handleGetNoticeDetail = async (req, res, next) => {
  try {
    const { noticeId } = req.params;
    const data = await getNoticeDetail(noticeId);
    return res.status(200).json({ resultType: "SUCCESS", error: null, success: data });
  } catch (err) {
    next(err);
  }
};
