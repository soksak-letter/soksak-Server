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
