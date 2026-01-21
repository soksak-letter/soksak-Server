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
 * /mailbox/anonymous:
 *   get:
 *     summary: 익명 탭 목록 조회
 *     description: 익명으로 받은 편지의 스레드 목록을 조회합니다. senderUserId별 최신 편지 1개씩 반환됩니다.
 *     tags: [편지함]
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
 *                           threadId:
 *                             type: integer
 *                             description: 스레드 ID (senderUserId)
 *                           sender:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                               nickname:
 *                                 type: string
 *                                 nullable: true
 *                           lastLetterId:
 *                             type: integer
 *                           lastLetterTitle:
 *                             type: string
 *                           lastLetterPreview:
 *                             type: string
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             nullable: true
 *                           paperId:
 *                             type: integer
 *                             nullable: true
 *                             description: 편지통 색상
 *       401:
 *         description: 인증 실패
 */

/**
 * @swagger
 * /mailbox/anonymous/threads/{threadId}/letters:
 *   get:
 *     summary: 익명 스레드 편지 목록 조회
 *     description: 특정 익명 스레드의 편지 목록을 조회합니다.
 *     tags: [편지함]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: threadId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 스레드 ID (senderUserId)
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
 *                           title:
 *                             type: string
 *                           content:
 *                             type: string
 *                           deliveredAt:
 *                             type: string
 *                             format: date-time
 *                             nullable: true
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             nullable: true
 *                           design:
 *                             type: object
 *                             properties:
 *                               paperId:
 *                                 type: integer
 *                                 nullable: true
 *                               stampId:
 *                                 type: integer
 *                                 nullable: true
 *                               fontId:
 *                                 type: integer
 *                                 nullable: true
 *       400:
 *         description: 잘못된 threadId
 *       401:
 *         description: 인증 실패
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
 *                           title:
 *                             type: string
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             nullable: true
 *                           paperId:
 *                             type: integer
 *                             nullable: true
 *                             description: 편지통 색상
 *       401:
 *         description: 인증 실패
 */

/**
 * @swagger
 * /notices:
 *   get:
 *     summary: 공지사항 목록
 *     description: 활성화된 공지사항 목록을 조회합니다.
 *     tags: [공지/정책]
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
 *                           title:
 *                             type: string
 *                           content:
 *                             type: string
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 */

/**
 * @swagger
 * /notices/{noticeId}:
 *   get:
 *     summary: 공지사항 상세 조회
 *     description: 특정 공지사항의 상세 내용을 조회합니다.
 *     tags: [공지/정책]
 *     parameters:
 *       - in: path
 *         name: noticeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 공지사항 ID
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
 *                     title:
 *                       type: string
 *                     content:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: 잘못된 noticeId
 *       404:
 *         description: 공지사항을 찾을 수 없음
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
 * /policies/community-guidelines:
 *   get:
 *     summary: 커뮤니티 가이드라인 조회
 *     description: 커뮤니티 가이드라인 문서를 조회합니다.
 *     tags: [공지/정책]
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
 *                     title:
 *                       type: string
 *                       example: 커뮤니티 가이드라인
 *                     content:
 *                       type: string
 *                       description: 가이드라인 내용
 *       404:
 *         description: 문서를 찾을 수 없음
 */

/**
 * @swagger
 * /policies/terms:
 *   get:
 *     summary: 서비스 이용약관 조회
 *     description: 서비스 이용약관 문서를 조회합니다.
 *     tags: [공지/정책]
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
 *                     title:
 *                       type: string
 *                       example: 서비스 이용약관
 *                     content:
 *                       type: string
 *                       description: 이용약관 내용
 *       404:
 *         description: 문서를 찾을 수 없음
 */

/**
 * @swagger
 * /policies/privacy:
 *   get:
 *     summary: 개인정보 처리방침 조회
 *     description: 개인정보 처리방침 문서를 조회합니다.
 *     tags: [공지/정책]
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
 *                     title:
 *                       type: string
 *                       example: 개인정보 처리방침
 *                     content:
 *                       type: string
 *                       description: 개인정보 처리방침 내용
 *       404:
 *         description: 문서를 찾을 수 없음
 */
