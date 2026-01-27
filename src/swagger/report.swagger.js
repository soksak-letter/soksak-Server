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
 *                 - properties:
 *                     success:
 *                       type: object
 *                       properties:
 *                         message:
 *                           type: string
 *                           example: "신고가 성공적으로 처리되었습니다."
 *       400:
 *         description: 허용되지 않은 신고 사유 (REPORT_UNEXPECTEDREASON_ERROR)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "REPORT_UNEXPECTEDREASON_ERROR"
 *                         reason:
 *                           example: "잘못된 report reason입니다."
 *       500:
 *         description: 신고 처리 중 서버 오류 (REPORT_INTERNAL_ERROR)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
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
 *                 - properties:
 *                     success:
 *                       type: object
 *                       properties:
 *                         message:
 *                           type: string
 *                           example: "신고 조회에 성공하였습니다."
 *                         result:
 *                           type: object
 *                           example:
 *                             [
 *                               { "id": 1, "letterId": 100, "reasons": ["스팸/광고"], "createdAt": "2026-01-01T00:00:00.000Z" }
 *                             ]
 *       500:
 *         description: 신고 처리 중 서버 오류 (REPORT_INTERNAL_ERROR)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "REPORT_INTERNAL_ERROR"
 *                         reason:
 *                           example: "db 에러입니다."
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
 *                 - properties:
 *                     success:
 *                       type: object
 *                       properties:
 *                         message:
 *                           type: string
 *                           example: "신고 상세 조회에 성공하였습니다."
 *                         result:
 *                           type: object
 *                           example: { "id": 1, "letterId": 100, "reasons": ["스팸/광고"], "createdAt": "2026-01-01T00:00:00.000Z" }
 *       500:
 *         description: 신고 처리 중 서버 오류 (REPORT_INTERNAL_ERROR)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "REPORT_INTERNAL_ERROR"
 *                         reason:
 *                           example: "db 에러입니다."
 */