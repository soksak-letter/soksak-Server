// src/index.js
import cors from "cors";
import "dotenv/config";
import express from "express";
import swaggerUi from "swagger-ui-express";
import session from "express-session";
import passport from "passport";
import multer from "multer";
import httpLogger from "./middlewares/logger.middleware.js";
import { specs } from "./configs/swagger.config.js";
import { jwtStrategy } from "./Auths/strategies/jwt.strategy.js";
import { handleGetFriendsList, handlePostFriendsRequest, handleGetIncomingFriendRequests, handleGetOutgoingFriendRequests, handleAcceptFriendRequest, handleRejectFriendRequest, handleDeleteFriendRequest } from "./controllers/friend.controller.js";
import { handleSendMyLetter, handleSendOtherLetter, handleGetLetterDetail, handleRemoveLetterLike, handleAddLetterLike, handleGetPublicLetterFromOther, handleGetPublicLetterFromFriend, handleGetUserLetterStats, handleGetLetterAssets, handleGetLetterByAiKeyword } from "./controllers/letter.controller.js";
import { handleCheckDuplicatedEmail, handleLogin, handleRefreshToken, handleSignUp, handleSendVerifyEmailCode, handleCheckEmailCode, handleGetAccountInfo, handleResetPassword, handleLogout, handleWithdrawUser, handleCheckDuplicatedUsername, handleSocialLogin, handleSocialLoginCertification, handleSocialLoginCallback, handleChangePassword } from "./controllers/auth.controller.js";
import { handlePostMatchingSession, handlePatchMatchingSessionStatusDiscarded, handlePatchMatchingSessionStatusFriends, handlePostSessionReview } from "./controllers/session.controller.js";
import { handleCreateUserAgreements, handlePatchOnboardingStep1, handleGetAllInterests, handleGetMyInterests, handleUpdateMyOnboardingInterests, handleGetMyNotificationSettings, handleUpdateMyNotificationSettings, handleGetMyProfile, handlePatchMyProfile, handlePostMyProfileImage, handlePutMyPushSubscription, handleGetMyConsents, handlePatchMyConsents, handleUpdateActivity, } from "./controllers/user.controller.js";
import { handleGetAnonymousThreads, handleGetAnonymousThreadLetters, handleGetSelfMailbox, handleGetLetterFromFriend, } from "./controllers/mailbox.controller.js";
import { handleGetNotices, handleGetNoticeDetail, } from "./controllers/notice.controller.js";
import { handleGetCommunityGuidelines, handleGetTerms, handleGetPrivacy, } from "./controllers/policy.controller.js";
import { handleGetWeeklyReport } from "./controllers/weeklyReport.controller.js";
import { handleGetTodayQuestion } from "./controllers/question.controller.js";
import { validate } from "./middlewares/validate.middleware.js";
import { changePasswordSchema, emailSchema, loginSchema, resetPasswordSchema, SignUpSchema, usernameSchema, verificationConfirmCodeSchema, verificationSendCodeSchema } from "./schemas/auth.schema.js";
import { handleInsertInquiryAsUser, handleInsertInquiryAsAdmin, handleGetInquiry, handleGetInquiryDetail } from "./controllers/inquiry.controller.js";
import { isLogin } from "./middlewares/auth.middleware.js";
import { isRestricted } from "./middlewares/restriction.middleware.js";
import { letterByAiKeywordSchema, letterToMeSchema, letterToOtherSchema, publicCarouselSchema } from "./schemas/letter.schema.js";
import { idParamSchema, ISOTimeSchema } from "./schemas/common.schema.js";
import { pushSubscriptionSchema, onboardingStep1Schema, updateInterestsSchema, updateProfileSchema, updateNotificationSettingsSchema, updateConsentsSchema, updateActivitySchema, createUserAgreementsSchema } from "./schemas/user.schema.js";
import { sessionIdParamSchema } from "./schemas/mailbox.schema.js";
import { noticeIdParamSchema } from "./schemas/notice.schema.js";
import { HandleGetHomeDashboard } from "./controllers/dashboard.controller.js";
import { handleInsertUserReport, handleGetUserReports, handleGetUserReport } from "./controllers/report.controller.js";
import { startBatch } from "./jobs/index.job.js";
import { insertUserReportSchema, getUserReportSchema } from "./schemas/report.schema.js";
import { postTargetUserIdAndSIdSchema, requesterUserIdSchema, targetUserIdSchema } from "./schemas/friend.schema.js";
import { getInquiryDetailSchema, insertInquiryAsAdminSchema, insertInquiryAsUserSchema } from "./schemas/inquiry.schema.js";
import { postMatchingSessionSchema, postSessionReviewSchema, patchMatchingSessionStatusSchema} from "./schemas/session.schema.js";
import { postBlockUserSchema } from "./schemas/block.schema.js";
import { handleGetBlock, handlePostBlock } from "./controllers/block.controller.js";
import { handleGetRestrict } from "./controllers/restrict.controller.js";
import { configurePush } from "./configs/push.config.js";
import logger from "./configs/logger.config.js";

