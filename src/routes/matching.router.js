// src/routes/matching.router.js
import express from "express";
import { isLogin } from "../middlewares/auth.middleware.js";
import { isRestricted } from "../middlewares/restriction.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import {
  handlePostMatchingSession,
  handlePatchMatchingSessionStatusDiscarded,
  handlePatchMatchingSessionStatusFriends,
  handlePostSessionReview,
} from "../controllers/session.controller.js";

import {
  postMatchingSessionSchema,
  postSessionReviewSchema,
  patchMatchingSessionStatusSchema,
} from "../schemas/session.schema.js";

const router = express.Router();

// POST /matching/sessions/:questionId
router.post(
  "/sessions/:questionId",
  isLogin,
  isRestricted,
  validate(postMatchingSessionSchema),
  asyncHandler(handlePostMatchingSession)
);

// PATCH /matching/sessions/:sessionId/friends
router.patch(
  "/sessions/:sessionId/friends",
  isLogin,
  isRestricted,
  validate(patchMatchingSessionStatusSchema),
  asyncHandler(handlePatchMatchingSessionStatusFriends)
);

// PATCH /matching/sessions/:sessionId/discards
router.patch(
  "/sessions/:sessionId/discards",
  isLogin,
  isRestricted,
  validate(patchMatchingSessionStatusSchema),
  asyncHandler(handlePatchMatchingSessionStatusDiscarded)
);

// POST /matching/sessions/:sessionId/reviews
router.post(
  "/sessions/:sessionId/reviews",
  isLogin,
  isRestricted,
  validate(postSessionReviewSchema),
  asyncHandler(handlePostSessionReview)
);

export default router;