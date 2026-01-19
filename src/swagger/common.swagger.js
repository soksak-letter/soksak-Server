/**
 * @swagger
 * components:
 *   schemas:
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         resultType:
 *           type: string
 *           example: "SUCCESS"
 *         error:
 *           type: object
 *           nullable: true
 *           example: null
 *         success:
 *           type: object
 *           description: "API specific response data"
 *     
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         resultType:
 *           type: string
 *           example: "FAIL"
 *         error:
 *           type: object
 *           properties:
 *             errorCode:
 *               type: string
 *               description: "Error code (e.g., AUTH_401_01)"
 *             reason:
 *               type: string
 *               description: "Error message"
 *             data:
 *               type: object
 *               nullable: true
 *               description: "Additional error details"
 *         success:
 *           type: object
 *           nullable: true
 *           example: null
 *
 *     ValidationErrorResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/ErrorResponse'
 *         - properties:
 *             error:
 *               properties:
 *                 errorCode:
 *                   example: "INVALID_TYPE_400"
 *                 reason:
 *                   example: "입력값이 잘못되었습니다"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                       message:
 *                         type: string
 *
 *     UnauthorizedErrorResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/ErrorResponse'
 *         - properties:
 *             error:
 *               properties:
 *                 errorCode:
 *                   example: "AUTH_401_02"
 *                 reason:
 *                   example: "액세스 토큰이 아니거나 유효하지 않습니다."
 */