const app = express();
const port = process.env.PORT || 3000;
const allowed_origins = process.env.ALLOWED_ORIGINS?.split(',') || ["http://localhost:3000"];

configurePush();

app.use((req, res, next) => {
  console.log("[REQ]", req.method, req.originalUrl);
  next();
});

// app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));

app.use(
  cors({
    origin: allowed_origins,
    credentials: true,
  })
);

app.set("trust proxy", 1);

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());

// 미들웨어 설정
app.use(httpLogger);

// 로그인 전략
passport.use(jwtStrategy);

app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false, cookie: { httpOnly: true, maxAge: 1800000, sameSite: "none", secure: true } }));

// Swagger 연결
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

// 공통 응답 헬퍼
app.use((req, res, next) => {
  res.success = (success) => {
    return res.json({ resultType: "SUCCESS", error: null, success });
  };
  res.error = ({ errorCode = "unknown", reason = null, data = null }) => {
    return res.json({ resultType: "FAIL", error: { errorCode, reason, data }, success: null });
  };
  next();
});

// 비동기 에러 래퍼
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// 프로필 이미지 업로드
const upload = multer({ storage: multer.memoryStorage() });

// 테스트 라우트
app.get("/", (req, res) => {
  res.send("Hello World! Server is running.");
});


// 로그인/회원가입

app.get("/mypage", isLogin, (req, res) => {
  res.status(200).success({
    message: `인증 성공! ${req.user.name}님의 마이페이지입니다.`,
    user: req.user,
  });
});

app.get("/friends", isLogin, isRestricted, asyncHandler(handleGetFriendsList)); //친구 목록 불러오기

app.post("/friends/requests", isLogin, isRestricted, validate(postTargetUserIdAndSIdSchema), asyncHandler(handlePostFriendsRequest)); //친구 신청
app.get("/friends/requests/incoming", isLogin, isRestricted, asyncHandler(handleGetIncomingFriendRequests)); //들어온 친구 신청 불러오기
app.get("/friends/requests/outgoing", isLogin, isRestricted, asyncHandler(handleGetOutgoingFriendRequests)); //보낸 친구 신청 불러오기
app.post("/friends/requests/accept/:requesterUserId", isLogin, isRestricted, validate(requesterUserIdSchema), asyncHandler(handleAcceptFriendRequest)); //들어온 친구 신청 수락
app.post("/friends/requests/reject/:targetUserId", isLogin, isRestricted, validate(targetUserIdSchema), asyncHandler(handleRejectFriendRequest)); //들어온 친구 신청 거절
app.delete("/friends/requests/:targetUserId", isLogin, isRestricted, validate(targetUserIdSchema), asyncHandler(handleDeleteFriendRequest)); //보낸 친구 신청 삭제


app.post("/matching/sessions/:questionId", isLogin, isRestricted, validate(postMatchingSessionSchema), asyncHandler(handlePostMatchingSession)); //세션 생성
app.patch("/matching/sessions/:sessionId/friends", isLogin, isRestricted, validate(patchMatchingSessionStatusSchema), asyncHandler(handlePatchMatchingSessionStatusFriends)); //세션 친구됨으로 변경
app.patch("/matching/sessions/:sessionId/discards", isLogin, isRestricted, validate(patchMatchingSessionStatusSchema), asyncHandler(handlePatchMatchingSessionStatusDiscarded)); //세션 삭제됨으로 변경
app.post("/matching/sessions/:sessionId/reviews", isLogin, isRestricted, validate(postSessionReviewSchema), asyncHandler(handlePostSessionReview)); //세션 리뷰 작성


