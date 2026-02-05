/**
 * @swagger
 * /mailbox/anonymous:
 *   get:
 *     summary: 익명 탭 목록 조회
 *     description: 익명으로 받은 편지의 스레드 목록을 조회합니다. sessionId별 최신 편지 1개씩 반환됩니다.
 *     tags: [편지함]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - properties:
 *                     success:
 *                       type: object
 *                       properties:
 *                         letters:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               sessionId:
 *                                 type: integer
 *                                 description: 세션 ID (MatchingSession ID)
 *                               sender:
 *                                 type: object
 *                                 properties:
 *                                   id:
 *                                     type: integer
 *                                   nickname:
 *                                     type: string
 *                                     nullable: true
 *                                   letterCount:
 *                                     type: integer
 *                                     description: 해당 세션의 편지 개수
 *                               lastLetterId:
 *                                 type: integer
 *                               lastLetterTitle:
 *                                 type: string
 *                               lastLetterPreview:
 *                                 type: string
 *                               deliveredAt:
 *                                 type: string
 *                                 format: date-time
 *                                 nullable: true
 *                               hasUnread:
 *                                 type: boolean
 *                                 description: 해당 세션에 읽지 않은 편지가 있는지 여부 (받은 편지 기준)
 *                               design:
 *                                 type: object
 *                                 properties:
 *                                   paperId:
 *                                     type: integer
 *                                     nullable: true
 *                                   stampId:
 *                                     type: integer
 *                                     nullable: true
 *                                   stampUrl:
 *                                     type: string
 *                                     nullable: true
 *                                     description: 스탬프 이미지 URL
 *       401:
 *         description: |
 *           인증 실패:
 *           - `AUTH_TOKEN_EXPIRED`: 토큰이 만료되었습니다.
 *           - `AUTH_INVALID_TOKEN`: 액세스 토큰이 아니거나 유효하지 않습니다.
 *           - `AUTH_NOT_ACCESS_TOKEN`: 액세스 토큰이 아닙니다.
 *           - `AUTH_EXPIRED_TOKEN`: 이미 로그아웃된 토큰입니다.
 *           - `AUTH_UNAUTHORIZED`: 액세스 토큰이 유효하지 않습니다.
 *           - `MAILBOX_UNAUTHORIZED`: 인증이 필요합니다.
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
 *                             example: "AUTH_TOKEN_EXPIRED"
 *                           reason:
 *                             example: "토큰이 만료되었습니다."
 *                 - allOf:
 *                   - $ref: '#/components/schemas/ErrorResponse'
 *                   - properties:
 *                       error:
 *                         properties:
 *                           errorCode:
 *                             example: "AUTH_INVALID_TOKEN"
 *                           reason:
 *                             example: "액세스 토큰이 아니거나 유효하지 않습니다."
 *                 - allOf:
 *                   - $ref: '#/components/schemas/ErrorResponse'
 *                   - properties:
 *                       error:
 *                         properties:
 *                           errorCode:
 *                             example: "AUTH_NOT_ACCESS_TOKEN"
 *                           reason:
 *                             example: "액세스 토큰이 아닙니다."
 *                 - allOf:
 *                   - $ref: '#/components/schemas/ErrorResponse'
 *                   - properties:
 *                       error:
 *                         properties:
 *                           errorCode:
 *                             example: "AUTH_EXPIRED_TOKEN"
 *                           reason:
 *                             example: "이미 로그아웃된 토큰입니다."
 *                 - allOf:
 *                   - $ref: '#/components/schemas/ErrorResponse'
 *                   - properties:
 *                       error:
 *                         properties:
 *                           errorCode:
 *                             example: "AUTH_UNAUTHORIZED"
 *                           reason:
 *                             example: "액세스 토큰이 유효하지 않습니다."
 *                 - allOf:
 *                   - $ref: '#/components/schemas/ErrorResponse'
 *                   - properties:
 *                       error:
 *                         properties:
 *                           errorCode:
 *                             example: "MAILBOX_UNAUTHORIZED"
 *                           reason:
 *                             example: "인증이 필요합니다."
 *       404:
 *         description: |
 *           찾을 수 없음:
 *           - `AUTH_NOT_FOUND`: 인증 토큰이 없습니다.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "AUTH_NOT_FOUND"
 *                         reason:
 *                           example: "인증 토큰이 없습니다."
 */

