import { updateMyNotificationSettings } from "../services/notification.service.js";
import { getMyNotificationSettings } from "../services/notification.service.js";

/**
 * @swagger
 * /users/me/notification-settings:
 *   get:
 *     summary: 알림 설정 조회
 *     description: 사용자의 알림 설정을 조회합니다.
 *     tags: [알림/설정]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultType:
 *                   type: string
 *                   example: SUCCESS
 *                 error:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 success:
 *                   type: object
 *                   properties:
 *                     letter:
 *                       type: boolean
 *                       description: 편지 알림 설정
 *                     marketing:
 *                       type: boolean
 *                       description: 마케팅 알림 설정
 *       401:
 *         description: 인증 실패
 */
// 알람 설정 조회

/**
 * @swagger
 * /users/me/notification-settings:
 *   patch:
 *     summary: 알림 설정 갱신
 *     description: 사용자의 알림 설정을 업데이트합니다.
 *     tags: [알림/설정]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               letter:
 *                 type: boolean
 *                 description: 편지 알림 설정
 *               marketing:
 *                 type: boolean
 *                 description: 마케팅 알림 설정
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultType:
 *                   type: string
 *                   example: SUCCESS
 *                 error:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 success:
 *                   type: object
 *                   properties:
 *                     updated:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: 잘못된 요청 (letter 또는 marketing 중 하나 이상이 boolean이어야 함)
 *       401:
 *         description: 인증 실패
 */
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