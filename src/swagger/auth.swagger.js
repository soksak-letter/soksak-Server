/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: 회원가입
 *     tags: [로그인]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - username
 *               - name
 *               - phoneNumber
 *               - password
 *               - termsAgreed
 *               - privacyAgreed
 *               - ageOver14Agreed
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               username:
 *                 type: string
 *                 example: "username123"
 *               name:
 *                 type: string
 *                 example: "홍길동"
 *               phoneNumber:
 *                 type: string
 *                 example: "010-1234-5678"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               termsAgreed:
 *                 type: boolean
 *                 example: true
 *               privacyAgreed:
 *                 type: boolean
 *                 example: true
 *               ageOver14Agreed:
 *                 type: boolean
 *                 example: true
 *               marketingPushAgreed:
 *                 type: boolean
 *                 example: false
 *               marketingEmailAgreed:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: 회원가입 성공
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
 *                             id:
 *                               type: integer
 *                               example: 1
 *                             email:
 *                               type: string
 *                               example: "user@example.com"
 *                             name:
 *                               type: string
 *                               example: "홍길동"
 *                             tokens:
 *                               type: object
 *                               properties:
 *                                 jwtAccessToken:
 *                                   type: string
 *                                 jwtRefreshToken:
 *                                   type: string
 *       400:
 *         description: 약관 미동의 (TERM_BAD_REQUEST)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "TERM_BAD_REQUEST"
 *                         reason:
 *                           example: "필수 약관에 모두 동의해주세요."
 *       409:
 *         description: 중복된 이메일/아이디 (USER_EMAIL_DUPLICATED/USER_USERNAME_DUPLICATED)
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
 *                             example: "USER_EMAIL_DUPLICATED"
 *                           reason:
 *                             example: "이미 soksak에서 가입한 이메일입니다"
 *                 - allOf:
 *                   - $ref: '#/components/schemas/ErrorResponse'
 *                   - properties:
 *                       error:
 *                         properties:
 *                           errorCode:
 *                             example: "USER_USERNAME_DUPLICATED"
 *                           reason:
 *                             example: "이미 존재하는 아이디입니다."
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: 로그인
 *     tags: [로그인]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: "username123"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: 로그인 성공
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
 *                             jwtAccessToken:
 *                               type: string
 *                             jwtRefreshToken:
 *                               type: string
 *       401:
 *         description: 로그인 실패 (AUTH_BAD_REQUEST)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "AUTH_BAD_REQUEST"
 *                         reason:
 *                           example: "아이디 또는 비밀번호가 일치하지 않습니다."
 */

/**
 * @swagger
 * /auth/oauth/{provider}:
 *   get:
 *     summary: 소셜 로그인 페이지로 리디렉션
 *     description: 지정된 소셜 로그인 페이지로 사용자를 리디렉션합니다. (주로 웹 브라우저에서 사용)
 *     tags: [로그인]
 *     parameters:
 *       - in: path
 *         name: provider
 *         required: true
 *         schema:
 *           type: string
 *           enum: [google, kakao, naver, apple]
 *         description: 소셜 로그인 제공자
 *     responses:
  *       422:
 *         description: 지원하지 않는 소셜 로그인 제공자 (AUTH_UNPROCESSABLE_PROVIDER)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "AUTH_UNPROCESSABLE_PROVIDER"
 *                         reason:
 *                           example: "지원하지 않는 소셜입니다."
 *       302:
 *         description: 소셜 로그인 페이지로 성공적으로 리디렉션됩니다.
 */

