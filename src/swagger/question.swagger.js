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
 *                 - type: object
 *                   properties:
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
 *                           example: "2026-01-27T14:59:59.999Z"
 *       404:
 *         description: 오늘의 질문 없음 (QUESTION_NOTFOUND_ERROR)
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
 *                           example: "QUESTION_NOTFOUND_ERROR"
 *                         reason:
 *                           example: "오늘의 질문이 없습니다."
 *                         data:
 *                           nullable: true
 *                           example: null
 */
