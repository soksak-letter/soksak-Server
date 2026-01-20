import { getCommunityGuidelines, getPrivacy, getTerms } from "../services/user.service.js";

export const handleGetCommunityGuidelines = async (req, res, next) => {
  try {
    const data = await getCommunityGuidelines();
    return res.status(200).json({ resultType: "SUCCESS", error: null, success: data });
  } catch (err) {
    next(err);
  }
};

export const handleGetTerms = async (req, res, next) => {
  try {
    const data = await getTerms();
    return res.status(200).json({ resultType: "SUCCESS", error: null, success: data });
  } catch (err) {
    next(err);
  }
};

export const handleGetPrivacy = async (req, res, next) => {
  try {
    const data = await getPrivacy();
    return res.status(200).json({ resultType: "SUCCESS", error: null, success: data });
  } catch (err) {
    next(err);
  }
};