/**
 * @swagger
 * /mailbox/anonymous/threads/{sessionId}/letters:
 *   get:
 *     summary: 익명 스레드 편지 목록 조회
 *     description: 특정 익명 스레드의 편지 목록을 조회합니다.
 *     tags: [편지함]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 세션 ID (MatchingSession ID)
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - properties:
 *                     success:
 *                       type: object
 *                       properties:
 *                         firstQuestion:
 *                           type: string
 *                           nullable: true
 *                           description: 첫 번째 편지의 질문
 *                         letters:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                               title:
 *                                 type: string
 *                               deliveredAt:
 *                                 type: string
 *                                 format: date-time
 *                                 nullable: true
 *                               readAt:
 *                                 type: string
 *                                 format: date-time
 *                                 nullable: true
 *                               isMine:
 *                                 type: boolean
 *                                 description: 내가 보낸 편지인지 여부
 *                               design:
 *                                 type: object
 *                                 properties:
 *                                   paperId:
 *                                     type: integer
 *                                     nullable: true
 *                                   stampId:
 *                                     type: integer
 *                                     nullable: true
 *                                   stampUrl:
 *                                     type: string
 *                                     nullable: true
 *                                     description: 스탬프 이미지 URL
 *       400:
 *         description: |
 *           잘못된 요청:
 *           - `REQ_BAD_REQUEST`: 요청 유효성 검사 실패
 *           - `MAILBOX_INVALID_SESSION_ID`: sessionId가 올바르지 않습니다.
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
 *                 - allOf:
 *                   - $ref: '#/components/schemas/ErrorResponse'
 *                   - properties:
 *                       error:
 *                         properties:
 *                           errorCode:
 *                             example: "MAILBOX_INVALID_SESSION_ID"
 *                           reason:
 *                             example: "sessionId가 올바르지 않습니다."
 *       401:
 *         description: |
 *           인증 실패:
 *           - `AUTH_TOKEN_EXPIRED`: 토큰이 만료되었습니다.
 *           - `AUTH_INVALID_TOKEN`: 액세스 토큰이 아니거나 유효하지 않습니다.
 *           - `AUTH_NOT_ACCESS_TOKEN`: 액세스 토큰이 아닙니다.
 *           - `AUTH_EXPIRED_TOKEN`: 이미 로그아웃된 토큰입니다.
 *           - `AUTH_UNAUTHORIZED`: 액세스 토큰이 유효하지 않습니다.
 *           - `AUTH_NOT_FOUND`: 인증 토큰이 없습니다.
 *           - `MAILBOX_UNAUTHORIZED`: 인증이 필요합니다.
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
 *                             example: "AUTH_TOKEN_EXPIRED"
 *                           reason:
 *                             example: "토큰이 만료되었습니다."
 *                 - allOf:
 *                   - $ref: '#/components/schemas/ErrorResponse'
 *                   - properties:
 *                       error:
 *                         properties:
 *                           errorCode:
 *                             example: "MAILBOX_UNAUTHORIZED"
 *                           reason:
 *                             example: "인증이 필요합니다."
 */