app.post("/block/:targetUserId", isLogin, isRestricted, validate(postBlockUserSchema), asyncHandler(handlePostBlock));
app.get("/block", isLogin, isRestricted, asyncHandler(handleGetBlock));

app.get("/restrict", isLogin, asyncHandler(handleGetRestrict));

app.post("/reports", isLogin, isRestricted, validate(insertUserReportSchema), asyncHandler(handleInsertUserReport));

app.get("/reports", isLogin, isRestricted, asyncHandler(handleGetUserReports));
app.get("/reports/:reportId", isLogin, isRestricted, validate(getUserReportSchema), asyncHandler(handleGetUserReport));


app.get("/weekly/reports", isLogin, isRestricted, asyncHandler(handleGetWeeklyReport));


app.post("/inquiries", isLogin, validate(insertInquiryAsUserSchema), asyncHandler(handleInsertInquiryAsUser));
app.post("/inquiries/admin", isLogin, validate(insertInquiryAsAdminSchema), asyncHandler(handleInsertInquiryAsAdmin));
app.get("/inquiries", isLogin, asyncHandler(handleGetInquiry));
app.get("/inquiries/:inquiryId", isLogin, validate(getInquiryDetailSchema), asyncHandler(handleGetInquiryDetail));

app.post("/auth/signup", validate(SignUpSchema), handleSignUp);                     // 회원가입
app.post("/auth/login", validate(loginSchema), handleLogin);                        // 로그인
app.get("/auth/oauth/:provider", handleSocialLogin);                                // 소셜 로그인
app.post("/auth/login/:provider", handleSocialLoginCertification, handleSocialLoginCallback); // 소셜 로그인 응답
app.post("/auth/username/exists", validate(usernameSchema), handleCheckDuplicatedUsername);     // 아이디 중복 확인
app.post("/auth/email/exists", validate(emailSchema), handleCheckDuplicatedEmail);  // 이메일 중복 확인
app.get("/auth/refresh", handleRefreshToken);                                       // 액세스 토큰 재발급
app.post("/auth/:type/verification-codes", validate(verificationSendCodeSchema), handleSendVerifyEmailCode);       // 이메일 인증번호 전송
app.post("/auth/:type/verification-codes/confirm", validate(verificationConfirmCodeSchema), handleCheckEmailCode); // 이메일 인증번호 확인
app.post("/auth/find-id", validate(emailSchema), handleGetAccountInfo);                        // 아이디 찾기
app.patch("/auth/reset-password", isLogin, validate(resetPasswordSchema), handleResetPassword);    // 비밀번호 초기화
app.patch("/auth/change-password", isLogin, validate(changePasswordSchema), handleChangePassword); // 비밀번호 변경
app.post("/auth/logout", isLogin, handleLogout);                            // 로그아웃
app.delete("/users", isLogin, handleWithdrawUser);                          // 탈퇴
app.post("/users/me/agreements", isLogin, validate(createUserAgreementsSchema), handleCreateUserAgreements)    // 이용약관 동의


app.get("/letter-assets", isLogin, isRestricted, handleGetLetterAssets);        // 편지 꾸미기 리소스 목록 조회
app.post("/letter/me", isLogin, isRestricted, validate(letterToMeSchema), handleSendMyLetter);                      // 나에게 편지 전송
app.post("/letter/other", isLogin, isRestricted, validate(letterToOtherSchema),handleSendOtherLetter);              // 타인/친구에게 편지 전송
app.get("/letters/:letterId", isLogin, isRestricted, validate(idParamSchema("letterId")),handleGetLetterDetail);    // 편지 상세 조회
app.get("/letters/keywords/:aiKeyword", isLogin, isRestricted, validate(letterByAiKeywordSchema), asyncHandler(handleGetLetterByAiKeyword));    // AI 키워드로 편지 조회
app.post("/letters/:letterId/like", isLogin, isRestricted, validate(idParamSchema("letterId")), handleAddLetterLike);                // 편지 좋아요 추가
app.delete("/letters/:letterId/like", isLogin, isRestricted, validate(idParamSchema("letterId")), handleRemoveLetterLike);           // 편지 좋아요 삭제

