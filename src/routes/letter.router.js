// src/routes/letter.router.js
import express from "express";
import { isLogin } from "../middlewares/auth.middleware.js";
import { isRestricted } from "../middlewares/restriction.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import {
  handleGetLetterAssets,
  handleSendMyLetter,
  handleSendOtherLetter,
  handleGetLetterDetail,
  handleRemoveLetterLike,
  handleAddLetterLike,
  handleGetPublicLetterFromOther,
  handleGetPublicLetterFromFriend,
  handleGetLetterByAiKeyword,
} from "../controllers/letter.controller.js";

import { idParamSchema } from "../schemas/common.schema.js";
import {
  letterToMeSchema,
  letterToOtherSchema,
  publicCarouselSchema,
  letterByAiKeywordSchema,
} from "../schemas/letter.schema.js";

const router = express.Router();

/**
 * 1) /letter-assets
 * GET /letter-assets
 */
router.get("/letter-assets", isLogin, isRestricted, asyncHandler(handleGetLetterAssets));

/**
 * 2) /letter/*
 * POST /letter/me
 * POST /letter/other
 */
router.post(
  "/letter/me",
  isLogin,
  isRestricted,
  validate(letterToMeSchema),
  asyncHandler(handleSendMyLetter)
);

router.post(
  "/letter/other",
  isLogin,
  isRestricted,
  validate(letterToOtherSchema),
  asyncHandler(handleSendOtherLetter)
);

/**
 * 3) /letters/*
 * - 구체 경로 먼저!
 */

// GET /letters/keywords/:aiKeyword
router.get(
  "/letters/keywords/:aiKeyword",
  isLogin,
  isRestricted,
  validate(letterByAiKeywordSchema),
  asyncHandler(handleGetLetterByAiKeyword)
);

// GET /letters/others/public
router.get(
  "/letters/others/public",
  isLogin,
  isRestricted,
  validate(publicCarouselSchema),
  asyncHandler(handleGetPublicLetterFromOther)
);

// GET /letters/friends/public
router.get(
  "/letters/friends/public",
  isLogin,
  isRestricted,
  validate(publicCarouselSchema),
  asyncHandler(handleGetPublicLetterFromFriend)
);

// POST /letters/:letterId/like
router.post(
  "/letters/:letterId/like",
  isLogin,
  isRestricted,
  validate(idParamSchema("letterId")),
  asyncHandler(handleAddLetterLike)
);

// DELETE /letters/:letterId/like
router.delete(
  "/letters/:letterId/like",
  isLogin,
  isRestricted,
  validate(idParamSchema("letterId")),
  asyncHandler(handleRemoveLetterLike)
);

// GET /letters/:letterId   (맨 아래)
router.get(
  "/letters/:letterId",
  isLogin,
  isRestricted,
  validate(idParamSchema("letterId")),
  asyncHandler(handleGetLetterDetail)
);

export default router;