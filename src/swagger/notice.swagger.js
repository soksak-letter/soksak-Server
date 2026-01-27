/**
 * @swagger
 * /notices:
 *   get:
 *     summary: 공지사항 목록
 *     description: 활성화된 공지사항 목록을 조회합니다.
 *     tags: [공지]
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
 *                           title:
 *                             type: string
 *                           content:
 *                             type: string
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 */

/**
 * @swagger
 * /notices/{noticeId}:
 *   get:
 *     summary: 공지사항 상세 조회
 *     description: 특정 공지사항의 상세 내용을 조회합니다.
 *     tags: [공지]
 *     parameters:
 *       - in: path
 *         name: noticeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 공지사항 ID
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
 *                     id:
 *                       type: integer
 *                     title:
 *                       type: string
 *                     content:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: |
 *           잘못된 요청:
 *           - `REQ_BAD_REQUEST`: 요청 유효성 검사 실패
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "REQ_BAD_REQUEST"
 *                         reason:
 *                           example: "입력값이 잘못되었습니다"
 *       404:
 *         description: |
 *           공지사항을 찾을 수 없음:
 *           - `NOTICE_NOT_FOUND`: 해당 공지사항을 찾을 수 없습니다.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "NOTICE_NOT_FOUND"
 *                         reason:
 *                           example: "해당 공지사항을 찾을 수 없습니다."
 */
