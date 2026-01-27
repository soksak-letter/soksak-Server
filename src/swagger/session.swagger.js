/**
 * @swagger
 * /matching/sessions/{questionId}:
 *   post:
 *     summary: 세션 생성(매칭 요청)
 *     tags: [매칭세션]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: "현재 서비스 로직은 targetUserId를 사용하지 않지만, 컨트롤러에 필드가 있어 문서화"
 *             properties:
 *               targetUserId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: 세션 생성 성공
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
 *                           example: "세션 매칭이 성공하였습니다."
 *                         result:
 *                           type: object
 *                           properties:
 *                             data:
 *                               type: object
 *                               example: { "sessionId": 10, "status": "CHATING", "questionId": 1 }
 *       404:
 *         description: 질문 없음 (QUESTION_NOTFOUND_ERROR)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "QUESTION_NOTFOUND_ERROR"
 *                         reason:
 *                           example: "질문을 찾을 수 없습니다."
 *       500:
 *         description: 세션 처리 오류(개수 초과/서버 오류)
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
 *                             example: "SESSION_COUNTOVER_ERROR"
 *                           reason:
 *                             example: "세션이 10개 이상입니다."
 *                 - allOf:
 *                   - $ref: '#/components/schemas/ErrorResponse'
 *                   - properties:
 *                       error:
 *                         properties:
 *                           errorCode:
 *                             example: "SESSION_INTERNALSERVER_ERROR"
 *                           reason:
 *                             example: "친구 처리 중 서버 오류가 발생했습니다."
 */

/**
 * @swagger
 * /matching/sessions/{sessionId}/friends:
 *   patch:
 *     summary: 세션 상태 FRIENDS로 변경
 *     tags: [매칭세션]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 10
 *     responses:
 *       200:
 *         description: 상태 변경 성공
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
 *                           example: "세션 상태가 FRIENDS으로 변경되었습니다."
 *                         result:
 *                           type: object
 *                           properties:
 *                             data:
 *                               type: object
 *                               example: { "sessionId": 10, "status": "FRIENDS" }
 *       404:
 *         description: 세션 참가자 없음 (SESSION_PARTICIPANTNOTFOUND_ERROR)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "SESSION_PARTICIPANTNOTFOUND_ERROR"
 *                         reason:
 *                           example: "존재하지 않는 세션 참가자입니다."
 *       500:
 *         description: 세션 서버 오류 (SESSION_INTERNALSERVER_ERROR)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "SESSION_INTERNALSERVER_ERROR"
 *                         reason:
 *                           example: "친구 처리 중 서버 오류가 발생했습니다."
 */

/**
 * @swagger
 * /matching/sessions/{sessionId}/discards:
 *   patch:
 *     summary: 세션 상태 DISCARDED로 변경
 *     tags: [매칭세션]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 10
 *     responses:
 *       200:
 *         description: 상태 변경 성공
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
 *                           example: "세션 상태가 DISCARDED로 변경되었습니다."
 *                         result:
 *                           type: object
 *                           properties:
 *                             data:
 *                               type: object
 *                               example: { "sessionId": 10, "status": "DISCARDED" }
 *       404:
 *         description: 세션 참가자 없음 (SESSION_PARTICIPANTNOTFOUND_ERROR)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "SESSION_PARTICIPANTNOTFOUND_ERROR"
 *                         reason:
 *                           example: "존재하지 않는 세션 참가자입니다."
 *       500:
 *         description: 세션 서버 오류 (SESSION_INTERNALSERVER_ERROR)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "SESSION_INTERNALSERVER_ERROR"
 *                         reason:
 *                           example: "친구 처리 중 서버 오류가 발생했습니다."
 */

/**
 * @swagger
 * /matching/sessions/{sessionId}/reviews:
 *   post:
 *     summary: 세션 리뷰 작성
 *     tags: [매칭세션]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 10
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [temperatureScore, reviewTag]
 *             properties:
 *               temperatureScore:
 *                 type: number
 *                 description: "0~100"
 *                 example: 85
 *               reviewTag:
 *                 type: string
 *                 enum: ["그냥 그래요", "좋아요!", "또 만나고 싶어요"]
 *                 example: "좋아요!"
 *     responses:
 *       201:
 *         description: 리뷰 작성 성공
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
 *                           example: "세션에 대한 review가 작성되었습니다."
 *                         result:
 *                           type: object
 *                           properties:
 *                             data:
 *                               type: object
 *                               example: { "id": 1, "sessionId": 10, "reviewerUserId": 1, "temperatureScore": 85, "reviewTag": "좋아요!" }
 *       400:
 *         description: 입력값 오류(태그/점수)
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
 *                             example: "SESSION_WRONGTAG_ERROR"
 *                           reason:
 *                             example: "잘못된 리뷰 태그 입력입니다."
 *                 - allOf:
 *                   - $ref: '#/components/schemas/ErrorResponse'
 *                   - properties:
 *                       error:
 *                         properties:
 *                           errorCode:
 *                             example: "SESSION_SCORERANGE_ERROR"
 *                           reason:
 *                             example: "온도 입력 범위 오류입니다."
 *       500:
 *         description: 세션 서버 오류 (SESSION_INTERNALSERVER_ERROR)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "SESSION_INTERNALSERVER_ERROR"
 *                         reason:
 *                           example: "친구 처리 중 서버 오류가 발생했습니다."
 */