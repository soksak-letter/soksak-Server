// src/routes/mailbox.router.js
import express from "express";
import { isLogin } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import {
  handleGetAnonymousThreads,
  handleGetAnonymousThreadLetters,
  handleGetSelfMailbox,
  handleGetLetterFromFriend,
} from "../controllers/mailbox.controller.js";

import { sessionIdParamSchema } from "../schemas/mailbox.schema.js";
import { idParamSchema } from "../schemas/common.schema.js";

const router = express.Router();

// GET /mailbox/anonymous
router.get("/anonymous", isLogin, asyncHandler(handleGetAnonymousThreads));

// GET /mailbox/anonymous/threads/:sessionId/letters
router.get(
  "/anonymous/threads/:sessionId/letters",
  isLogin,
  validate(sessionIdParamSchema),
  asyncHandler(handleGetAnonymousThreadLetters)
);

// GET /mailbox/friends/threads/:friendId/letters
router.get(
  "/friends/threads/:friendId/letters",
  isLogin,
  validate(idParamSchema("friendId")),
  asyncHandler(handleGetLetterFromFriend)
);

// GET /mailbox/self
router.get("/self", isLogin, asyncHandler(handleGetSelfMailbox));

export default router;