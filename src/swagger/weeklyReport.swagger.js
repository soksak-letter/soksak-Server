/* =========================
 * 주간 리포트 (weekly report)
 * ========================= */

/**
 * @swagger
 * /weekly/reports:
 *   get:
 *     summary: 주간 리포트 조회 (가장 최근 생성된 리포트 1개)
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
 *                 - type: object
 *                   properties:
 *                     success:
 *                       type: object
 *                       properties:
 *                         message:
 *                           type: string
 *                           example: "주간 리포트 조회 성공하였습니다."
 *                         result:
 *                           type: object
 *                           description: "서비스 레이어 반환값(readWeeklyReport)의 래퍼"
 *                           properties:
 *                             data:
 *                               type: object
 *                               properties:
 *                                 report:
 *                                   type: object
 *                                   properties:
 *                                     id:
 *                                       type: integer
 *                                       example: 1
 *                                     userId:
 *                                       type: integer
 *                                       example: 1
 *                                     nickname:
 *                                       type: string
 *                                       example: "닉네임" 
 *                                     month:
 *                                       type: integer
 *                                       example: 2
 *                                     week:
 *                                       type: integer
 *                                       example: 3
 *                                     summaryText:
 *                                       oneOf:
 *                                         - type: string
 *                                           example: "이번 주도 잘 해내고 있어요..."
 *                                         - type: object
 *                                           description: "과거 데이터에 JSON.stringify가 남아 복구된 경우"
 *                                           example: { "text": "이번 주도 잘 해내고 있어요..." }
 *                                       nullable: true
 *                                     generatedAt:
 *                                       type: string
 *                                       format: date-time
 *                                       example: "2026-01-26T10:20:30.000Z"
 *                                 keywords:
 *                                   type: array
 *                                   description: "주간 키워드 집계"
 *                                   items:
 *                                     type: object
 *                                     properties:
 *                                       keyword:
 *                                         type: string
 *                                         example: "위로"
 *                                       count:
 *                                         type: integer
 *                                         example: 12
 *                                 emotions:
 *                                   type: object
 *                                   description: "count(0..7) 인덱스별 감정 배열 (0=주간 분포, 1..7=요일 흐름)"
 *                                   additionalProperties:
 *                                     type: array
 *                                     items:
 *                                       type: object
 *                                       properties:
 *                                         emotion:
 *                                           type: string
 *                                           example: "기쁨"
 *                                         ratio:
 *                                           type: number
 *                                           example: 0.3
 *                                   example:
 *                                     {
 *                                       "0": [{ "emotion": "기쁨", "ratio": 0.3 }, { "emotion": "불안", "ratio": 0.2 }],
 *                                       "1": [{ "emotion": "슬픔", "ratio": 0.2 }],
 *                                       "2": [{ "emotion": "평온", "ratio": 0.4 }]
 *                                     }
 *                                 highlights:
 *                                   type: array
 *                                   description: "하이라이트 편지(최신 N개) 목록"
 *                                   items:
 *                                     type: object
 *                                     properties:
 *                                       letterId:
 *                                         type: integer
 *                                         example: 100
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
 *         description: 주간 리포트 없음 (WEEKLYREPORT_NOTFOUND_ERROR)
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
 *                 - type: object
 *                   properties:
 *                     error:
 *                       type: object
 *                       properties:
 *                         errorCode:
 *                           example: "WEEKLYREPORT_INTERNALSERVER_ERROR"
 *                         reason:
 *                           example: "주간 리포트 처리 중 서버 오류가 발생했습니다."
 */