/**
 * @swagger
 * /mailbox/friends/threads/{friendId}/letters:
 *   get:
 *     summary: 친구 스레드 편지 목록 조회
 *     tags: [편지함]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: friendId
 *         required: true
 *         schema:
 *           type: integer
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
 *                         friendName:
 *                           type: string
 *                         firstQuestion:
 *                           type: string
 *                           nullable: true
 *                         friendLetters:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                               title:
 *                                 type: string
 *                               deliveredAt:
 *                                 type: string
 *                                 format: date-time
 *                                 nullable: true
 *                               readAt:
 *                                 type: string
 *                                 format: date-time
 *                                 nullable: true
 *                               design:
 *                                 type: object
 *                                 properties:
 *                                   paper:
 *                                     type: object
 *                                     nullable: true
 *                                     properties:
 *                                       id:
 *                                         type: integer
 *                                       color:
 *                                         type: string
 *                                       assetUrl:
 *                                         type: string
 *                                   stamp:
 *                                     type: object
 *                                     nullable: true
 *                                     properties:
 *                                       id:
 *                                         type: integer
 *                                       name:
 *                                         type: string
 *                                       assetUrl:
 *                                         type: string
 *                           description: 친구가 보낸 편지 목록
 *                         userLetters:
 *                           description: 첫 번째 편지의 질문
 *                         letters:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                               title:
 *                                 type: string
 *                               deliveredAt:
 *                                 type: string
 *                                 format: date-time
 *                                 nullable: true
 *                               readAt:
 *                                 type: string
 *                                 format: date-time
 *                                 nullable: true
 *                               question:
 *                                 type: object
 *                                 nullable: true
 *                                 properties:
 *                                   content:
 *                                     type: string
 *                               design:
 *                                 type: object
 *                                 properties:
 *                                   paper:
 *                                     type: object
 *                                     nullable: true
 *                                     properties:
 *                                       id:
 *                                         type: integer
 *                                       color:
 *                                         type: string
 *                                       assetUrl:
 *                                       name:
 *                                         type: string
 *                                   stamp:
 *                                     type: object
 *                                     nullable: true
 *                                     properties:
 *                                       id:
 *                                         type: integer
 *                                       name:
 *                                         type: string
 *                                       assetUrl:
 *                                         type: string
 *                           description: 내가 보낸 편지 목록
 *       401:
 *         description: |
 *           인증 실패:
 *           - `AUTH_TOKEN_EXPIRED`: 토큰이 만료되었습니다.
 *           - `AUTH_INVALID_TOKEN`: 액세스 토큰이 아니거나 유효하지 않습니다.
 *           - `AUTH_NOT_ACCESS_TOKEN`: 액세스 토큰이 아닙니다.
 *           - `AUTH_EXPIRED_TOKEN`: 이미 로그아웃된 토큰입니다.
 *           - `AUTH_UNAUTHORIZED`: 액세스 토큰이 유효하지 않습니다.
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
 *                             example: "AUTH_TOKEN_EXPIRED"
 *                           reason:
 *                             example: "토큰이 만료되었습니다."
 *                 - allOf:
 *                   - $ref: '#/components/schemas/ErrorResponse'
 *                   - properties:
 *                       error:
 *                         properties:
 *                           errorCode:
 *                             example: "AUTH_INVALID_TOKEN"
 *                           reason:
 *                             example: "액세스 토큰이 아니거나 유효하지 않습니다."
 *                 - allOf:
 *                   - $ref: '#/components/schemas/ErrorResponse'
 *                   - properties:
 *                       error:
 *                         properties:
 *                           errorCode:
 *                             example: "AUTH_NOT_ACCESS_TOKEN"
 *                           reason:
 *                             example: "액세스 토큰이 아닙니다."
 *                 - allOf:
 *                   - $ref: '#/components/schemas/ErrorResponse'
 *                   - properties:
 *                       error:
 *                         properties:
 *                           errorCode:
 *                             example: "AUTH_EXPIRED_TOKEN"
 *                           reason:
 *                             example: "이미 로그아웃된 토큰입니다."
 *                 - allOf:
 *                   - $ref: '#/components/schemas/ErrorResponse'
 *                   - properties:
 *                       error:
 *                         properties:
 *                           errorCode:
 *                             example: "AUTH_UNAUTHORIZED"
 *                           reason:
 *                             example: "액세스 토큰이 유효하지 않습니다."
 *       404:
 *         description: |
 *           찾을 수 없음:
 *           - `AUTH_NOT_FOUND`: 인증 토큰이 없습니다.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "AUTH_NOT_FOUND"
 *                         reason:
 *                           example: "인증 토큰이 없습니다."
 *       403:
 *         description: |
 *           친구 관계 아님:
 *           - `FRIEND_NOT_FRIEND`: 친구가 아닙니다.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "FRIEND_NOT_FRIEND"
 *                         reason:
 *                           example: "친구가 아닙니다."
 */

