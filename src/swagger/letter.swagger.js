/**
 * @swagger

 * /letter-assets:
 *   get:
 *     summary: 편지 꾸미기 리소스 목록 조회
 *     tags: [편지]
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
 *                         papers:
 *                           type: array
 *                           items:
 *                             type: object
 *                         stamps:
 *                           type: array
 *                           items:
 *                             type: object
 *                         fonts:
 *                           type: array
 *                           items:
 *                             type: object
 *             examples:
 *               SUCCESS:
 *                 value:
 *                   resultType: "SUCCESS"
 *                   error: null
 *                   success:
 *                     papers:
 *                       - id: 1
 *                         color: "#FFFFFF"
 *                         assetUrl: "s3://papers/paper1.png"
 *                     fonts:
 *                       - id: 1
 *                         font: "Arial"
 *                         fontFamily: "sans-serif"
 *                     stamps:
 *                       - id: 1
 *                         name: "Default Stamp"
 *                         assetUrl: "s3://stamps/stamp1.png"
 *       401:
 *         description: |
 *           인증 실패:
 *           - `AUTH_TOKEN_EXPIRED`: 토큰이 만료되었습니다.
 *           - `AUTH_INVALID_TOKEN`: 액세스 토큰이 아니거나 유효하지 않습니다.
 *           - `AUTH_NOT_ACCESS_TOKEN`: 액세스 토큰이 아닙니다.
 *           - `AUTH_EXPIRED_TOKEN`: 이미 로그아웃된 토큰입니다.
 *           - `AUTH_UNAUTHORIZED`: 액세스 토큰이 유효하지 않습니다.
 *           - `AUTH_NOT_FOUND`: 인증 토큰이 없습니다.
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
 *                             example: "AUTH_NOT_FOUND"
 *                           reason:
 *                             example: "인증 토큰이 없습니다."
 */

/**
 * @swagger
 * /letter/me:
 *   post:
 *     summary: 나에게 편지 전송
 *     tags: [편지]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - questionId
 *               - title
 *               - content
 *               - isPublic
 *               - paperId
 *               - stampId
 *               - fontId
 *               - scheduledAt
 *             properties:
 *               questionId:
 *                 type: integer
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               isPublic:
 *                 type: boolean
 *               paperId:
 *                 type: integer
 *               stampId:
 *                 type: integer
 *               fontId:
 *                 type: integer
 *               scheduledAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: 전송 성공
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - properties:
 *                     success:
 *                       type: object
 *                       properties:
 *                         result:
 *                           type: object
 *                           properties:
 *                             status:
 *                               type: string
 *                               example: "success"
 *       400:
 *         description: |
 *           잘못된 요청:
 *           - `REQ_BAD_REQUEST`: 요청 유효성 검사 실패
 *           - `LETTER_BAD_WORD`: 편지 내용에 부적절한 단어 포함
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error: 
 *                       properties:
 *                         errorCode:
 *                           example: "LETTER_BAD_WORD"
 *                         reason:
 *                           example: "부적절한 단어가 포함되어있습니다."
 *       401:
 *         description: |
 *           인증 실패:
 *           - `AUTH_TOKEN_EXPIRED`: 토큰이 만료되었습니다.
 *           - `AUTH_INVALID_TOKEN`: 액세스 토큰이 아니거나 유효하지 않습니다.
 *           - `AUTH_NOT_ACCESS_TOKEN`: 액세스 토큰이 아닙니다.
 *           - `AUTH_EXPIRED_TOKEN`: 이미 로그아웃된 토큰입니다.
 *           - `AUTH_UNAUTHORIZED`: 액세스 토큰이 유효하지 않습니다.
 *           - `AUTH_NOT_FOUND`: 인증 토큰이 없습니다.
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
 *       404:
 *         description: 질문 없음 (QUESTION_NOT_FOUND)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "QUESTION_NOT_FOUND"
 *                         reason:
 *                           example: "해당 질문을 찾을 수 없습니다."
 */

