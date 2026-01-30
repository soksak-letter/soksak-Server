/**
 * @swagger
 * /users/me/onboarding:
 *   patch:
 *     summary: 기본정보 저장
 *     description: 사용자의 성별과 직업 정보를 저장합니다.
 *     tags: [온보딩]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - gender
 *               - job
 *             properties:
 *               gender:
 *                 type: string
 *                 enum: [MALE, FEMALE, UNKNOWN]
 *                 description: 성별 (UNKNOWN = 비공개)
 *               job:
 *                 type: string
 *                 enum: [WORKER, STUDENT, HOUSEWIFE, FREELANCER, UNEMPLOYED, OTHER]
 *                 description: 직업
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
 *                         updated:
 *                           type: boolean
 *                           example: true
 *       400:
 *         description: |
 *           잘못된 요청:
 *           - `REQ_BAD_REQUEST`: 요청 유효성 검사 실패
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
 *           - `USER_NOT_FOUND`: 유저를 찾을 수 없습니다.
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
 *                             example: "AUTH_NOT_FOUND"
 *                           reason:
 *                             example: "인증 토큰이 없습니다."
 *                 - allOf:
 *                   - $ref: '#/components/schemas/ErrorResponse'
 *                   - properties:
 *                       error:
 *                         properties:
 *                           errorCode:
 *                             example: "USER_NOT_FOUND"
 *                           reason:
 *                             example: "유저를 찾을 수 없습니다."
 *       409:
 *         description: 이미 온보딩이 완료된 사용자 (USER_ONBOARDING_ALREADY_COMPLETED)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "USER_ONBOARDING_ALREADY_COMPLETED"
 *                         reason:
 *                           example: "이미 온보딩 1이 완료된 사용자입니다."
 */

/**
 * @swagger
 * /users/me/onboarding/interests:
 *   put:
 *     summary: 관심사 저장
 *     description: 사용자의 관심사를 저장합니다. 최소 3개 이상 선택해야 합니다.
 *     tags: [온보딩]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - interestIds
 *             properties:
 *               interestIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 minItems: 3
 *                 description: 관심사 ID 배열 (최소 3개)
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
 *                         updated:
 *                           type: boolean
 *                           example: true
 *       400:
 *         description: |
 *           잘못된 요청:
 *           - `REQ_BAD_REQUEST`: 요청 유효성 검사 실패
 *           - `USER_INTEREST_IDS_NOT_ARRAY`: interestIds는 배열이어야 합니다.
 *           - `USER_INTEREST_IDS_INVALID_FORMAT`: interestIds는 양의 정수 배열이어야 합니다.
 *           - `USER_INTEREST_IDS_MIN_COUNT`: 관심사는 최소 3개 선택해야 합니다.
 *           - `USER_INTEREST_IDS_INVALID`: 유효하지 않은 관심사 id가 포함되어 있습니다.
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
 *                             example: "USER_INTEREST_IDS_NOT_ARRAY"
 *                           reason:
 *                             example: "interestIds는 배열이어야 합니다."
 *                 - allOf:
 *                   - $ref: '#/components/schemas/ErrorResponse'
 *                   - properties:
 *                       error:
 *                         properties:
 *                           errorCode:
 *                             example: "USER_INTEREST_IDS_INVALID_FORMAT"
 *                           reason:
 *                             example: "interestIds는 양의 정수 배열이어야 합니다."
 *                 - allOf:
 *                   - $ref: '#/components/schemas/ErrorResponse'
 *                   - properties:
 *                       error:
 *                         properties:
 *                           errorCode:
 *                             example: "USER_INTEREST_IDS_MIN_COUNT"
 *                           reason:
 *                             example: "관심사는 최소 3개 선택해야 합니다."
 *                 - allOf:
 *                   - $ref: '#/components/schemas/ErrorResponse'
 *                   - properties:
 *                       error:
 *                         properties:
 *                           errorCode:
 *                             example: "USER_INTEREST_IDS_INVALID"
 *                           reason:
 *                             example: "유효하지 않은 관심사 id가 포함되어 있습니다."
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
 */

