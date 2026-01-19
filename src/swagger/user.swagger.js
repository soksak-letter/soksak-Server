/**
 * @swagger
 * tags:
 *   name: User
 *   description: User Management
 */

/**
 * @swagger
 * /users/me/onboarding:
 *   patch:
 *     summary: 기본정보 저장
 *     description: 사용자의 성별과 직업 정보를 저장합니다.
 *     tags: [온보딩]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - gender
 *               - job
 *             properties:
 *               gender:
 *                 type: string
 *                 enum: [MALE, FEMALE, UNKNOWN]
 *                 description: 성별 (UNKNOWN = 비공개)
 *               job:
 *                 type: string
 *                 enum: [WORKER, STUDENT, HOUSEWIFE, FREELANCER, UNEMPLOYED, OTHER]
 *                 description: 직업
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
 *         description: 잘못된 요청 (gender 또는 job 값이 올바르지 않음)
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 유저를 찾을 수 없음
 *       409:
 *         description: 이미 온보딩이 완료된 사용자
 */
