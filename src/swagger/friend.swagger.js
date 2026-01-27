/**
 * @swagger
 * /friends:
 *   get:
 *     summary: 친구 목록 조회
 *     tags: [친구]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: 친구 목록 조회 성공 (컨트롤러 코드 기준 201 반환)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - properties:
 *                     success:
 *                       type: object
 *                       properties:
 *                         message:
 *                           type: string
 *                           example: "친구 조회가 성공적으로 처리되었습니다."
 *                         result:
 *                           type: object
 *                           properties:
 *                             data:
 *                               type: array
 *                               items:
 *                                 type: object
 *                               example: [{ "id": 1, "nickname": "친구A" }]
 *       404:
 *         description: 친구 없음 (FRIEND_NOTFOUND_ERROR)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "FRIEND_NOTFOUND_ERROR"
 *                         reason:
 *                           example: "친구를 찾을 수 없습니다."
 *       500:
 *         description: 친구 처리 중 서버 오류 (FRIEND_INTERNALSERVER_ERROR)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "FRIEND_INTERNALSERVER_ERROR"
 *                         reason:
 *                           example: "친구 처리 중 서버 오류가 발생했습니다."
 */

/**
 * @swagger
 * /friends/requests:
 *   post:
 *     summary: 친구 신청
 *     tags: [친구]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [targetUserId, sessionId]
 *             properties:
 *               targetUserId:
 *                 type: integer
 *                 example: 2
 *               sessionId:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       200:
 *         description: 친구 신청 성공
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - properties:
 *                     success:
 *                       type: object
 *                       properties:
 *                         message:
 *                           type: string
 *                           example: "친구 신청이 완료되었습니다."
 *                         result:
 *                           type: object
 *                           properties:
 *                             data:
 *                               type: object
 *                               example: { "id": 123, "requesterUserId": 1, "targetUserId": 2, "status": "PENDING" }
 *       400:
 *         description: 자기 자신에게 신청 (FRIEND_SELFREQUEST_ERROR)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "FRIEND_SELFREQUEST_ERROR"
 *                         reason:
 *                           example: "자기 자신과는 친구 신청을 할 수 없습니다."
 *       409:
 *         description: 이미 요청 존재/이미 친구
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
 *                             example: "FRIEND_ALREADYEXISTS_ERROR"
 *                           reason:
 *                             example: "이미 친구 요청이 존재합니다."
 *                 - allOf:
 *                   - $ref: '#/components/schemas/ErrorResponse'
 *                   - properties:
 *                       error:
 *                         properties:
 *                           errorCode:
 *                             example: "FRIEND_ALREADY_ERROR"
 *                           reason:
 *                             example: "이미 친구입니다."
 *       500:
 *         description: 친구 처리 중 서버 오류 (FRIEND_INTERNALSERVER_ERROR)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "FRIEND_INTERNALSERVER_ERROR"
 *                         reason:
 *                           example: "친구 처리 중 서버 오류가 발생했습니다."
 */

/**
 * @swagger
 * /friends/requests/incoming:
 *   get:
 *     summary: 들어온 친구 신청 목록 조회
 *     tags: [친구]
 *     security:
 *       - bearerAuth: []
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
 *                         message:
 *                           type: string
 *                           example: "들어온 친구 신청 목록 조회가 성공하였습니다."
 *                         result:
 *                           type: object
 *                           properties:
 *                             data:
 *                               type: array
 *                               items:
 *                                 type: object
 *                               example: [{ "id": 55, "requesterUserId": 2, "targetUserId": 1, "status": "PENDING" }]
 *       404:
 *         description: 요청 없음 (FRIEND_REQUESTNOTFOUND_ERROR)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "FRIEND_REQUESTNOTFOUND_ERROR"
 *                         reason:
 *                           example: "처리할 수 있는 친구 요청이 없습니다."
 *       500:
 *         description: 친구 처리 중 서버 오류 (FRIEND_INTERNALSERVER_ERROR)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "FRIEND_INTERNALSERVER_ERROR"
 *                         reason:
 *                           example: "친구 처리 중 서버 오류가 발생했습니다."
 */

