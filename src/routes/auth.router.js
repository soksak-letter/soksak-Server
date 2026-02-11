// src/routes/auth.router.js
import express from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { isLogin } from "../middlewares/auth.middleware.js";

import {
  handleCheckDuplicatedEmail,
  handleLogin,
  handleRefreshToken,
  handleSignUp,
  handleSendVerifyEmailCode,
  handleCheckEmailCode,
  handleGetAccountInfo,
  handleResetPassword,
  handleLogout,
  handleCheckDuplicatedUsername,
  handleSocialLogin,
  handleSocialLoginCertification,
  handleSocialLoginCallback,
  handleChangePassword,
} from "../controllers/auth.controller.js";

import {
  changePasswordSchema,
  emailSchema,
  loginSchema,
  resetPasswordSchema,
  SignUpSchema,
  usernameSchema,
  verificationConfirmCodeSchema,
  verificationSendCodeSchema,
} from "../schemas/auth.schema.js";

const router = express.Router();

router.post("/signup", validate(SignUpSchema), handleSignUp);
router.post("/login", validate(loginSchema), handleLogin);

router.get("/oauth/:provider", handleSocialLogin);
router.post("/login/:provider", handleSocialLoginCertification, handleSocialLoginCallback);

router.post("/username/exists", validate(usernameSchema), handleCheckDuplicatedUsername);
router.post("/email/exists", validate(emailSchema), handleCheckDuplicatedEmail);

router.get("/refresh", handleRefreshToken);

router.post("/:type/verification-codes", validate(verificationSendCodeSchema), handleSendVerifyEmailCode);
router.post("/:type/verification-codes/confirm", validate(verificationConfirmCodeSchema), handleCheckEmailCode);

router.post("/find-id", validate(emailSchema), handleGetAccountInfo);

router.patch("/reset-password", isLogin, validate(resetPasswordSchema), handleResetPassword);
router.patch("/change-password", isLogin, validate(changePasswordSchema), handleChangePassword);

router.post("/logout", isLogin, handleLogout);

export default router;