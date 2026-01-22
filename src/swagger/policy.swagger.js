/**
 * @swagger
 * /policies/community-guidelines:
 *   get:
 *     summary: 커뮤니티 가이드라인 조회
 *     description: 커뮤니티 가이드라인 문서를 조회합니다.
 *     tags: [정책]
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
 *                     title:
 *                       type: string
 *                       example: 커뮤니티 가이드라인
 *                     content:
 *                       type: string
 *                       description: 가이드라인 내용
 *       404:
 *         description: 문서를 찾을 수 없음
 */

/**
 * @swagger
 * /policies/terms:
 *   get:
 *     summary: 서비스 이용약관 조회
 *     description: 서비스 이용약관 문서를 조회합니다.
 *     tags: [정책]
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
 *                     title:
 *                       type: string
 *                       example: 서비스 이용약관
 *                     content:
 *                       type: string
 *                       description: 이용약관 내용
 *       404:
 *         description: 문서를 찾을 수 없음
 */

/**
 * @swagger
 * /policies/privacy:
 *   get:
 *     summary: 개인정보 처리방침 조회
 *     description: 개인정보 처리방침 문서를 조회합니다.
 *     tags: [정책]
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
 *                     title:
 *                       type: string
 *                       example: 개인정보 처리방침
 *                     content:
 *                       type: string
 *                       description: 개인정보 처리방침 내용
 *       404:
 *         description: 문서를 찾을 수 없음
 */
