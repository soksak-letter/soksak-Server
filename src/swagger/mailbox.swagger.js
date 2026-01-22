/**
 * @swagger
 * /mailbox/anonymous:
 *   get:
 *     summary: 익명 탭 목록 조회
 *     description: 익명으로 받은 편지의 스레드 목록을 조회합니다. senderUserId별 최신 편지 1개씩 반환됩니다.
 *     tags: [편지함]
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
 *                           threadId:
 *                             type: integer
 *                             description: 스레드 ID (senderUserId)
 *                           sender:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                               nickname:
 *                                 type: string
 *                                 nullable: true
 *                           lastLetterId:
 *                             type: integer
 *                           lastLetterTitle:
 *                             type: string
 *                           lastLetterPreview:
 *                             type: string
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             nullable: true
 *                           paperId:
 *                             type: integer
 *                             nullable: true
 *                             description: 편지통 색상
 *       401:
 *         description: 인증 실패
 */

/**
 * @swagger
 * /mailbox/anonymous/threads/{threadId}/letters:
 *   get:
 *     summary: 익명 스레드 편지 목록 조회
 *     description: 특정 익명 스레드의 편지 목록을 조회합니다.
 *     tags: [편지함]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: threadId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 스레드 ID (senderUserId)
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
 *                           deliveredAt:
 *                             type: string
 *                             format: date-time
 *                             nullable: true
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             nullable: true
 *                           design:
 *                             type: object
 *                             properties:
 *                               paperId:
 *                                 type: integer
 *                                 nullable: true
 *                               stampId:
 *                                 type: integer
 *                                 nullable: true
 *                               fontId:
 *                                 type: integer
 *                                 nullable: true
 *       400:
 *         description: 잘못된 threadId
 *       401:
 *         description: 인증 실패
 */

/**
 * @swagger
 * /mailbox/friends/threads/{friendId}/letters:
 *   get:
 *     summary: 친구 스레드 편지 목록 조회
 *     tags: [편지함]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: friendId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - properties:
 *                     success:
 *                       type: object
 *                       properties:
 *                         friendName:
 *                           type: string
 *                         firstQuestion:
 *                           type: string
 *                         letters:
 *                           type: array
 *                           items:
 *                             type: object
 *       401:
 *         description: |
 *           인증 실패:
 *           - `AUTH_TOKEN_EXPIRED`: 토큰이 만료되었습니다.
 *           - `AUTH_INVALID_TOKEN`: 액세스 토큰이 아니거나 유효하지 않습니다.
 *           - `AUTH_NOT_ACCESS_TOKEN`: 액세스 토큰이 아닙니다.
 *           - `AUTH_EXPIRED_TOKEN`: 이미 로그아웃된 토큰입니다.
 *           - `AUTH_UNAUTHORIZED`: 액세스 토큰이 유효하지 않습니다.
 *           - `AUTH_NOT_FOUND`: 인증 토큰이 없습니다.
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - allOf:
 *                   - $ref: '#/components/schemas/ErrorResponse'
 *                   - properties:
 *                       error:
 *                         properties:
 *                           errorCode:
 *                             example: "AUTH_TOKEN_EXPIRED"
 *                           reason:
 *                             example: "토큰이 만료되었습니다."
 *       403:
 *         description: 친구 관계 아님 (FRIEND_403_01)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "FRIEND_403_01"
 *                         reason:
 *                           example: "친구가 아닙니다."
 */

/**
 * @swagger
 * /mailbox/self:
 *   get:
 *     summary: 나에게 탭 목록 조회
 *     description: 나에게 보낸 편지 목록을 조회합니다.
 *     tags: [편지함]
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
 *                           title:
 *                             type: string
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             nullable: true
 *                           paperId:
 *                             type: integer
 *                             nullable: true
 *                             description: 편지통 색상
 *       401:
 *         description: 인증 실패
 */
