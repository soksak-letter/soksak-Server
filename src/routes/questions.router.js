// src/routes/questions.router.js
import express from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { ISOTimeSchema } from "../schemas/common.schema.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { handleGetTodayQuestion } from "../controllers/question.controller.js";

const router = express.Router();

// GET /questions/today
router.get("/today", validate(ISOTimeSchema), asyncHandler(handleGetTodayQuestion));

export default router;