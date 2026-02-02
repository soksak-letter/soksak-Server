/* =========================
 * 친구 (friends)
 * ========================= */

/**
 * @swagger
 * tags:
 *   - name: 친구
 *     description: 친구/친구요청 관련 API
 */

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
 *         description: 친구 목록 조회 성공 (현재 컨트롤러가 201 반환)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
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
 *                                 properties:
 *                                   id:
 *                                     type: integer
 *                                     example: 1
 *                                   friendUserId:
 *                                     type: integer
 *                                     example: 2
 *                                   nickname:
 *                                     type: string
 *                                     nullable: true
 *                                     example: "친구A"
 *                                   letterCount:
 *                                     type: integer
 *                                     example: 3
 *                                   recentLetter:
 *                                     nullable: true
 *                                     type: object
 *                                     properties:
 *                                       createdAt:
 *                                         type: string
 *                                         format: date-time
 *                                         nullable: true
 *                                         example: "2026-01-21T13:49:32.735Z"
 *                                       design:
 *                                         nullable: true
 *                                         type: object
 *       401:
 *         description: 인증 필요 (UNAUTHORIZED)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "UNAUTHORIZED"
 *                         reason:
 *                           example: "인증이 필요합니다"
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
 *                 - type: object
 *                   properties:
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
 *                               example:
 *                                 { "id": 123, "requesterUserId": 1, "receiverUserId": 2, "sessionId": 10, "status": "PENDING" }
 *       400:
 *         description: 입력값 검증 실패(REQ_BAD_REQUEST) 또는 자기 자신에게 신청(FRIEND_SELFREQUEST_ERROR)
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
 *                             example: "REQ_BAD_REQUEST"
 *                           reason:
 *                             example: "입력값이 잘못되었습니다"
 *                           data:
 *                             example:
 *                               [
 *                                 { "field": "body.targetUserId", "message": "숫자여야 합니다." }
 *                               ]
 *                 - allOf:
 *                   - $ref: '#/components/schemas/ErrorResponse'
 *                   - properties:
 *                       error:
 *                         properties:
 *                           errorCode:
 *                             example: "FRIEND_SELFREQUEST_ERROR"
 *                           reason:
 *                             example: "자기 자신과는 친구 신청을 할 수 없습니다."
 *       401:
 *         description: 인증 필요 (UNAUTHORIZED)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: 이미 요청 존재(FRIEND_ALREADYEXISTS_ERROR) 또는 이미 친구(FRIEND_ALREADY_ERROR)
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
 *       '200':
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
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
 *                                 properties:
 *                                   id:
 *                                     type: integer
 *                                     example: 1
 *                                   requesterNickname:
 *                                     type: string
 *                                     example: "웃는참외"
 *                                   requesterUserId:
 *                                     type: integer
 *                                     example: 30
 *                                   receiverUserId:
 *                                     type: integer
 *                                     example: 2
 *                                   sessionId:
 *                                     type: integer
 *                                     nullable: true
 *                                     example: null
 *                                   status:
 *                                     type: string
 *                                     example: "PENDING"
 *                                   createdAt:
 *                                     type: string
 *                                     format: date-time
 *                                     example: "2026-02-01T18:55:14.000Z"
 *                                   updatedAt:
 *                                     type: string
 *                                     format: date-time
 *                                     example: "2026-02-01T18:55:14.000Z"
 *             examples:
 *               success:
 *                 value:
 *                   success:
 *                     message: "들어온 친구 신청 목록 조회가 성공하였습니다."
 *                     result:
 *                       data:
 *                         - id: 1
 *                           requesterNickname: "웃는참외"
 *                           requesterUserId: 30
 *                           receiverUserId: 2
 *                           sessionId: null
 *                           status: "PENDING"
 *                           createdAt: "2026-02-01T18:55:14.000Z"
 *                           updatedAt: "2026-02-01T18:55:14.000Z"
 *       401:
 *         description: 인증 필요 (UNAUTHORIZED)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "UNAUTHORIZED"
 *                         reason:
 *                           example: "인증이 필요합니다"
 *       '404':
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
 *       '500':
 *         description: 친구 처리 중 서버 오류 (FRIEND_INTERNALSERVER_ERROR)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 *       '200':
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
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
 *                                 properties:
 *                                   id:
 *                                     type: integer
 *                                     example: 77
 *                                   receiverNickname:
 *                                     type: string
 *                                     example: "닉네임3"
 *                                   requesterUserId:
 *                                     type: integer
 *                                     example: 1
 *                                   receiverUserId:
 *                                     type: integer
 *                                     example: 3
 *                                   sessionId:
 *                                     type: integer
 *                                     nullable: true
 *                                     example: null
 *                                   status:
 *                                     type: string
 *                                     example: "PENDING"
 *                                   createdAt:
 *                                     type: string
 *                                     format: date-time
 *                                     example: "2026-02-01T18:55:14.000Z"
 *                                   updatedAt:
 *                                     type: string
 *                                     format: date-time
 *                                     example: "2026-02-01T18:55:14.000Z"
 *             examples:
 *               success:
 *                 value:
 *                   success:
 *                     message: "보낸 친구 신청 목록 조회가 성공하였습니다."
 *                     result:
 *                       data:
 *                         - id: 77
 *                           receiverNickname: "닉네임3"
 *                           requesterUserId: 1
 *                           receiverUserId: 3
 *                           sessionId: null
 *                           status: "PENDING"
 *                           createdAt: "2026-02-01T18:55:14.000Z"
 *                           updatedAt: "2026-02-01T18:55:14.000Z"
 *       401:
 *         description: 인증 필요 (UNAUTHORIZED)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "UNAUTHORIZED"
 *                         reason:
 *                           example: "인증이 필요합니다"
 *       '404':
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
 *       '500':
 *         description: 친구 처리 중 서버 오류 (FRIEND_INTERNALSERVER_ERROR)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 *                 - type: object
 *                   properties:
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
 *                               example: { "id": 999, "userAId": 1, "userBId": 2 }
 *       400:
 *         description: 입력값 검증 실패(REQ_BAD_REQUEST)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: 인증 필요 (UNAUTHORIZED)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 *               $ref: '#/components/schemas/ErrorResponse'
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
 *                 - type: object
 *                   properties:
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
 *                               example: { "id": 55, "requesterUserId": 2, "receiverUserId": 1, "status": "REJECTED" }
 *       400:
 *         description: 입력값 검증 실패(REQ_BAD_REQUEST)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: 인증 필요 (UNAUTHORIZED)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: 처리할 요청 없음 (FRIEND_REQUESTNOTFOUND_ERROR)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: 친구 처리 중 서버 오류 (FRIEND_INTERNALSERVER_ERROR)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 *         description: 취소 성공 (상태가 DELETED로 업데이트됨)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
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
 *                               example: { "id": 123, "status": "DELETED" }
 *       400:
 *         description: 입력값 검증 실패(REQ_BAD_REQUEST)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: 인증 필요 (UNAUTHORIZED)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: 삭제할 요청 없음 (FRIEND_REQUESTNOTFOUND_ERROR)
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
 *               $ref: '#/components/schemas/ErrorResponse'
 */
