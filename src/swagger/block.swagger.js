/* =========================
 * 차단 (block)
 * ========================= */

/**
 * @swagger
 * /block/{targetUserId}:
 *   post:
 *     summary: 유저 차단
 *     tags: [차단]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: targetUserId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 12
 *     responses:
 *       201:
 *         description: 유저 차단 성공
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
 *                           example: "유저 차단에 성공하였습니다."
 *                         result:
 *                           type: boolean
 *                           example: true
 *       400:
 *         description: 입력값 검증 실패 (REQ_BAD_REQUEST)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "REQ_BAD_REQUEST"
 *                         reason:
 *                           example: "입력값이 잘못되었습니다"
 *                         data:
 *                           example:
 *                             [
 *                               { "field": "params.targetUserId", "message": "숫자여야 합니다." }
 *                             ]
 *       401:
 *         description: 인증 필요 (UNAUTHORIZED)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "UNAUTHORIZED"
 *                         reason:
 *                           example: "인증이 필요합니다"
 *       404:
 *         description: 유저를 찾을 수 없음 (INVALID_USER_ERROR)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "INVALID_USER_ERROR"
 *                         reason:
 *                           example: "유저를 찾을 수 없습니다."
 *       500:
 *         description: 차단 처리 중 서버 오류 (BLOCK_INTERNALSERVER_ERROR)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "BLOCK_INTERNALSERVER_ERROR"
 *                         reason:
 *                           example: "서버 에러가 발생하였습니다."
 */
