/**
 * @swagger
 * /home/summary:
 *   get:
 *     summary: 홈 대시보드 조회
 *     tags: [홈]
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
 *                         todayQuestion:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               example: 10
 *                             content:
 *                               type: string
 *                               example: "오늘 가장 즐거웠던 일은 무엇인가요?"
 *                             expiredAt:
 *                               type: string
 *                               format: date-time
 *                         letterStats:
 *                           type: object
 *                           properties:
 *                             reportPeriod:
 *                               type: string
 *                               example: "1월 3주차"
 *                             stats:
 *                               type: object
 *                               properties:
 *                                 receivedCount:
 *                                   type: integer
 *                                   example: 5
 *                                 sentCount:
 *                                   type: integer
 *                                   example: 3
 *                                 totalSentCount:
 *                                   type: integer
 *                                   example: 50
 *                             message:
 *                               type: string
 *                               example: "꾸준히 마음을 전하고 계시네요!"
 *       401:
 *         description: 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedErrorResponse'
 */

/**
 * @swagger
 * /questions/today:
 *   get:
 *     summary: 오늘의 질문 조회
 *     tags: [홈]
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
 *                           example: 10
 *                         content:
 *                           type: string
 *                           example: "오늘 가장 즐거웠던 일은 무엇인가요?"
 *                         expiredAt:
 *                           type: string
 *                           format: date-time
 *       500:
 *         description: 서버 에러 (오늘의 질문 없음)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "COMMON_001"
 *                         reason:
 *                           example: "오늘의 질문이 없습니다."
 */

/**
 * @swagger
 * /letters/others/public:
 *   get:
 *     summary: 공개 편지 캐러셀 목록 조회 (다른 사람)
 *     description: "query string의 detail 값에 따라 응답 필드가 달라집니다."
 *     tags: [홈]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: detail
 *         schema:
 *           type: boolean
 *         description: "true일 경우 상세 정보(본문, 좋아요 등) 포함"
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
 *                       type: array
 *                       items:
 *                         oneOf:
 *                           - type: object
 *                             description: "detail=false 일 때의 응답"
 *                             properties:
 *                               id: { type: integer, example: 3 }
 *                               title: { type: string, example: "이지영 선생님" }
 *                               deliveredAt: { type: string, format: date-time, example: "2026-01-20T..." }
 *                               design:
 *                                 type: object
 *                                 properties:
 *                                   paper:
 *                                     type: object
 *                                     properties:
 *                                       id: { type: integer, example: 1 }
 *                                       name: { type: string, example: "test" }
 *                                       assetUrl: { type: string, example: "test" }
 *                           - type: object
 *                             description: "detail=true 일 때의 응답"
 *                             properties:
 *                               id: { type: integer, example: 3 }
 *                               title: { type: string, example: "이지영 선생님" }
 *                               content: { type: string, example: "나에게 가장 큰 영향? 나는 ..." }
 *                               likes: { type: integer, example: 74 }
 *                               isLiked: { type: boolean, example: false }
 *                               deliveredAt: { type: string, format: date-time, example: "2026-01-20T..." }
 *                               design:
 *                                 type: object
 *                                 properties:
 *                                   paper:
 *                                     type: object
 *                                     properties:
 *                                       id: { type: integer, example: 1 }
 *                                       name: { type: string, example: "test" }
 *                                       assetUrl: { type: string, example: "test" }
 *       401:
 *         description: 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedErrorResponse'
 *
 * /letters/friends/public:
 *   get:
 *     summary: 친구 편지 캐러셀 목록 조회
 *     description: "query string의 detail 값에 따라 응답 필드가 달라집니다."
 *     tags: [홈]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: detail
 *         schema:
 *           type: boolean
 *         description: "true일 경우 상세 정보(본문, 좋아요 등) 포함"
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
 *                       type: array
 *                       items:
 *                         oneOf:
 *                           - type: object
 *                             description: "detail=false 일 때의 응답"
 *                             properties:
 *                               id: { type: integer, example: 3 }
 *                               title: { type: string, example: "이지영 선생님" }
 *                               deliveredAt: { type: string, format: date-time, example: "2026-01-20T..." }
 *                               design:
 *                                 type: object
 *                                 properties:
 *                                   paper:
 *                                     type: object
 *                                     properties:
 *                                       id: { type: integer, example: 1 }
 *                                       name: { type: string, example: "test" }
 *                                       assetUrl: { type: string, example: "test" }
 *                           - type: object
 *                             description: "detail=true 일 때의 응답"
 *                             properties:
 *                               id: { type: integer, example: 3 }
 *                               title: { type: string, example: "이지영 선생님" }
 *                               content: { type: string, example: "나에게 가장 큰 영향? 나는 ..." }
 *                               likes: { type: integer, example: 74 }
 *                               isLiked: { type: boolean, example: false }
 *                               deliveredAt: { type: string, format: date-time, example: "2026-01-20T..." }
 *                               design:
 *                                 type: object
 *                                 properties:
 *                                   paper:
 *                                     type: object
 *                                     properties:
 *                                       id: { type: integer, example: 1 }
 *                                       name: { type: string, example: "test" }
 *                                       assetUrl: { type: string, example: "test" }
 *       401:
 *         description: 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedErrorResponse'
 */

/**
 * @swagger
 * /users/me/letters/stats:
 *   get:
 *     summary: 편지 여행 카드 데이터 조회
 *     tags: [홈]
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
 *                         reportPeriod:
 *                           type: string
 *                           example: "1월 3주차"
 *                         stats:
 *                           type: object
 *                           properties:
 *                             receivedCount:
 *                               type: integer
 *                               example: 10
 *                             sentCount:
 *                               type: integer
 *                               example: 8
 *                             totalSentCount:
 *                               type: integer
 *                               example: 100
 *                         message:
 *                           type: string
 *                           example: "편지 여행이 순항 중이네요!"
 *       401:
 *         description: 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedErrorResponse'
 */