/**
 * @swagger
 * /interests/all:
 *   get:
 *     summary: 관심사 조회
 *     description: 전체 활성 관심사 목록을 조회합니다. (로그인 불필요)
 *     tags: [온보딩]
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
 *                         items:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                                 description: 관심사 ID
 *                               name:
 *                                 type: string
 *                                 description: 관심사 이름
 */

/**
 * @swagger
 * /interests:
 *   get:
 *     summary: 태그 목록 조회
 *     description: 내가 선택한 관심사 목록을 조회합니다. (로그인 필요)
 *     tags: [온보딩]
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
 *                         items:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                                 description: 관심사 ID
 *                               name:
 *                                 type: string
 *                                 description: 관심사 이름
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
 */

/**
 * @swagger
 * /users/me/notification-settings:
 *   get:
 *     summary: 알림 설정 조회
 *     description: 사용자의 알림 설정을 조회합니다.
 *     tags: [알림/설정]
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
 *                         letter:
 *                           type: boolean
 *                           description: 편지 알림 설정
 *                         marketing:
 *                           type: boolean
 *                           description: 마케팅 알림 설정
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
 */

/**
 * @swagger
 * /users/me/notification-settings:
 *   patch:
 *     summary: 알림 설정 갱신
 *     description: 사용자의 알림 설정을 업데이트합니다.
 *     tags: [알림/설정]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               letter:
 *                 type: boolean
 *                 description: 편지 알림 설정
 *               marketing:
 *                 type: boolean
 *                 description: 마케팅 알림 설정
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
 *                         updated:
 *                           type: boolean
 *                           example: true
 *       400:
 *         description: |
 *           잘못된 요청:
 *           - `REQ_BAD_REQUEST`: 요청 유효성 검사 실패
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
 */

/**
 * @swagger
 * /users/me/agreements:
 *   post:
 *     summary: 이용약관 동의
 *     description: 사용자의 이용약관 동의를 저장합니다.
 *     tags: [알림/설정]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - termsAgreed
 *               - privacyAgreed
 *               - ageOver14Agreed
 *             properties:
 *               termsAgreed:
 *                 type: boolean
 *                 description: 서비스 이용약관 동의
 *                 example: true
 *               privacyAgreed:
 *                 type: boolean
 *                 description: 개인정보 처리방침 동의
 *                 example: true
 *               ageOver14Agreed:
 *                 type: boolean
 *                 description: 만 14세 이상 동의
 *                 example: true
 *               marketingAgreed:
 *                 type: boolean
 *                 description: 마케팅 정보 수신 동의 (선택)
 *                 example: false
 *     responses:
 *       200:
 *         description: 동의 완료
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - properties:
 *                     success:
 *                       type: object
 *                       example: { message: "약관 동의가 완료되었습니다." }
 *       400:
 *         description: |
 *           잘못된 요청:
 *           - `REQ_BAD_REQUEST`: 요청 유효성 검사 실패
 *           - `TERM_BAD_REQUEST`: 필수 약관 미동의
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
 *                             example: "TERM_BAD_REQUEST"
 *                           reason:
 *                             example: "필수 약관에 모두 동의해주세요."
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
 * /users/me/consents:
 *   get:
 *     summary: 정보 동의 설정 조회
 *     description: 사용자의 정보 동의 설정을 조회합니다.
 *     tags: [알림/설정]
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
 *                         termsAgreed:
 *                           type: boolean
 *                           description: 이용약관 동의 여부
 *                         privacyAgreed:
 *                           type: boolean
 *                           description: 개인정보 처리방침 동의 여부
 *                         ageOver14Agreed:
 *                           type: boolean
 *                           description: 만 14세 이상 동의 여부
 *                         marketingPushAgreed:
 *                           type: boolean
 *                           description: 푸시 알림 수신 동의 여부
 *                         marketingEmailAgreed:
 *                           type: boolean
 *                           description: 이메일 수신 동의 여부
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
 */

