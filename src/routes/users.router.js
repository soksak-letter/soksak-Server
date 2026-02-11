// src/routes/users.router.js
import express from "express";
import multer from "multer";

import { isLogin } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { isRestricted } from "../middlewares/restriction.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import {
  handleCreateUserAgreements,
  handlePatchOnboardingStep1,
  handleUpdateMyOnboardingInterests,
  handleGetMyNotificationSettings,
  handleUpdateMyNotificationSettings,
  handleGetMyProfile,
  handlePatchMyProfile,
  handlePostMyProfileImage,
  handlePutMyPushSubscription,
  handleGetMyConsents,
  handlePatchMyConsents,
  handleUpdateActivity,
} from "../controllers/user.controller.js";

import { handleWithdrawUser } from "../controllers/auth.controller.js";
import { handleGetUserLetterStats } from "../controllers/letter.controller.js";

import {
  pushSubscriptionSchema,
  onboardingStep1Schema,
  updateInterestsSchema,
  updateProfileSchema,
  updateNotificationSettingsSchema,
  updateConsentsSchema,
  updateActivitySchema,
  createUserAgreementsSchema,
} from "../schemas/user.schema.js";

import { ISOTimeSchema } from "../schemas/common.schema.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// DELETE /users
router.delete("/", isLogin, asyncHandler(handleWithdrawUser));

// POST /users/me/agreements
router.post("/me/agreements", isLogin, validate(createUserAgreementsSchema), asyncHandler(handleCreateUserAgreements));

// 온보딩
router.patch("/me/onboarding", isLogin, validate(onboardingStep1Schema), asyncHandler(handlePatchOnboardingStep1));
router.put("/me/onboarding/interests", isLogin, validate(updateInterestsSchema), asyncHandler(handleUpdateMyOnboardingInterests));

// 알람 설정
router.patch(
  "/me/notification-settings",
  isLogin,
  validate(updateNotificationSettingsSchema),
  asyncHandler(handleUpdateMyNotificationSettings)
);
router.get("/me/notification-settings", isLogin, asyncHandler(handleGetMyNotificationSettings));

// 동의
router.get("/me/consents", isLogin, asyncHandler(handleGetMyConsents));
router.patch("/me/consents", isLogin, validate(updateConsentsSchema), asyncHandler(handlePatchMyConsents));

// 푸시 구독
router.put("/me/push-subscriptions", isLogin, validate(pushSubscriptionSchema), asyncHandler(handlePutMyPushSubscription));

// 프로필
router.get("/me/profile", isLogin, asyncHandler(handleGetMyProfile));
router.patch("/me/profile", isLogin, validate(updateProfileSchema), asyncHandler(handlePatchMyProfile));
router.post("/me/profile/image", isLogin, upload.single("image"), asyncHandler(handlePostMyProfileImage));

// 활동 시간 추적
router.post("/me/activity", isLogin, validate(updateActivitySchema), asyncHandler(handleUpdateActivity));

// 편지 여행 카드 데이터 조회 (기존 그대로 유지)
router.get(
  "/me/letters/stats",
  isLogin,
  isRestricted,
  validate(ISOTimeSchema),
  asyncHandler(handleGetUserLetterStats)
);

export default router;