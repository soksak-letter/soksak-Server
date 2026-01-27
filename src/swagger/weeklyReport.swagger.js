/* =========================
 * 주간 리포트 (weekly report)
 * ========================= */

/**
 * @swagger
 * /weekly/reports:
 *   get:
 *     summary: 주간 리포트 조회
 *     tags: [주간리포트]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 주간 리포트 조회 성공
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
 *                           example: "주간 리포트 조회 성공하였습니다."
 *                         result:
 *                           type: object
 *                           properties:
 *                             data:
 *                               type: object
 *                               properties:
 *                                 report:
 *                                   type: object
 *                                   properties:
 *                                     id: { type: integer, example: 1 }
 *                                     userId: { type: integer, example: 1 }
 *                                     summaryText: { type: string, example: "이번 주도 잘 해내고 있어요..." }
 *                                     generatedAt: { type: string, format: date-time }
 *                                 keywords:
 *                                   type: array
 *                                   items:
 *                                     type: object
 *                                     properties:
 *                                       keyword: { type: string, example: "공부" }
 *                                       count: { type: integer, example: 3 }
 *                                 emotions:
 *                                   type: object
 *                                   description: "count(0..7) 인덱스별 감정 배열"
 *                                   example:
 *                                     {
 *                                       "0": [{ "emotion": "기쁨", "ratio": 0.3 }],
 *                                       "1": [{ "emotion": "슬픔", "ratio": 0.2 }]
 *                                     }
 *                                 highlights:
 *                                   type: array
 *                                   items:
 *                                     type: object
 *                                     properties:
 *                                       letterId: { type: integer, example: 100 }
 *       404:
 *         description: 주간 리포트 없음 (WEEKLYREPORT_NOTFOUND_ERROR)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "WEEKLYREPORT_NOTFOUND_ERROR"
 *                         reason:
 *                           example: "주간 리포트를 찾을 수 없습니다."
 *       500:
 *         description: 주간 리포트 서버 오류 (WEEKLYREPORT_INTERNALSERVER_ERROR)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "WEEKLYREPORT_INTERNALSERVER_ERROR"
 *                         reason:
 *                           example: "주간 리포트 처리 중 서버 오류가 발생했습니다."
 */