/**
 * @swagger
 * /friends/requests/outgoing:
 *   get:
 *     summary: 보낸 친구 신청 목록 조회
 *     tags: [친구]
 *     security:
 *       - bearerAuth: []
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
 *                         message:
 *                           type: string
 *                           example: "보낸 친구 신청 목록 조회가 성공하였습니다."
 *                         result:
 *                           type: object
 *                           properties:
 *                             data:
 *                               type: array
 *                               items:
 *                                 type: object
 *                               example: [{ "id": 77, "requesterUserId": 1, "targetUserId": 3, "status": "PENDING" }]
 *       404:
 *         description: 요청 없음 (FRIEND_REQUESTNOTFOUND_ERROR)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "FRIEND_REQUESTNOTFOUND_ERROR"
 *                         reason:
 *                           example: "처리할 수 있는 친구 요청이 없습니다."
 *       500:
 *         description: 친구 처리 중 서버 오류 (FRIEND_INTERNALSERVER_ERROR)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "FRIEND_INTERNALSERVER_ERROR"
 *                         reason:
 *                           example: "친구 처리 중 서버 오류가 발생했습니다."
 */

/**
 * @swagger
 * /friends/requests/accept/{requesterUserId}:
 *   post:
 *     summary: 들어온 친구 신청 수락
 *     tags: [친구]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requesterUserId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 2
 *     responses:
 *       200:
 *         description: 수락 성공
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - properties:
 *                     success:
 *                       type: object
 *                       properties:
 *                         message:
 *                           type: string
 *                           example: "친구 신청 수락이 성공하였습니다."
 *                         result:
 *                           type: object
 *                           properties:
 *                             data:
 *                               type: object
 *                               example: { "friendshipId": 999, "userA": 1, "userB": 2 }
 *       404:
 *         description: 처리할 요청 없음 (FRIEND_REQUESTNOTFOUND_ERROR)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "FRIEND_REQUESTNOTFOUND_ERROR"
 *                         reason:
 *                           example: "처리할 수 있는 친구 요청이 없습니다."
 *       409:
 *         description: 이미 친구 (FRIEND_ALREADY_ERROR)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "FRIEND_ALREADY_ERROR"
 *                         reason:
 *                           example: "이미 친구입니다."
 *       500:
 *         description: 친구 처리 중 서버 오류 (FRIEND_INTERNALSERVER_ERROR)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "FRIEND_INTERNALSERVER_ERROR"
 *                         reason:
 *                           example: "친구 처리 중 서버 오류가 발생했습니다."
 */


/**
 * @swagger
 * /friends/requests/reject/{targetUserId}:
 *   post:
 *     summary: 들어온 친구 신청 거절
 *     tags: [친구]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: targetUserId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 2
 *     responses:
 *       200:
 *         description: 거절 성공
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - properties:
 *                     success:
 *                       type: object
 *                       properties:
 *                         message:
 *                           type: string
 *                           example: "친구 신청 거절이 성공하였습니다."
 *                         result:
 *                           type: object
 *                           properties:
 *                             data:
 *                               type: object
 *                               example: { "id": 55, "status": "REJECTED" }
 *       404:
 *         description: 처리할 요청 없음 (FRIEND_REQUESTNOTFOUND_ERROR)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "FRIEND_REQUESTNOTFOUND_ERROR"
 *                         reason:
 *                           example: "처리할 수 있는 친구 요청이 없습니다."
 *       500:
 *         description: 친구 처리 중 서버 오류 (FRIEND_INTERNALSERVER_ERROR)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "FRIEND_INTERNALSERVER_ERROR"
 *                         reason:
 *                           example: "친구 처리 중 서버 오류가 발생했습니다."
 */

/**
 * @swagger
 * /friends/requests/{targetUserId}:
 *   delete:
 *     summary: 보낸 친구 신청 삭제(취소)
 *     tags: [친구]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: targetUserId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 2
 *     responses:
 *       200:
 *         description: 취소 성공
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - properties:
 *                     success:
 *                       type: object
 *                       properties:
 *                         message:
 *                           type: string
 *                           example: "친구 신청 취소가 성공하였습니다."
 *                         result:
 *                           type: object
 *                           properties:
 *                             data:
 *                               type: object
 *                               example: { "deleted": true }
 *       404:
 *         description: 대상 없음/요청 없음
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
 *                             example: "FRIEND_NOTFOUND_ERROR"
 *                           reason:
 *                             example: "친구를 찾을 수 없습니다."
 *                 - allOf:
 *                   - $ref: '#/components/schemas/ErrorResponse'
 *                   - properties:
 *                       error:
 *                         properties:
 *                           errorCode:
 *                             example: "FRIEND_REQUESTNOTFOUND_ERROR"
 *                           reason:
 *                             example: "처리할 수 있는 친구 요청이 없습니다."
 *       500:
 *         description: 친구 처리 중 서버 오류 (FRIEND_INTERNALSERVER_ERROR)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "FRIEND_INTERNALSERVER_ERROR"
 *                         reason:
 *                           example: "친구 처리 중 서버 오류가 발생했습니다."
 */
