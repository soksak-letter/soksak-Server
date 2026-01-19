/**
 * @swagger
 * /interests/all:
 *   get:
 *     summary: 관심사 조회
 *     description: 전체 활성 관심사 목록을 조회합니다. (로그인 불필요)
 *     tags: [온보딩]
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
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             description: 관심사 ID
 *                           name:
 *                             type: string
 *                             description: 관심사 이름
 */

/**
 * @swagger
 * /interests:
 *   get:
 *     summary: 태그 목록 조회
 *     description: 내가 선택한 관심사 목록을 조회합니다. (로그인 필요)
 *     tags: [온보딩]
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
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             description: 관심사 ID
 *                           name:
 *                             type: string
 *                             description: 관심사 이름
 *       401:
 *         description: 인증 실패
 */

/**
 * @swagger
 * /users/me/onboarding/interests:
 *   put:
 *     summary: 관심사 저장
 *     description: 사용자의 관심사를 저장합니다. 최소 3개 이상 선택해야 합니다.
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
 *               - interestIds
 *             properties:
 *               interestIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 minItems: 3
 *                 description: 관심사 ID 배열 (최소 3개)
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
 *         description: 잘못된 요청 (관심사가 3개 미만이거나 유효하지 않은 ID 포함)
 *       401:
 *         description: 인증 실패
 */
