import { updateOnboardingStep1 } from "../services/user.service.js";

export const handlePatchOnboardingStep1 = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).error({ errorCode: "AUTH_401", reason: "Unauthorized" });
    }

    // 화면/기획 기준: gender, job만 받음 (ageRange는 받지 않음)
    const { gender, job } = req.body;

    const result = await updateOnboardingStep1({ userId, gender, job });

    return res.status(200).success(result);
  } catch (err) {
    next(err);
  }
};
