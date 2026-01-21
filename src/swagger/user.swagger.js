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
 *               type: object
 *               properties:
 *                 resultType:
 *                   type: string
 *                   example: SUCCESS
 *                 error:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 success:
 *                   type: object
 *                   properties:
 *                     updated:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: 잘못된 요청 (gender 또는 job 값이 올바르지 않음)
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 유저를 찾을 수 없음
 *       409:
 *         description: 이미 온보딩이 완료된 사용자
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
 *               type: object
 *               properties:
 *                 resultType:
 *                   type: string
 *                   example: SUCCESS
 *                 error:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 success:
 *                   type: object
 *                   properties:
 *                     termsAgreed:
 *                       type: boolean
 *                       description: 이용약관 동의 여부
 *                     privacyAgreed:
 *                       type: boolean
 *                       description: 개인정보 처리방침 동의 여부
 *                     ageOver14Agreed:
 *                       type: boolean
 *                       description: 만 14세 이상 동의 여부
 *                     marketingAgreed:
 *                       type: boolean
 *                       description: 마케팅 정보 수신 동의 여부
 *       401:
 *         description: 인증 실패
 */

/**
 * @swagger
 * /users/me/consents:
 *   patch:
 *     summary: 정보 동의 설정 갱신
 *     description: 사용자의 정보 동의 설정을 업데이트합니다.
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
 *               termsAgreed:
 *                 type: boolean
 *                 description: 이용약관 동의 여부
 *               privacyAgreed:
 *                 type: boolean
 *                 description: 개인정보 처리방침 동의 여부
 *               marketingAgreed:
 *                 type: boolean
 *                 description: 마케팅 정보 수신 동의 여부
 *               ageOver14Agreed:
 *                 type: boolean
 *                 description: 만 14세 이상 동의 여부
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultType:
 *                   type: string
 *                   example: SUCCESS
 *                 error:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 success:
 *                   type: object
 *                   properties:
 *                     updated:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: 잘못된 요청 (모든 값은 boolean이어야 함)
 *       401:
 *         description: 인증 실패
 */

/**
 * @swagger
 * /users/me/device-tokens:
 *   put:
 *     summary: 디바이스 토큰 갱신
 *     description: 사용자의 디바이스 토큰을 업데이트합니다.
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
 *               deviceToken:
 *                 type: string
 *                 description: 디바이스 토큰
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultType:
 *                   type: string
 *                   example: SUCCESS
 *                 error:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 success:
 *                   type: object
 *                   properties:
 *                     updated:
 *                       type: boolean
 *                       example: true
 *       401:
 *         description: 인증 실패
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
 *               type: object
 *               properties:
 *                 resultType:
 *                   type: string
 *                   example: SUCCESS
 *                 error:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 success:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             description: 관심사 ID
 *                           name:
 *                             type: string
 *                             description: 관심사 이름
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
 *               type: object
 *               properties:
 *                 resultType:
 *                   type: string
 *                   example: SUCCESS
 *                 error:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 success:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             description: 관심사 ID
 *                           name:
 *                             type: string
 *                             description: 관심사 이름
 *       401:
 *         description: 인증 실패
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
 *               type: object
 *               properties:
 *                 resultType:
 *                   type: string
 *                   example: SUCCESS
 *                 error:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 success:
 *                   type: object
 *                   properties:
 *                     updated:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: 잘못된 요청 (관심사가 3개 미만이거나 유효하지 않은 ID 포함)
 *       401:
 *         description: 인증 실패
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
 *               type: object
 *               properties:
 *                 resultType:
 *                   type: string
 *                   example: SUCCESS
 *                 error:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 success:
 *                   type: object
 *                   properties:
 *                     letter:
 *                       type: boolean
 *                       description: 편지 알림 설정
 *                     marketing:
 *                       type: boolean
 *                       description: 마케팅 알림 설정
 *       401:
 *         description: 인증 실패
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
 *               type: object
 *               properties:
 *                 resultType:
 *                   type: string
 *                   example: SUCCESS
 *                 error:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 success:
 *                   type: object
 *                   properties:
 *                     updated:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: 잘못된 요청 (letter 또는 marketing 중 하나 이상이 boolean이어야 함)
 *       401:
 *         description: 인증 실패
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
 *               type: object
 *               properties:
 *                 resultType:
 *                   type: string
 *                   example: SUCCESS
 *                 error:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 success:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: 사용자 ID
 *                     nickname:
 *                       type: string
 *                       description: 닉네임
 *                     email:
 *                       type: string
 *                       description: 이메일
 *                     profileImageUrl:
 *                       type: string
 *                       nullable: true
 *                       description: 프로필 이미지 URL
 *                     interests:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                       description: 관심사 목록
 *                     sentLettersCount:
 *                       type: integer
 *                       description: 보낸 편지 수
 *                     receivedLettersCount:
 *                       type: integer
 *                       description: 받은 편지 수
 *                     temperatureAvg:
 *                       type: number
 *                       nullable: true
 *                       description: 평균 온도 점수
 *                     totalUsageMinutes:
 *                       type: integer
 *                       description: 총 사용 시간 (분)
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 유저를 찾을 수 없음
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
 *             required:
 *               - nickname
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
 *               type: object
 *               properties:
 *                 resultType:
 *                   type: string
 *                   example: SUCCESS
 *                 error:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 success:
 *                   type: object
 *                   properties:
 *                     updated:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: 잘못된 요청 (닉네임 형식이 올바르지 않음)
 *       401:
 *         description: 인증 실패
 */

/**
 * @swagger
 * /users/me/profile/image:
 *   post:
 *     summary: 프로필 이미지 업로드
 *     description: 사용자의 프로필 이미지를 업로드합니다. (multipart/form-data, field name: "image")
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
 *               type: object
 *               properties:
 *                 resultType:
 *                   type: string
 *                   example: SUCCESS
 *                 error:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 success:
 *                   type: object
 *                   properties:
 *                     updated:
 *                       type: boolean
 *                       example: true
 *                     profileImageUrl:
 *                       type: string
 *                       description: 업로드된 프로필 이미지 URL
 *       400:
 *         description: 잘못된 요청 (파일이 없거나 지원하지 않는 형식, 파일 크기 초과)
 *       401:
 *         description: 인증 실패
 */
