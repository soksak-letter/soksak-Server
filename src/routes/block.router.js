// src/routes/block.router.js
import express from "express";
import { isLogin } from "../middlewares/auth.middleware.js";
import { isRestricted } from "../middlewares/restriction.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import { handleGetBlock, handlePostBlock } from "../controllers/block.controller.js";
import { postBlockUserSchema } from "../schemas/block.schema.js";

const router = express.Router();

// POST /block/:targetUserId
router.post(
  "/:targetUserId",
  isLogin,
  isRestricted,
  validate(postBlockUserSchema),
  asyncHandler(handlePostBlock)
);

// GET /block
router.get("/", isLogin, isRestricted, asyncHandler(handleGetBlock));

export default router;