app.get("/questions/today", validate(ISOTimeSchema), handleGetTodayQuestion);       // 오늘의 질문 조회
app.get("/letters/others/public", isLogin, isRestricted, validate(publicCarouselSchema), handleGetPublicLetterFromOther);       // 공개 편지 캐러셀 목록 조회
app.get("/letters/friends/public", isLogin, isRestricted, validate(publicCarouselSchema), handleGetPublicLetterFromFriend);     // 친구 편지 캐러셀 목록 조회
app.get("/users/me/letters/stats", isLogin, isRestricted, validate(ISOTimeSchema), handleGetUserLetterStats)  // 편지 여행 카드 데이터 조회

app.get("/home/summary", isLogin, isRestricted, validate(ISOTimeSchema), HandleGetHomeDashboard);  // 홈 대시보드 조회

// 온보딩 설정
app.patch("/users/me/onboarding", isLogin, validate(onboardingStep1Schema), handlePatchOnboardingStep1);
app.put("/users/me/onboarding/interests", isLogin, validate(updateInterestsSchema), handleUpdateMyOnboardingInterests);

// 관심사
app.get("/interests/all", handleGetAllInterests); // 전체 목록 (로그인 불필요)
app.get("/interests", isLogin, handleGetMyInterests); // 내 선택 목록 (로그인 필요)

// 알람 설정
app.patch("/users/me/notification-settings", isLogin, validate(updateNotificationSettingsSchema), handleUpdateMyNotificationSettings);
app.get("/users/me/notification-settings", isLogin, handleGetMyNotificationSettings);

// 정책, 공지사항
app.get("/policies/community-guidelines", handleGetCommunityGuidelines);
app.get("/policies/terms", handleGetTerms);
app.get("/policies/privacy", handleGetPrivacy);

app.get("/notices", handleGetNotices);
app.get("/notices/:noticeId", validate(noticeIdParamSchema), handleGetNoticeDetail);

// 동의 설정
app.get("/users/me/consents", isLogin, handleGetMyConsents);
app.patch("/users/me/consents", isLogin, validate(updateConsentsSchema), handlePatchMyConsents);

// 구독객체
app.put("/users/me/push-subscriptions", isLogin, validate(pushSubscriptionSchema), handlePutMyPushSubscription);

// / 편지함
app.get("/mailbox/anonymous", isLogin, handleGetAnonymousThreads);
app.get("/mailbox/anonymous/threads/:sessionId/letters", isLogin, validate(sessionIdParamSchema), handleGetAnonymousThreadLetters);
app.get("/mailbox/friends/threads/:friendId/letters", isLogin, validate(idParamSchema("friendId")), handleGetLetterFromFriend); // 친구 대화 목록 화면 조회
app.get("/mailbox/self", isLogin, handleGetSelfMailbox);

// 프로필
app.get("/users/me/profile", isLogin, handleGetMyProfile);
app.patch("/users/me/profile", isLogin, validate(updateProfileSchema), handlePatchMyProfile);
app.post("/users/me/profile/image", isLogin, upload.single("image"), handlePostMyProfileImage);

// 활동 시간 추적
app.post("/users/me/activity", isLogin, validate(updateActivitySchema), handleUpdateActivity);

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);

  const status = err.status || err.statusCode || 500;
  res.locals.errorMessage = err.reason || err.message || "Internal Server Error";

  if (status >= 500) logger.error(`[Server Error]\n${err.stack}`);

  return res.status(status).json({ resultType: "FAIL", error: { errorCode: err.errorCode || "COMMON_001", reason: err.reason || err.message || "Internal Server Error", data: err.data || null }, success: null });
});

// 서버 실행
app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  startBatch();
});