/**
 * @swagger
 * /auth/login/{provider}:
 *   post:
 *     summary: 소셜 로그인 (클라이언트용)
 *     description: |
 *       클라이언트(예: 모바일 앱)에서 소셜 로그인을 통해 얻은 인증 코드를 사용하여 로그인을 처리하고 JWT 토큰을 발급합니다.
 *       서버는 이 코드를 받아 소셜 제공자와 통신하여 사용자 프로필을 확인하고, 기존 사용자인 경우 로그인 처리, 신규 사용자인 경우 회원가입 후 로그인 처리합니다.
 *     tags: [로그인]
 *     parameters:
 *       - in: path
 *         name: provider
 *         required: true
 *         schema:
 *           type: string
 *           enum: [google, kakao, naver, apple]
 *         description: 소셜 로그인 제공자
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *                 description: 소셜 로그인 제공자로부터 받은 인증 코드
 *                 example: "authorization_code_string"
 *     responses:
 *       200:
 *         description: 로그인 성공. 신규 사용자인 경우 가입 처리 후 토큰 발급.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - properties:
 *                     success:
 *                       type: object
 *                       properties:
 *                         userId:
 *                           type: integer
 *                           example: 123
 *                         tokens:
 *                           type: object
 *                           properties:
 *                             jwtAccessToken:
 *                               type: string
 *                               example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                             jwtRefreshToken:
 *                               type: string
 *                               example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: 유효하지 않은 인가 코드 (AUTH_INVALID_GRANT)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "AUTH_INVALID_GRANT"
 *                         reason:
 *                           example: "유효하지 않은 인가코드입니다."
 *       404:
 *         description: 사용자 이메일 정보 없음 (USER_NOT_FOUND)
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
 *                           example: "존재하지 않는 이메일입니다."
 *       409:
 *         description: 다른 소셜 제공자로 이미 가입된 이메일 (USER_EMAIL_DUPLICATED)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "USER_EMAIL_DUPLICATED"
 *                         reason:
 *                           example: "이미 google에서 가입한 이메일입니다"
 *       422:
 *         description: 지원하지 않는 소셜 로그인 제공자 (AUTH_UNPROCESSABLE_PROVIDER)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "AUTH_UNPROCESSABLE_PROVIDER"
 *                         reason:
 *                           example: "지원하지 않는 소셜입니다."
 */

/**
 * @swagger
 * /auth/username/exists:
 *   post:
 *     summary: 아이디 중복 확인
 *     description: "아이디가 사용 가능하면 200 OK, 중복이면 409 Conflict 에러를 반환합니다."
 *     tags: [로그인]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *             properties:
 *               username:
 *                 type: string
 *                 example: "username123"
 *     responses:
 *       200:
 *         description: 사용 가능한 아이디
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - properties:
 *                     success:
 *                       type: object
 *                       properties:
 *                         exists:
 *                           type: boolean
 *                           example: false
 *       409:
 *         description: 이미 존재하는 아이디 (USER_USERNAME_DUPLICATED)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "USER_USERNAME_DUPLICATED"
 *                         reason:
 *                           example: "이미 존재하는 아이디입니다."
 */

/**
 * @swagger
 * /auth/email/exists:
 *   post:
 *     summary: 이메일 중복 확인
 *     description: "이메일이 사용 가능하면 200 OK, 중복이면 409 Conflict 에러를 반환합니다."
 *     tags: [로그인]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "test@example.com"
 *     responses:
 *       200:
 *         description: 사용 가능한 이메일
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - properties:
 *                     success:
 *                       type: object
 *                       properties:
 *                         exists:
 *                           type: boolean
 *                           example: false
 *       409:
 *         description: 이미 가입된 이메일 (USER_EMAIL_DUPLICATED)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "USER_EMAIL_DUPLICATED"
 *                         reason:
 *                           example: "이미 가입된 이메일입니다."
 */

/**
 * @swagger
 * /auth/refresh:
 *   get:
 *     summary: 액세스 토큰 재발급
 *     tags: [로그인]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: "Bearer {refreshToken}"
 *     responses:
 *       200:
 *         description: 재발급 성공
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - properties:
 *                     success:
 *                       type: object
 *                       properties:
 *                         jwtAccessToken:
 *                           type: string
 *       401:
 *         description: 유효하지 않은 리프레시 토큰 (AUTH_INVALID_TOKEN)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "AUTH_INVALID_TOKEN"
 *                         reason:
 *                           example: "리프레시 토큰이 아니거나 유효하지 않습니다."
 */

