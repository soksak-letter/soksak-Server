// src/index.js
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import session from "express-session";
import { specs } from "../swagger.config.js";

const app = express();
app.set("trust proxy", 1);
const port = process.env.PORT || 3000;

// 미들웨어 설정
app.use(morgan("dev"));
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
// "http://localhost:5173", "http://localhost:3000", 
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

// 공통 응답 헬퍼 (한 번만!)
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

// 로그인 확인 미들웨어, 추후 토큰 기반 인증으로 변경 예정
export const isLogin = (req, res, next) => {
  const user = req.session?.user;

  if (user) {
    // 이후 로직에서 일관되게 쓰라고 박아줌
    req.user = user;
    req.userName = user.name;
    return next();
  }

  // ✅ 여기서 throw 하지 말고 401로 명확히 응답 (네 공통응답 포맷에 맞춤)
  return res.status(401).json({
    resultType: "FAIL",
    error: {
      errorCode: "AUTH_401",
      reason: "로그인이 필요합니다.",
      data: null,
    },
    success: null,
  });
};


// 비동기 에러 래퍼
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// 테스트 라우트
app.get("/", (req, res) => {
  res.send("Hello World! Server is running.");
});


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
app.listen(process.env.PORT || 3000, async () => {
  console.log(
    `현재 토큰: ${process.env.GROQ_API_KEY ? "로드 성공" : "로드 실패"}`
  );
  await hugRepository.warmupModel();
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});