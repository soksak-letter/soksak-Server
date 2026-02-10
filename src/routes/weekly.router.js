// src/routes/weekly.router.js
import express from "express";
import { isLogin } from "../middlewares/auth.middleware.js";
import { isRestricted } from "../middlewares/restriction.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { handleGetWeeklyReport } from "../controllers/weeklyReport.controller.js";

const router = express.Router();

// GET /weekly/reports
router.get("/reports", isLogin, isRestricted, asyncHandler(handleGetWeeklyReport));

export default router;