import { updateMyNotificationSettings, getMyNotificationSettings } from "../services/user.service.js";

// 알람 설정 조회
export const handleUpdateMyNotificationSettings = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new Error("인증 정보가 없습니다.");

    const { letter, marketing } = req.body;

    const result = await updateMyNotificationSettings({ userId, letter, marketing });

    return res.status(200).success(result); // { updated: true }
  } catch (err) {
    next(err);
  }
};

export const handleGetMyNotificationSettings = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new Error("인증 정보가 없습니다.");

    const result = await getMyNotificationSettings({ userId });

    return res.status(200).success(result); // { letter: true, marketing: false }
  } catch (err) {
    next(err);
  }
};