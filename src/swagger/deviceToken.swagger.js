/**
 * @swagger
 * tags:
 *   name: DeviceToken
 *   description: Device Token Management
 */

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
