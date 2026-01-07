// src/index.js
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import session from "express-session";
import passport from "passport";
import { specs } from "./configs/swagger.config.js";
import { jwtStrategy } from "./Auths/strategies/jwt.strategy.js";
import { googleStrategy } from "./Auths/strategies/google.strategy.js";
import { kakaoStrategy } from "./Auths/strategies/kakao.strategy.js";
import { naverStrategy } from "./Auths/strategies/naver.strategy.js";
import { handleCheckDuplicatedEmail, handleLogin, handleRefreshToken, handleSignUp, handleSendVerifyEmailCode, handleCheckEmailCode, handleGetAccountInfo, handleResetPassword } from "./controllers/auth.controller.js";
import { validateAuthParameterType, validateEmail, validatePassword } from "./validators/auth.validation.js";
import { handleGetLetterAssets } from "./controllers/asset.controller.js";
import { handleSendMyLetter, handleSendOtherLetter } from "./controllers/letter.controller.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

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

// 로그인 확인 미들웨어
export const isLogin = passport.authenticate('jwt', { session: false });

// 비동기 에러 래퍼
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

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

app.post("/auth/signup", validateEmail, validatePassword, handleSignUp);    // 회원가입
app.post("/auth/login", validatePassword, handleLogin);                     // 로그인
app.post("/auth/email/exists", validateEmail, handleCheckDuplicatedEmail);  // 이메일 중복 확인
app.get("/auth/refresh", handleRefreshToken);                               // 액세스 토큰 재발급
app.post("/auth/:type/verification-codes", validateAuthParameterType, validateEmail, handleSendVerifyEmailCode);    // 이메일 인증번호 전송
app.post("/auth/:type/verification-codes/confirm", validateAuthParameterType, validateEmail, handleCheckEmailCode); // 이메일 인증번호 확인
app.get("/auth/find-id", validateEmail, handleGetAccountInfo);                                                      // 아이디 찾기
app.patch("/auth/reset-password", isLogin, validatePassword, handleResetPassword);                                  // 비밀번호 찾기

app.get("/letter-assets", isLogin, handleGetLetterAssets);                  // 편지 꾸미기 리소스 목록 조회
app.get("/letter/me", isLogin, handleSendMyLetter);                         // 나에게 편지 전송
app.get("/letter/other", isLogin, handleSendOtherLetter);                   // 타인/친구에게 편지 전송

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

// 서버 실행
app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
});