/**
 * @swagger
 * /letter/other:
 *   post:
 *     summary: 타인/친구에게 편지 전송
 *     tags: [편지]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - questionId
 *               - title
 *               - content
 *               - isPublic
 *               - paperId
 *               - stampId
 *               - fontId
 *               - receiverUserId
 *             properties:
 *               questionId:
 *                 type: integer
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               isPublic:
 *                 type: boolean
 *               paperId:
 *                 type: integer
 *               stampId:
 *                 type: integer
 *               fontId:
 *                 type: integer
 *               receiverUserId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: 전송 성공
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - properties:
 *                     success:
 *                       type: object
 *                       properties:
 *                         result:
 *                           type: object
 *                           properties:
 *                             status:
 *                               type: string
 *                               example: "success"
 *       400:
 *         description: |
 *           잘못된 요청:
 *           - `REQ_BAD_REQUEST`: 요청 유효성 검사 실패
 *           - `LETTER_BAD_WORD`: 편지 내용에 부적절한 단어 포함
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error: 
 *                       properties:
 *                         errorCode:
 *                           example: "LETTER_BAD_WORD"
 *                         reason:
 *                           example: "부적절한 단어가 포함되어있습니다."
 *       401:
 *         description: |
 *           인증 실패:
 *           - `AUTH_TOKEN_EXPIRED`: 토큰이 만료되었습니다.
 *           - `AUTH_INVALID_TOKEN`: 액세스 토큰이 아니거나 유효하지 않습니다.
 *           - `AUTH_NOT_ACCESS_TOKEN`: 액세스 토큰이 아닙니다.
 *           - `AUTH_EXPIRED_TOKEN`: 이미 로그아웃된 토큰입니다.
 *           - `AUTH_UNAUTHORIZED`: 액세스 토큰이 유효하지 않습니다.
 *           - `AUTH_NOT_FOUND`: 인증 토큰이 없습니다.
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
 *       403:
 *         description: 편지 발송 한도 달성 (SESSION_MAX_TURN) 
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error: 
 *                       properties:
 *                         errorCode:
 *                           example: "SESSION_MAX_TURN"
 *                         reason:
 *                           example: "편지 주고 받은 횟수가 10번이 되었습니다."
 *       404:
 *         description: |
 *           조회 실패:
 *           - `USER_NOT_FOUND`: 해당 정보로 가입된 계정을 찾을 수 없습니다.
 *           - `QUESTION_NOT_FOUND`: 해당 질문을 찾을 수 없습니다.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "USER_NOT_FOUND"
 *                         reason:
 *                           example: "해당 정보로 가입된 계정을 찾을 수 없습니다."
 *       409:
 *         description: 자신에게 전송 시도 (USER_DUPLICATED_ID)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "USER_DUPLICATED_ID"
 *                         reason:
 *                           example: "전송하는 유저와 전달받는 유저의 ID가 같습니다"
 */

/**
 * @swagger
 * /letters/{letterId}:
 *   get:
 *     summary: 편지 상세 조회
 *     tags: [편지]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: letterId
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
 *                       description: "Letter details object"
 *       400:
 *         description: 없는 편지 (LETTER_NOT_FOUND)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "LETTER_NOT_FOUND"
 *                         reason:
 *                           example: "작성되지 않은 편지입니다."
 *       401:
 *         description: |
 *           인증 실패:
 *           - `AUTH_TOKEN_EXPIRED`: 토큰이 만료되었습니다.
 *           - `AUTH_INVALID_TOKEN`: 액세스 토큰이 아니거나 유효하지 않습니다.
 *           - `AUTH_NOT_ACCESS_TOKEN`: 액세스 토큰이 아닙니다.
 *           - `AUTH_EXPIRED_TOKEN`: 이미 로그아웃된 토큰입니다.
 *           - `AUTH_UNAUTHORIZED`: 액세스 토큰이 유효하지 않습니다.
 *           - `AUTH_NOT_FOUND`: 인증 토큰이 없습니다.
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
 */

/**
 * @swagger
 * /letters/{letterId}/like:
 *   post:
 *     summary: 편지 좋아요 추가
 *     tags: [편지]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: letterId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 좋아요 성공
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - properties:
 *                     success:
 *                       type: object
 *                       properties:
 *                         letterId:
 *                           type: integer
 *                         isLiked:
 *                           type: boolean
 *                           example: true
 *       401:
 *         description: |
 *           인증 실패:
 *           - `AUTH_TOKEN_EXPIRED`: 토큰이 만료되었습니다.
 *           - `AUTH_INVALID_TOKEN`: 액세스 토큰이 아니거나 유효하지 않습니다.
 *           - `AUTH_NOT_ACCESS_TOKEN`: 액세스 토큰이 아닙니다.
 *           - `AUTH_EXPIRED_TOKEN`: 이미 로그아웃된 토큰입니다.
 *           - `AUTH_UNAUTHORIZED`: 액세스 토큰이 유효하지 않습니다.
 *           - `AUTH_NOT_FOUND`: 인증 토큰이 없습니다.
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
 *       409:
 *         description: 이미 좋아요 누름 (LIKE_ALREADY_LIKED)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "LIKE_ALREADY_LIKED"
 *                         reason:
 *                           example: "이미 좋아요를 눌렀습니다."
 *   delete:
 *     summary: 편지 좋아요 삭제
 *     tags: [편지]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: letterId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 좋아요 취소 성공
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - properties:
 *                     success:
 *                       type: object
 *                       properties:
 *                         letterId:
 *                           type: integer
 *                         isLiked:
 *                           type: boolean
 *                           example: false
 *       401:
 *         description: |
 *           인증 실패:
 *           - `AUTH_TOKEN_EXPIRED`: 토큰이 만료되었습니다.
 *           - `AUTH_INVALID_TOKEN`: 액세스 토큰이 아니거나 유효하지 않습니다.
 *           - `AUTH_NOT_ACCESS_TOKEN`: 액세스 토큰이 아닙니다.
 *           - `AUTH_EXPIRED_TOKEN`: 이미 로그아웃된 토큰입니다.
 *           - `AUTH_UNAUTHORIZED`: 액세스 토큰이 유효하지 않습니다.
 *           - `AUTH_NOT_FOUND`: 인증 토큰이 없습니다.
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
 *       409:
 *         description: 좋아요 누르지 않음 (LIKE_ALREADY_UNLIKED)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "LIKE_ALREADY_UNLIKED"
 *                         reason:
 *                           example: "이미 좋아요를 누르지 않았습니다."
 */
