// src/index.js
import cors from "cors";
import "dotenv/config";
import express from "express";
import swaggerUi from "swagger-ui-express";
import session from "express-session";
import passport from "passport";

import httpLogger from "./middlewares/logger.middleware.js";
import { specs } from "./configs/swagger.config.js";
import { jwtStrategy } from "./Auths/strategies/jwt.strategy.js";
import { configurePush } from "./configs/push.config.js";
import logger from "./configs/logger.config.js";
import { startBatch } from "./jobs/index.job.js";

import { registerRoutes } from "./routes/index.js";

const app = express();
const port = process.env.PORT || 3000;
const allowed_origins = process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:3000"];

configurePush();

app.use((req, res, next) => {
  console.log("[REQ]", req.method, req.originalUrl);
  next();
});

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

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, maxAge: 1800000, sameSite: "none", secure: true },
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
    return res.json({ resultType: "FAIL", error: { errorCode, reason, data }, success: null });
  };
  next();
});

// ✅ 라우터 등록 (여기서 도메인별로 분리된 Router들이 붙음)
registerRoutes(app);

// 에러 핸들러
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