/**
 * @swagger
 * /auth/{type}/verification-codes:
 *   post:
 *     summary: 이메일 인증번호 전송
 *     tags: [로그인]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [find-id, reset-password]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
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
 *                         expiredAt:
 *                           type: string
 *                           format: date-time
 *                         expiredInSeconds:
 *                           type: integer
 *                           example: 600
 *       404:
 *         description: 가입된 계정 없음 (USER_NOT_FOUND)
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
 *       429:
 *         description: 요청 제한 초과 (EMAIL_TOO_MANY_REQUEST)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "EMAIL_TOO_MANY_REQUEST"
 *                         reason:
 *                           example: "5분 후 다시 시도해주세요."
 */

/**
 * @swagger
 * /auth/{type}/verification-codes/confirm:
 *   post:
 *     summary: 이메일 인증번호 확인
 *     tags: [로그인]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [find-id, reset-password]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - code
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               code:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: 인증 성공
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - properties:
 *                     success:
 *                       type: object
 *                       properties:
 *                         verified:
 *                           type: boolean
 *                           example: true
 *                         jwtAccessToken:
 *                           type: string
 *                           description: "reset-password 타입일 경우에만 반환됨"
 *       400:
 *         description: 인증번호 불일치 (EMAIL_INVALID_CODE)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "EMAIL_INVALID_CODE"
 *                         reason:
 *                           example: "인증번호가 일치하지 않습니다."
 *       404:
 *         description: 가입된 계정 없음 (USER_NOT_FOUND)
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
 */

/**
 * @swagger
 * /auth/find-id:
 *   post:
 *     summary: 아이디 찾기
 *     tags: [로그인]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: 찾기 성공
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - properties:
 *                     success:
 *                       type: object
 *                       properties:
 *                         username:
 *                           type: string
 *                           example: "foundUser***"
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *       401:
 *         description: 인증되지 않은 이메일 (EMAIL_UNAUTHORIZED)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "EMAIL_UNAUTHORIZED"
 *                         reason:
 *                           example: "인증되지 않은 이메일입니다."
 *       404:
 *         description: 계정 없음 (USER_NOT_FOUND)
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
 */

/**
 * @swagger
 * /auth/reset-password:
 *   patch:
 *     summary: 비밀번호 재설정
 *     description: "/auth/reset-password/confirm 에서 발급받은 임시 AccessToken이 필요합니다."
 *     tags: [로그인]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 example: "newPass123!"
 *     responses:
 *       200:
 *         description: 재설정 성공
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
 *                           example: "비밀번호 재설정이 완료되었습니다."
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
 * /auth/logout:
 *   post:
 *     summary: 로그아웃
 *     tags: [로그인]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 로그아웃 성공
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
 *                               example: "Logged Out"
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
 *       500:
 *         description: 로그아웃 실패 (INTERNAL_SERVER_ERROR)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
 *                       properties:
 *                         errorCode:
 *                           example: "INTERNAL_SERVER_ERROR"
 *                         reason:
 *                           example: "로그아웃에 실패했습니다. 다시 시도해주세요."
 */

/**
 * @swagger
 * /users:
 *   delete:
 *     summary: 회원 탈퇴
 *     tags: [로그인]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 탈퇴 성공
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
 *                               example: "Deleted"
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
 *       404:
 *         description: 계정 없음 (USER_NOT_FOUND)
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
 *       500:
 *         description: 로그아웃 실패 (INTERNAL_SERVER_ERROR)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - properties:
 *                     error:
                       properties:
 *                         errorCode:
 *                           example: "INTERNAL_SERVER_ERROR"
 *                         reason:
 *                           example: "로그아웃에 실패했습니다. 다시 시도해주세요."
 */