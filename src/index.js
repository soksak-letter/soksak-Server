// src/index.js
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import session from "express-session";
import passport from "passport";
import multer from "multer";
import { specs } from "./configs/swagger.config.js";
import { jwtStrategy } from "./Auths/strategies/jwt.strategy.js";
import { googleStrategy } from "./Auths/strategies/google.strategy.js";
import { kakaoStrategy } from "./Auths/strategies/kakao.strategy.js";
import { naverStrategy } from "./Auths/strategies/naver.strategy.js";
import { handleGetLetterAssets } from "./controllers/asset.controller.js";
import { handleSendMyLetter, handleSendOtherLetter, handleGetLetterDetail, handleGetLetterFromFriend, handleRemoveLetterLike, handleAddLetterLike, handleGetPublicLetterFromOther, handleGetPublicLetterFromFriend, handleGetUserLetterStats } from "./controllers/letter.controller.js";
import { handleCheckDuplicatedEmail, handleLogin, handleRefreshToken, handleSignUp, handleSendVerifyEmailCode, handleCheckEmailCode, handleGetAccountInfo, handleResetPassword, handleLogout, handleWithdrawUser } from "./controllers/auth.controller.js";
import { handleGetFriendsList, handlePostFriendsRequest, handleGetIncomingFriendRequests, handleGetOutgoingFriendRequests, handleAcceptFriendRequest, handleRejectFriendRequest, handleDeleteFriend } from "./controllers/friend.controller.js";
import { handlePostMatchingSession, handlePatchMatchingSessionStatusDiscarded, handlePatchMatchingSessionStatusFriends, handlePostSessionReview } from "./controllers/session.controller.js";
import { handleCreateUserAgreements, handlePatchOnboardingStep1 } from "./controllers/user.controller.js";
import {handleGetAllInterests,handleGetMyInterests,handleUpdateMyOnboardingInterests,} from "./controllers/interest.controller.js";
import { handleGetMyNotificationSettings, handleUpdateMyNotificationSettings } from "./controllers/notification.controller.js";
import { bootstrapWeeklyReports } from "./jobs/weeklyReport.bootstrap.js";
import { startWeeklyReportCron } from "./jobs/weeklyReport.cron.js";
import { handleGetWeeklyReport } from "./controllers/weeklyReport.controller.js";
import { handleGetTodayQuestion } from "./controllers/question.controller.js";
import {handleGetCommunityGuidelines,handleGetTerms,handleGetPrivacy,} from "./controllers/policy.controller.js";
import {handleGetNotices,handleGetNoticeDetail,} from "./controllers/notice.controller.js";
import {handleGetMyProfile,handlePatchMyProfile,handlePostMyProfileImage,} from "./controllers/profile.controller.js";
import { handlePutMyDeviceToken } from "./controllers/deviceToken.controller.js";
import { handleGetMyConsents, handlePatchMyConsents } from "./controllers/consent.controller.js";
import { validate } from "./middlewares/validate.middleware.js";
import { emailSchema, loginSchema, passwordSchema, SignUpSchema, verificationConfirmCodeSchema, verificationSendCodeSchema } from "./schemas/auth.schema.js";
import { isLogin } from "./middlewares/auth.middleware.js";
import { letterToMeSchema, letterToOtherSchema } from "./schemas/letter.schema.js";
import { idParamSchema } from "./schemas/common.schema.js";
import { HandleGetHomeDashboard } from "./controllers/dashboard.controller.js";
import {handleGetAnonymousThreads,handleGetAnonymousThreadLetters,handleGetSelfMailbox,} from "./controllers/mailbox.controller.js";




dotenv.config();



const app = express();
const port = process.env.PORT || 3000;

app.use((req, res, next) => {
  console.log("[REQ]", req.method, req.originalUrl);
  next();
});



// 미들웨어 설정
app.use(morgan("dev"));
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.set("trust proxy", 1);


// "http://localhost:5173", "http://localhost:3000", 
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());

// 로그인 전략
passport.use(googleStrategy);
passport.use(kakaoStrategy);
passport.use(naverStrategy);
passport.use(jwtStrategy);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1800000,
      sameSite: "none",
      secure: true,
    },
  })
);

