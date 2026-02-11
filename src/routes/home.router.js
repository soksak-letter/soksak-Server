// src/routes/home.router.js
import express from "express";
import { isLogin } from "../middlewares/auth.middleware.js";
import { isRestricted } from "../middlewares/restriction.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { ISOTimeSchema } from "../schemas/common.schema.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import { HandleGetHomeDashboard } from "../controllers/dashboard.controller.js";

const router = express.Router();

// GET /home/summary
router.get("/summary", isLogin, isRestricted, validate(ISOTimeSchema), asyncHandler(HandleGetHomeDashboard));

export default router;