/**
 * @swagger
 * /mailbox/self:
 *   get:
 *     summary: 나에게 탭 목록 조회
 *     description: 나에게 보낸 편지 목록을 조회합니다.
 *     tags: [편지함]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - properties:
 *                     success:
 *                       type: object
 *                       properties:
 *                         letters:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                               title:
 *                                 type: string
 *                               createdAt:
 *                                 type: string
 *                                 format: date-time
 *                                 nullable: true
 *                               questionId:
 *                                 type: integer
 *                                 nullable: true
 *                               paperId:
 *                                 type: integer
 *                                 nullable: true
 *                                 description: 편지통 색상
 *                               stampId:
 *                                 type: integer
 *                                 nullable: true
 *                               stampUrl:
 *                                 type: string
 *                                 nullable: true
 *                                 description: 스탬프 이미지 URL
 *       401:
 *         description: |
 *           인증 실패:
 *           - `AUTH_TOKEN_EXPIRED`: 토큰이 만료되었습니다.
 *           - `AUTH_INVALID_TOKEN`: 액세스 토큰이 아니거나 유효하지 않습니다.
 *           - `AUTH_NOT_ACCESS_TOKEN`: 액세스 토큰이 아닙니다.
 *           - `AUTH_EXPIRED_TOKEN`: 이미 로그아웃된 토큰입니다.
 *           - `AUTH_UNAUTHORIZED`: 액세스 토큰이 유효하지 않습니다.
 *           - `MAILBOX_UNAUTHORIZED`: 인증이 필요합니다.
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
 *                             example: "AUTH_TOKEN_EXPIRED"
 *                           reason:
 *                             example: "토큰이 만료되었습니다."
 *                 - allOf:
 *                   - $ref: '#/components/schemas/ErrorResponse'
 *                   - properties:
 *                       error:
 *                         properties:
 *                           errorCode:
 *                             example: "AUTH_INVALID_TOKEN"
 *                           reason:
 *                             example: "액세스 토큰이 아니거나 유효하지 않습니다."
 *                 - allOf:
 *                   - $ref: '#/components/schemas/ErrorResponse'
 *                   - properties:
 *                       error:
 *                         properties:
 *                           errorCode:
 *                             example: "AUTH_NOT_ACCESS_TOKEN"
 *                           reason:
 *                             example: "액세스 토큰이 아닙니다."
 *                 - allOf:
 *                   - $ref: '#/components/schemas/ErrorResponse'
 *                   - properties:
 *                       error:
 *                         properties:
 *                           errorCode:
 *                             example: "AUTH_EXPIRED_TOKEN"
 *                           reason:
 *                             example: "이미 로그아웃된 토큰입니다."
 *                 - allOf:
 *                   - $ref: '#/components/schemas/ErrorResponse'
 *                   - properties:
 *                       error:
 *                         properties:
 *                           errorCode:
 *                             example: "AUTH_UNAUTHORIZED"
 *                           reason:
 *                             example: "액세스 토큰이 유효하지 않습니다."
 *                 - allOf:
 *                   - $ref: '#/components/schemas/ErrorResponse'
 *                   - properties:
 *                       error:
 *                         properties:
 *                           errorCode:
 *                             example: "MAILBOX_UNAUTHORIZED"
 *                           reason:
 *                             example: "인증이 필요합니다."
 *       404:
 *         description: |
 *           찾을 수 없음:
 *           - `AUTH_NOT_FOUND`: 인증 토큰이 없습니다.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "AUTH_NOT_FOUND"
 *                         reason:
 *                           example: "인증 토큰이 없습니다."
 */