// Swagger 연결
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

// 공통 응답 헬퍼
app.use((req, res, next) => {
  res.success = (success) => {
    return res.json({ resultType: "SUCCESS", error: null, success });
  };
  res.error = ({ errorCode = "unknown", reason = null, data = null }) => {
    return res.json({
      resultType: "FAIL",
      error: { errorCode, reason, data },
      success: null,
    });
  };
  next();
});

await bootstrapWeeklyReports();
startWeeklyReportCron();

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
app.get("/auth/oauth/:provider",
  (req, res, next) => {
    const { provider } = req.params;
    
    const auth = passport.authenticate(provider, {
      session: false
    })

    auth(req, res, next);
  }
);

app.get("/auth/callback/:provider",
  (req, res, next) => {
    const { provider } = req.params;
    
    const auth = passport.authenticate(provider, {
      session: false,
      // failureRedirect: "/login-failed" // 추후 구현
    });
    
    auth(req, res, next);
  }, 

  (req, res) => {
    const {id, jwtAccessToken, jwtRefreshToken} = req.user;
    const { provider } = req.params;

    res.status(200).json({
      resultType: "SUCCESS",
      error: null,
      success: {
          message: `${provider} 로그인 성공!`,
          id: id,
          tokens: { jwtAccessToken, jwtRefreshToken }
      }
    });
  }
)

app.get("/mypage", isLogin, (req, res) => {
  res.status(200).success({
    message: `인증 성공! ${req.user.name}님의 마이페이지입니다.`,
    user: req.user,
  });
});

app.get("/friends", isLogin, asyncHandler(handleGetFriendsList)); //친구 목록 불러오기
app.post("/friends/requests", isLogin, asyncHandler(handlePostFriendsRequest)); //친구 신청
app.get("/friends/requests/incoming", isLogin, asyncHandler(handleGetIncomingFriendRequests)); //들어온 친구 신청 불러오기
app.get("/friends/requests/outgoing", isLogin, asyncHandler(handleGetOutgoingFriendRequests)); //보낸 친구 신청 불러오기
app.post("/friends/requests/accept", isLogin, asyncHandler(handleAcceptFriendRequest)); //들어온 친구 신청 수락
app.post("/friends/requests/reject", isLogin, asyncHandler(handleRejectFriendRequest)); //들어온 친구 신청 거절
app.delete("/friends/requests/:targetUserId", isLogin, asyncHandler(handleDeleteFriend)); //보낸 친구 신청 삭제

app.post("/matching/sessions/:questionId", isLogin, asyncHandler(handlePostMatchingSession)); //세션 생성
app.patch("/matching/sessions/:sessionId/friends", isLogin, asyncHandler(handlePatchMatchingSessionStatusFriends)); //세션 친구됨으로 변경
app.patch("/matching/sessions/:sessionId/discards", isLogin, asyncHandler(handlePatchMatchingSessionStatusDiscarded)); //세션 삭제됨으로 변경
app.post("/matching/sessions/:sessionId/reviews", isLogin, asyncHandler(handlePostSessionReview)); //세션 리뷰 작성

app.get("/reports/weekly/:year/:week", isLogin, asyncHandler(handleGetWeeklyReport));

app.post("/auth/signup", validate(SignUpSchema), handleSignUp);                     // 회원가입
app.post("/auth/login", validate(loginSchema), handleLogin);                        // 로그인
app.post("/auth/email/exists", validate(emailSchema), handleCheckDuplicatedEmail);  // 이메일 중복 확인
app.get("/auth/refresh", handleRefreshToken);                                       // 액세스 토큰 재발급
app.post("/auth/:type/verification-codes", validate(verificationSendCodeSchema), handleSendVerifyEmailCode);       // 이메일 인증번호 전송
app.post("/auth/:type/verification-codes/confirm", validate(verificationConfirmCodeSchema), handleCheckEmailCode); // 이메일 인증번호 확인
app.get("/auth/find-id", validate(emailSchema), handleGetAccountInfo);                        // 아이디 찾기
app.patch("/auth/reset-password", isLogin, validate(passwordSchema), handleResetPassword);    // 비밀번호 찾기
app.post("/auth/logout", isLogin, handleLogout);                            // 로그아웃
app.delete("/users", isLogin, handleWithdrawUser);                          // 탈퇴
app.post("/users/me/agreements", isLogin, handleCreateUserAgreements)    // 이용약관 동의

