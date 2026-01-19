/**
 * @swagger
 * tags:
 *   name: Consent
 *   description: Information Consent Management
 */

/**
 * @swagger
 * /users/me/consents:
 *   get:
 *     summary: 정보 동의 설정 조회
 *     description: 사용자의 정보 동의 설정을 조회합니다.
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
 *                     termsAgreed:
 *                       type: boolean
 *                       description: 이용약관 동의 여부
 *                     privacyAgreed:
 *                       type: boolean
 *                       description: 개인정보 처리방침 동의 여부
 *                     ageOver14Agreed:
 *                       type: boolean
 *                       description: 만 14세 이상 동의 여부
 *                     marketingAgreed:
 *                       type: boolean
 *                       description: 마케팅 정보 수신 동의 여부
 *       401:
 *         description: 인증 실패
 */

/**
 * @swagger
 * /users/me/consents:
 *   patch:
 *     summary: 정보 동의 설정 갱신
 *     description: 사용자의 정보 동의 설정을 업데이트합니다.
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
 *               termsAgreed:
 *                 type: boolean
 *                 description: 이용약관 동의 여부
 *               privacyAgreed:
 *                 type: boolean
 *                 description: 개인정보 처리방침 동의 여부
 *               marketingAgreed:
 *                 type: boolean
 *                 description: 마케팅 정보 수신 동의 여부
 *               ageOver14Agreed:
 *                 type: boolean
 *                 description: 만 14세 이상 동의 여부
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
 *         description: 잘못된 요청 (모든 값은 boolean이어야 함)
 *       401:
 *         description: 인증 실패
 */
