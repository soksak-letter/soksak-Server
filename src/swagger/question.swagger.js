/* =========================
 * 질문 (questions)
 * ========================= */

/**
 * @swagger
 * /questions/today:
 *   get:
 *     summary: 오늘의 질문 조회
 *     tags: [질문]
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
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         content:
 *                           type: string
 *                           example: "오늘 하루, 가장 고마웠던 순간은?"
 *                         expiredAt:
 *                           type: string
 *                           format: date-time
 *       404:
 *         description: 오늘의 질문 없음 (QUESTION_NOTFOUND_ERROR)
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
 */