app.get("/letter-assets", isLogin, handleGetLetterAssets);        // 편지 꾸미기 리소스 목록 조회
app.post("/letter/me", isLogin, validate(letterToMeSchema), handleSendMyLetter);                      // 나에게 편지 전송
app.post("/letter/other", isLogin, validate(letterToOtherSchema),handleSendOtherLetter);              // 타인/친구에게 편지 전송
app.get("/letters/:letterId", isLogin, validate(idParamSchema("letterId")),handleGetLetterDetail);    // 편지 상세 조회
app.get("/friends/:friendId/conversations", isLogin, validate(idParamSchema("friendId")), handleGetLetterFromFriend);  // 친구 대화 목록 화면 조회
app.post("/letters/:letterId/like", isLogin, validate(idParamSchema("letterId")), handleAddLetterLike);                // 편지 좋아요 추가
app.delete("/letters/:letterId/like", isLogin, validate(idParamSchema("letterId")), handleRemoveLetterLike);           // 편지 좋아요 삭제

app.get("/questions/today", handleGetTodayQuestion);       // 오늘의 질문 조회
app.get("/letters/others/public", isLogin, handleGetPublicLetterFromOther);       // 공개 편지 캐러셀 목록 조회
app.get("/letters/friends/public", isLogin, handleGetPublicLetterFromFriend);     // 친구 편지 캐러셀 목록 조회
app.get("/users/me/letters/stats", isLogin, handleGetUserLetterStats)  // 편지 여행 카드 데이터 조회

app.get("/home/summary", isLogin, HandleGetHomeDashboard);  // 홈 대시보드 조회

// 온보딩 설정
app.patch("/users/me/onboarding", isLogin, handlePatchOnboardingStep1); 
app.put("/users/me/onboarding/interests", isLogin, handleUpdateMyOnboardingInterests);

// 관심사
app.get("/interests/all", handleGetAllInterests); // 전체 목록 (로그인 불필요)
app.get("/interests", isLogin, handleGetMyInterests); // 내 선택 목록 (로그인 필요)

// 알람 설정
app.patch("/users/me/notification-settings", isLogin, handleUpdateMyNotificationSettings);
app.get("/users/me/notification-settings", isLogin, handleGetMyNotificationSettings);

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);

  const status = err.status || err.statusCode || 500;

  return res.status(status).json({
    resultType: "FAIL",
    error: {
      errorCode: err.errorCode || "COMMON_001",
      reason: err.reason || err.message || "Internal Server Error",
      data: err.data || null,
    },
    success: null,
  });
});

// 정책, 공지사항
app.get("/policies/community-guidelines", handleGetCommunityGuidelines);
app.get("/policies/terms", handleGetTerms);
app.get("/policies/privacy", handleGetPrivacy);

app.get("/notices", handleGetNotices);
app.get("/notices/:noticeId", handleGetNoticeDetail);

// 동의 설정
app.get("/users/me/consents", isLogin, handleGetMyConsents);
app.patch("/users/me/consents", isLogin, handlePatchMyConsents);

// 디바이스 토큰
app.put("/users/me/device-tokens", isLogin, handlePutMyDeviceToken);

// / 편지함
app.get("/mailbox/anonymous", isLogin, handleGetAnonymousThreads);
app.get("/mailbox/anonymous/threads/:threadId/letters", isLogin, handleGetAnonymousThreadLetters);
app.get("/mailbox/self", isLogin, handleGetSelfMailbox);




// 프로필
app.get("/users/me/profile", isLogin, handleGetMyProfile);
app.patch("/users/me/profile", isLogin, handlePatchMyProfile);

// multipart/form-data, field name = "image"
app.post("/users/me/profile/image", isLogin, upload.single("image"), handlePostMyProfileImage);


// 서버 실행
app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
});