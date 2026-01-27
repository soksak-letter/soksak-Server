/* =========================
 * 제재 (restrict)
 * ========================= */

/**
 * @swagger
 * /restrict:
 *   get:
 *     summary: 내 제재 목록 조회
 *     tags: [제재]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 제재 목록 조회 성공
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
 *                           example: "제재 목록 출력에 성공하였습니다."
 *                         result:
 *                           type: array
 *                           description: 제재 목록
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                                 example: 1
 *                               userId:
 *                                 type: integer
 *                                 example: 14
 *                               reason:
 *                                 type: string
 *                                 example: "비속어 사용"
 *                               startsAt:
 *                                 type: string
 *                                 format: date-time
 *                                 example: "2026-01-21T13:49:32.735Z"
 *                               endsAt:
 *                                 type: string
 *                                 format: date-time
 *                                 example: "2026-01-28T13:49:32.735Z"
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
 *       500:
 *         description: 제재 조회 중 서버 오류 (RESTRICT_INTERNALSERVER_ERROR)
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
 *                           example: "RESTRICT_INTERNALSERVER_ERROR"
 *                         reason:
 *                           example: "서버 오류가 발생하였습니다."
 */
