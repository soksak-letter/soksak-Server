// src/routes/notice.router.js
import express from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import { handleGetNotices, handleGetNoticeDetail } from "../controllers/notice.controller.js";
import { noticeIdParamSchema } from "../schemas/notice.schema.js";

const router = express.Router();

// GET /notices
router.get("/", asyncHandler(handleGetNotices));

// GET /notices/:noticeId
router.get("/:noticeId", validate(noticeIdParamSchema), asyncHandler(handleGetNoticeDetail));

export default router;