// src/routes/interests.router.js
import express from "express";
import { isLogin } from "../middlewares/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { handleGetAllInterests, handleGetMyInterests } from "../controllers/user.controller.js";

const router = express.Router();

// GET /interests/all
router.get("/all", asyncHandler(handleGetAllInterests));

// GET /interests
router.get("/", isLogin, asyncHandler(handleGetMyInterests));

export default router;