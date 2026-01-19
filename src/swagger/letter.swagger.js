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
 *       401:
 *         description: 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedErrorResponse'
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
 *         description: 유효성 검사 실패 (INVALID_TYPE_400)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       401:
 *         description: 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedErrorResponse'
 *       404:
 *         description: 참조 데이터 없음 (REF_404)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "REF_404"
 *                         reason:
 *                           example: "question_id 정보를 찾을 수 없습니다."
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
 *       401:
 *         description: 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedErrorResponse'
 *       404:
 *         description: 받는 사람 찾을 수 없음 (USER_404_02)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "USER_404_02"
 *                         reason:
 *                           example: "해당 정보로 가입된 계정을 찾을 수 없습니다."
 *       409:
 *         description: 자신에게 전송 시도 (USER_409_04)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "USER_409_04"
 *                         reason:
 *                           example: "전송하는 유저와 전달받는 유저의 id가 같습니다"
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
 *         description: 없는 편지 (LETTER_400_01)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "LETTER_400_01"
 *                         reason:
 *                           example: "작성되지 않은 편지입니다."
 *       401:
 *         description: 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedErrorResponse'
 */

/**
 * @swagger
 * /friends/{friendId}/conversations:
 *   get:
 *     summary: 친구 대화 목록 화면 조회
 *     tags: [편지]
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
 *                         letters:
 *                           type: array
 *                           items:
 *                             type: object
 *       401:
 *         description: 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedErrorResponse'
 *       403:
 *         description: 친구 관계 아님 (FRIEND_403_01)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "FRIEND_403_01"
 *                         reason:
 *                           example: "친구가 아닙니다."
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
 *         description: 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedErrorResponse'
 *       409:
 *         description: 이미 좋아요 누름 (LIKE_409_01)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "LIKE_409_01"
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
 *         description: 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedErrorResponse'
 *       409:
 *         description: 좋아요 누르지 않음 (LIKE_409_02)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "LIKE_409_02"
 *                         reason:
 *                           example: "이미 좋아요를 누르지 않았습니다."
 */
