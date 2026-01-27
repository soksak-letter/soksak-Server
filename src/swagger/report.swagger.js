/* =========================
 * 신고 (reports)
 * ========================= */

/**
 * @swagger
 * /reports:
 *   post:
 *     summary: 신고 생성
 *     tags: [신고]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [letterId, reasons]
 *             properties:
 *               letterId:
 *                 type: integer
 *                 example: 100
 *               reasons:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: string
 *                   enum:
 *                     - "욕설/비하"
 *                     - "혐오 표현"
 *                     - "성적 불쾌감"
 *                     - "스팸/광고"
 *                     - "도배/반복"
 *                     - "폭력/학대표현"
 *                     - "불법 행위 유도"
 *                     - "사칭/허위정보"
 *                 example: ["스팸/광고", "도배/반복"]
 *     responses:
 *       201:
 *         description: 신고 성공
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
 *                           example: "신고가 성공적으로 처리되었습니다."
 *       400:
 *         description: 입력값 검증 실패(REQ_BAD_REQUEST) 또는 허용되지 않은 신고 사유(REPORT_UNEXPECTEDREASON_ERROR)
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - allOf:
 *                     - $ref: '#/components/schemas/ErrorResponse'
 *                     - type: object
 *                       properties:
 *                         error:
 *                           type: object
 *                           properties:
 *                             errorCode:
 *                               example: "REQ_BAD_REQUEST"
 *                             reason:
 *                               example: "입력값이 잘못되었습니다"
 *                             data:
 *                               example:
 *                                 [
 *                                   { "field": "body.letterId", "message": "숫자여야 합니다." }
 *                                 ]
 *                 - allOf:
 *                     - $ref: '#/components/schemas/ErrorResponse'
 *                     - type: object
 *                       properties:
 *                         error:
 *                           type: object
 *                           properties:
 *                             errorCode:
 *                               example: "REPORT_UNEXPECTEDREASON_ERROR"
 *                             reason:
 *                               example: "잘못된 report reason입니다."
 *                             data:
 *                               example:
 *                                 { "reasons": ["뇌절사유"] }
 *       401:
 *         description: 인증 필요 (UNAUTHORIZED)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - type: object
 *                   properties:
 *                     error:
 *                       type: object
 *                       properties:
 *                         errorCode:
 *                           example: "UNAUTHORIZED"
 *                         reason:
 *                           example: "인증이 필요합니다"
 *       404:
 *         description: 유저/편지 없음 (USER_NOTFOUND_ERROR 또는 LETTER_NOTFOUND_ERROR)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: 신고 처리 중 서버 오류 (REPORT_INTERNAL_ERROR)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - type: object
 *                   properties:
 *                     error:
 *                       type: object
 *                       properties:
 *                         errorCode:
 *                           example: "REPORT_INTERNAL_ERROR"
 *                         reason:
 *                           example: "db 에러입니다."
 */

/**
 * @swagger
 * /reports:
 *   get:
 *     summary: 내 신고 목록 조회
 *     tags: [신고]
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
 *                 - type: object
 *                   properties:
 *                     success:
 *                       type: object
 *                       properties:
 *                         message:
 *                           type: string
 *                           example: "신고 조회에 성공하였습니다."
 *                         result:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                                 example: 1
 *                               createdAt:
 *                                 type: string
 *                                 format: date-time
 *                                 example: "2026-01-01T00:00:00.000Z"
 *                               status:
 *                                 type: string
 *                                 example: "PENDING"
 *                               reasons:
 *                                 type: array
 *                                 items:
 *                                   type: object
 *                                   properties:
 *                                     reason:
 *                                       type: string
 *                                       example: "스팸/광고"
 *       401:
 *         description: 인증 필요 (UNAUTHORIZED)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: 신고 처리 중 서버 오류 (REPORT_INTERNAL_ERROR)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /reports/{reportId}:
 *   get:
 *     summary: 신고 상세 조회
 *     tags: [신고]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: 상세 조회 성공
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
 *                           example: "신고 상세 조회에 성공하였습니다."
 *                         result:
 *                           nullable: true
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               example: 1
 *                             reporterUserId:
 *                               type: integer
 *                               example: 14
 *                             targetUserId:
 *                               type: integer
 *                               example: 2
 *                             letterId:
 *                               type: integer
 *                               example: 100
 *                             status:
 *                               type: string
 *                               example: "PENDING"
 *                             createdAt:
 *                               type: string
 *                               format: date-time
 *                               example: "2026-01-01T00:00:00.000Z"
 *                             reasons:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   reason:
 *                                     type: string
 *                                     example: "스팸/광고"
 *       400:
 *         description: 입력값 검증 실패 (REQ_BAD_REQUEST)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: 인증 필요 (UNAUTHORIZED)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: 신고 처리 중 서버 오류 (REPORT_INTERNAL_ERROR)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 */