/**
 * @swagger
 * /users/me/consents:
 *   patch:
 *     summary: 정보 동의 설정 갱신
 *     description: 사용자의 정보 동의 설정을 업데이트합니다. **필수 항목**에 동의하지 않으면 에러가 발생합니다.
 *     tags: [알림/설정]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - termsAgreed
 *               - privacyAgreed
 *               - ageOver14Agreed
 *             properties:
 *               termsAgreed:
 *                 type: boolean
 *                 description: 이용약관 동의 여부 (필수)
 *                 example: true
 *               privacyAgreed:
 *                 type: boolean
 *                 description: 개인정보 처리방침 동의 여부 (필수)
 *                 example: true
 *               ageOver14Agreed:
 *                 type: boolean
 *                 description: 만 14세 이상 동의 여부 (필수)
 *                 example: true
 *               marketingPushAgreed:
 *                 type: boolean
 *                 description: 푸시 알림 수신 동의 여부
 *                 example: false
 *               marketingEmailAgreed:
 *                 type: boolean
 *                 description: 이메일 수신 동의 여부
 *                 example: false
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
 *                         result:
 *                           type: object
 *       400:
 *         description: |
 *           잘못된 요청:
 *           - `REQ_BAD_REQUEST`: 요청 유효성 검사 실패
 *           - `TERM_BAD_REQUEST`: 필수 약관 미동의
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
 *                             example: "TERM_BAD_REQUEST"
 *                           reason:
 *                             example: "필수 약관에 모두 동의해주세요."
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
 *           - `USER_NOT_FOUND`: 해당 정보로 가입된 계정을 찾을 수 없습니다.
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
 *                             example: "AUTH_NOT_FOUND"
 *                           reason:
 *                             example: "인증 토큰이 없습니다."
 *                 - allOf:
 *                   - $ref: '#/components/schemas/ErrorResponse'
 *                   - properties:
 *                       error:
 *                         properties:
 *                           errorCode:
 *                             example: "USER_NOT_FOUND"
 *                           reason:
 *                             example: "해당 정보로 가입된 계정을 찾을 수 없습니다."
 */

/**
 * @swagger
 * /users/me/push-subscriptions:
 *   put:
 *     summary: 푸시 구독 갱신
 *     description: 사용자의 푸시 구독 정보를 업데이트합니다.
 *     tags: [알림/설정]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - endpoint
 *               - keys
 *             properties:
 *               endpoint:
 *                 type: string
 *                 description: 푸시 구독 엔드포인트
 *               keys:
 *                 type: object
 *                 required:
 *                   - p256dh
 *                   - auth
 *                 properties:
 *                   p256dh:
 *                     type: string
 *                     description: P256DH 키
 *                   auth:
 *                     type: string
 *                     description: 인증 키
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
 *                         updated:
 *                           type: boolean
 *                           example: true
 *       400:
 *         description: |
 *           잘못된 요청:
 *           - `REQ_BAD_REQUEST`: 요청 유효성 검사 실패
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
 */

/**
 * @swagger
 * /users/me/profile:
 *   get:
 *     summary: 프로필 조회
 *     description: 사용자의 프로필 정보를 조회합니다.
 *     tags: [프로필]
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
 *                         id:
 *                           type: integer
 *                           description: 사용자 ID
 *                         nickname:
 *                           type: string
 *                           description: 닉네임
 *                         email:
 *                           type: string
 *                           description: 이메일
 *                         profileImageUrl:
 *                           type: string
 *                           nullable: true
 *                           description: 프로필 이미지 URL
 *                         interests:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                               name:
 *                                 type: string
 *                           description: 관심사 목록
 *                         sentLettersCount:
 *                           type: integer
 *                           description: 보낸 편지 수
 *                         receivedLettersCount:
 *                           type: integer
 *                           description: 받은 편지 수
 *                         temperatureAvg:
 *                           type: number
 *                           nullable: true
 *                           description: 평균 온도 점수
 *                         totalUsageMinutes:
 *                           type: integer
 *                           description: 총 사용 시간 (분)
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
 *           - `USER_NOT_FOUND`: 유저를 찾을 수 없습니다.
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
 *                             example: "AUTH_NOT_FOUND"
 *                           reason:
 *                             example: "인증 토큰이 없습니다."
 *                 - allOf:
 *                   - $ref: '#/components/schemas/ErrorResponse'
 *                   - properties:
 *                       error:
 *                         properties:
 *                           errorCode:
 *                             example: "USER_NOT_FOUND"
 *                           reason:
 *                             example: "유저를 찾을 수 없습니다."
 */

