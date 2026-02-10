// src/routes/policy.router.js
import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";

import {
  handleGetCommunityGuidelines,
  handleGetTerms,
  handleGetPrivacy,
} from "../controllers/policy.controller.js";

const router = express.Router();

// GET /policies/community-guidelines
router.get("/community-guidelines", asyncHandler(handleGetCommunityGuidelines));

// GET /policies/terms
router.get("/terms", asyncHandler(handleGetTerms));

// GET /policies/privacy
router.get("/privacy", asyncHandler(handleGetPrivacy));

export default router;