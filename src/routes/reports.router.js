// src/routes/reports.router.js
import express from "express";
import { isLogin } from "../middlewares/auth.middleware.js";
import { isRestricted } from "../middlewares/restriction.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import {
  handleInsertUserReport,
  handleGetUserReports,
  handleGetUserReport,
} from "../controllers/report.controller.js";

import { insertUserReportSchema, getUserReportSchema } from "../schemas/report.schema.js";

const router = express.Router();

// POST /reports
router.post(
  "/",
  isLogin,
  isRestricted,
  validate(insertUserReportSchema),
  asyncHandler(handleInsertUserReport)
);

// GET /reports
router.get("/", isLogin, isRestricted, asyncHandler(handleGetUserReports));

// GET /reports/:reportId
router.get(
  "/:reportId",
  isLogin,
  isRestricted,
  validate(getUserReportSchema),
  asyncHandler(handleGetUserReport)
);

export default router;