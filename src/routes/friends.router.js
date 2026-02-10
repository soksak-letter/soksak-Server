// src/routes/friends.router.js
import express from "express";
import { isLogin } from "../middlewares/auth.middleware.js";
import { isRestricted } from "../middlewares/restriction.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import {
  handleGetFriendsList,
  handlePostFriendsRequest,
  handleGetIncomingFriendRequests,
  handleGetOutgoingFriendRequests,
  handleAcceptFriendRequest,
  handleRejectFriendRequest,
  handleDeleteFriendRequest,
} from "../controllers/friend.controller.js";

import {
  postTargetUserIdAndSIdSchema,
  requesterUserIdSchema,
  targetUserIdSchema,
} from "../schemas/friend.schema.js";

const router = express.Router();

// GET /friends
router.get("/", isLogin, isRestricted, asyncHandler(handleGetFriendsList));

// POST /friends/requests
router.post(
  "/requests",
  isLogin,
  isRestricted,
  validate(postTargetUserIdAndSIdSchema),
  asyncHandler(handlePostFriendsRequest)
);

// GET /friends/requests/incoming
router.get(
  "/requests/incoming",
  isLogin,
  isRestricted,
  asyncHandler(handleGetIncomingFriendRequests)
);

// GET /friends/requests/outgoing
router.get(
  "/requests/outgoing",
  isLogin,
  isRestricted,
  asyncHandler(handleGetOutgoingFriendRequests)
);

// POST /friends/requests/accept/:requesterUserId
router.post(
  "/requests/accept/:requesterUserId",
  isLogin,
  isRestricted,
  validate(requesterUserIdSchema),
  asyncHandler(handleAcceptFriendRequest)
);

// POST /friends/requests/reject/:targetUserId
router.post(
  "/requests/reject/:targetUserId",
  isLogin,
  isRestricted,
  validate(targetUserIdSchema),
  asyncHandler(handleRejectFriendRequest)
);

// DELETE /friends/requests/:targetUserId
router.delete(
  "/requests/:targetUserId",
  isLogin,
  isRestricted,
  validate(targetUserIdSchema),
  asyncHandler(handleDeleteFriendRequest)
);

export default router;