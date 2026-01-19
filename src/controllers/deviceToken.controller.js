import { updateMyDeviceToken } from "../services/deviceToken.service.js";

/**
 * @swagger
 * /users/me/device-tokens:
 *   put:
 *     summary: 디바이스 토큰 갱신
 *     description: 사용자의 디바이스 토큰을 업데이트합니다.
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
 *               deviceToken:
 *                 type: string
 *                 description: 디바이스 토큰
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
 *       401:
 *         description: 인증 실패
 */
export const handlePutMyDeviceToken = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { deviceToken } = req.body ?? {};

    const result = await updateMyDeviceToken({ userId, deviceToken });

    return res.status(200).json({
      resultType: "SUCCESS",
      error: null,
      success: result,
    });
  } catch (err) {
    const status = err.status ?? 500;
    const code = err.code ?? "INTERNAL_SERVER_ERROR";
    const message = err.message ?? "서버 내부 오류";

    return res.status(status).json({
      resultType: "ERROR",
      error: { code, message },
      success: null,
    });
  }
};