/**
 * @swagger
 * /users/me/profile:
 *   patch:
 *     summary: 프로필 닉네임 수정
 *     description: 사용자의 닉네임을 수정합니다. (2-20자)
 *     tags: [프로필]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nickname:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 20
 *                 description: 닉네임
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
 *                         updated:
 *                           type: boolean
 *                           example: true
 *       400:
 *         description: |
 *           잘못된 요청:
 *           - `REQ_BAD_REQUEST`: 요청 유효성 검사 실패
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
 */

/**
 * @swagger
 * /users/me/profile/image:
 *   post:
 *     summary: 프로필 이미지 업로드
 *     description: '사용자의 프로필 이미지를 업로드합니다. (multipart/form-data, field name: "image")'
 *     tags: [프로필]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: 이미지 파일 (jpg/png/webp, 최대 5MB)
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
 *                         updated:
 *                           type: boolean
 *                           example: true
 *                         profileImageUrl:
 *                           type: string
 *                           description: 업로드된 프로필 이미지 URL
 *       400:
 *         description: |
 *           잘못된 요청:
 *           - `USER_PROFILE_FILE_REQUIRED`: 이미지 파일이 필요합니다.
 *           - `USER_PROFILE_IMAGE_TYPE_INVALID`: 지원하지 않는 이미지 형식입니다.
 *           - `USER_PROFILE_FILE_TOO_LARGE`: 파일 크기가 너무 큽니다.
 *           - `USER_PROFILE_FILE_BUFFER_MISSING`: 파일 버퍼를 찾을 수 없습니다.
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
 *                             example: "USER_PROFILE_FILE_REQUIRED"
 *                           reason:
 *                             example: "이미지 파일이 필요합니다."
 *                 - allOf:
 *                   - $ref: '#/components/schemas/ErrorResponse'
 *                   - properties:
 *                       error:
 *                         properties:
 *                           errorCode:
 *                             example: "USER_PROFILE_IMAGE_TYPE_INVALID"
 *                           reason:
 *                             example: "지원하지 않는 이미지 형식입니다. (jpg/png/webp 허용)"
 *                 - allOf:
 *                   - $ref: '#/components/schemas/ErrorResponse'
 *                   - properties:
 *                       error:
 *                         properties:
 *                           errorCode:
 *                             example: "USER_PROFILE_FILE_TOO_LARGE"
 *                           reason:
 *                             example: "파일 크기가 너무 큽니다. 최대 5MB까지 업로드 가능합니다."
 *                 - allOf:
 *                   - $ref: '#/components/schemas/ErrorResponse'
 *                   - properties:
 *                       error:
 *                         properties:
 *                           errorCode:
 *                             example: "USER_PROFILE_FILE_BUFFER_MISSING"
 *                           reason:
 *                             example: "파일 버퍼를 찾을 수 없습니다."
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
 */

/**
 * @swagger
 * /users/me/activity:
 *   post:
 *     summary: 활동 시간 갱신
 *     description: 사용자의 활동 시간을 갱신합니다.
 *     tags: [프로필]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
 *                         message:
 *                           type: string
 *                           example: "Activity updated successfully"
 *       400:
 *         description: |
 *           잘못된 요청:
 *           - `REQ_BAD_REQUEST`: 요청 유효성 검사 실패
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
 *           - `USER_NOT_FOUND`: 사용자를 찾을 수 없습니다.
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
 *                             example: "AUTH_NOT_FOUND"
 *                           reason:
 *                             example: "인증 토큰이 없습니다."
 *                 - allOf:
 *                   - $ref: '#/components/schemas/ErrorResponse'
 *                   - properties:
 *                       error:
 *                         properties:
 *                           errorCode:
 *                             example: "USER_NOT_FOUND"
 *                           reason:
 *                             example: "사용자를 찾을 수 없습니다."
 */
