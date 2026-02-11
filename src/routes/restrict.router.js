// src/routes/restrict.router.js
import express from "express";
import { isLogin } from "../middlewares/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { handleGetRestrict } from "../controllers/restrict.controller.js";

const router = express.Router();

// GET /restrict
router.get("/", isLogin, asyncHandler(handleGetRestrict));

export default router;