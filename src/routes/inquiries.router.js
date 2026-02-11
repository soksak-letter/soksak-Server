// src/routes/inquiries.router.js
import express from "express";
import { isLogin } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import {
  handleInsertInquiryAsUser,
  handleInsertInquiryAsAdmin,
  handleGetInquiry,
  handleGetInquiryDetail,
} from "../controllers/inquiry.controller.js";

import {
  getInquiryDetailSchema,
  insertInquiryAsAdminSchema,
  insertInquiryAsUserSchema,
} from "../schemas/inquiry.schema.js";

const router = express.Router();

// POST /inquiries
router.post(
  "/",
  isLogin,
  validate(insertInquiryAsUserSchema),
  asyncHandler(handleInsertInquiryAsUser)
);

// POST /inquiries/admin
router.post(
  "/admin",
  isLogin,
  validate(insertInquiryAsAdminSchema),
  asyncHandler(handleInsertInquiryAsAdmin)
);

// GET /inquiries
router.get("/", isLogin, asyncHandler(handleGetInquiry));

// GET /inquiries/:inquiryId
router.get(
  "/:inquiryId",
  isLogin,
  validate(getInquiryDetailSchema),
  asyncHandler(handleGetInquiryDetail)
);

export default router;