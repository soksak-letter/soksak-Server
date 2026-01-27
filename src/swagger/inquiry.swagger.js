/* =========================
 * 문의 (inquiries)
 * ========================= */

/**
 * @swagger
 * /inquiries:
 *   post:
 *     summary: 문의 등록 (유저)
 *     tags: [문의]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, content]
 *             properties:
 *               title:
 *                 type: string
 *                 example: "문의 제목"
 *               content:
 *                 type: string
 *                 example: "문의 내용"
 *     responses:
 *       201:
 *         description: 문의 등록 성공
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
 *                           example: "문의 입력이 성공적으로 처리되었습니다."
 *                         result:
 *                           type: object
 *                           example: { "id": 1, "title": "문의 제목", "content": "문의 내용" }
 *       400:
 *         description: 대상 없음/잘못된 요청 (INQUIRY_BADREQUEST_ERROR)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "INQUIRY_BADREQUEST_ERROR"
 *                         reason:
 *                           example: "대상이 존재하지 않습니다."
 *       409:
 *         description: 중복 문의 (INQUIRY_ALREADYEXISTS_ERROR)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "INQUIRY_ALREADYEXISTS_ERROR"
 *                         reason:
 *                           example: "이미 존재하는 문의입니다."
 *       500:
 *         description: 문의 서버 오류 (INQUIRY_INTERNALSERVER_ERROR)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "INQUIRY_INTERNALSERVER_ERROR"
 *                         reason:
 *                           example: "문의 생성 중 서버 오류가 발생하였습니다."
 */

/**
 * @swagger
 * /inquiries/admin:
 *   post:
 *     summary: 문의 답변 등록 (관리자)
 *     tags: [문의]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [inquiryId, answerContent]
 *             properties:
 *               inquiryId:
 *                 type: integer
 *                 example: 1
 *               answerContent:
 *                 type: string
 *                 example: "답변 내용"
 *     responses:
 *       201:
 *         description: 답변 등록 성공
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
 *                           example: "문의 답변이 성공적으로 처리되었습니다."
 *                         result:
 *                           type: object
 *                           example: { "id": 1, "answerContent": "답변 내용" }
 *       400:
 *         description: 대상 없음/잘못된 요청 (INQUIRY_BADREQUEST_ERROR)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "INQUIRY_BADREQUEST_ERROR"
 *                         reason:
 *                           example: "대상이 존재하지 않습니다."
 *       409:
 *         description: 중복 처리 (INQUIRY_ALREADYEXISTS_ERROR)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "INQUIRY_ALREADYEXISTS_ERROR"
 *                         reason:
 *                           example: "이미 존재하는 문의입니다."
 *       500:
 *         description: 문의 서버 오류 (INQUIRY_INTERNALSERVER_ERROR)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "INQUIRY_INTERNALSERVER_ERROR"
 *                         reason:
 *                           example: "문의 생성 중 서버 오류가 발생하였습니다."
 */

/**
 * @swagger
 * /inquiries:
 *   get:
 *     summary: 문의 조회 (내 문의 목록)
 *     tags: [문의]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: 문의 조회 성공 (컨트롤러 코드 기준 201 반환)
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
 *                           example: "문의 조회가 성공적으로 처리되었습니다."
 *                         result:
 *                           type: object
 *                           example:
 *                             [
 *                               { "id": 1, "title": "문의 제목", "content": "문의 내용", "answerContent": null }
 *                             ]
 *       500:
 *         description: 문의 서버 오류 (INQUIRY_INTERNALSERVER_ERROR)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "INQUIRY_INTERNALSERVER_ERROR"
 *                         reason:
 *                           example: "문의 생성 중 서버 오류가 발생하였습니다."
 */