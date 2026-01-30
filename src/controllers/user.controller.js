import {
  updateOnboardingStep1,
  getMyConsents,
  patchMyConsents,
  updateMyPushSubscription,
  getAllInterests,
  getMyInterests,
  updateMyOnboardingInterests,
  updateMyNotificationSettings,
  getMyNotificationSettings,
  getMyProfile,
  updateMyNickname,
  updateMyProfileImage,
  updateActivity,
} from "../services/user.service.js";
import {
  ProfileUnauthorizedError,
} from "../errors/user.error.js";

// ========== Onboarding Controllers ==========
export const handlePatchOnboardingStep1 = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ProfileUnauthorizedError();
    }

    // 화면/기획 기준: gender, job만 받음 (ageRange는 받지 않음)
    const { gender, job } = req.body;

    const result = await updateOnboardingStep1({ userId, gender, job });

    return res.status(200).success(result);
  } catch (err) {
    next(err);
  }
};

// ========== Consent Controllers ==========
export const handleGetMyConsents = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    const result = await getMyConsents({ userId });

    return res.status(200).success(result);
  } catch (err) {
    next(err);
  }
};

export const handlePatchMyConsents = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const data = req.body ?? {};

    const result = await patchMyConsents({ userId, data });

    return res.status(200).success(result);
  } catch (err) {
    next(err);
  }
};

// ========== PushSubscription Controllers ==========
export const handlePutMyPushSubscription = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const subscription = req.body ?? {};

    const result = await updateMyPushSubscription({ userId, subscription });

    return res.status(200).success(result);
  } catch (err) {
    next(err);
  }
};

// ========== Interest Controllers ==========
// 전체 관심사(로그인 불필요)
export const handleGetAllInterests = async (req, res, next) => {
  try {
    const result = await getAllInterests();
    return res.status(200).success(result);
  } catch (err) {
    next(err);
  }
};

// 내 관심사(로그인 필요)
export const handleGetMyInterests = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await getMyInterests({ userId });
    return res.status(200).success(result);
  } catch (err) {
    next(err);
  }
};

// 내 관심사 저장(로그인 필요)
export const handleUpdateMyOnboardingInterests = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { interestIds } = req.body;
    const result = await updateMyOnboardingInterests({ userId, interestIds });
    return res.status(200).success(result);
  } catch (err) {
    next(err);
  }
};

// ========== Notification Controllers ==========
export const handleUpdateMyNotificationSettings = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new ProfileUnauthorizedError();

    const { letter, marketing } = req.body;

    const result = await updateMyNotificationSettings({ userId, letter, marketing });

    return res.status(200).success(result); // { updated: true }
  } catch (err) {
    next(err);
  }
};

export const handleGetMyNotificationSettings = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new ProfileUnauthorizedError();

    const result = await getMyNotificationSettings({ userId });

    return res.status(200).success(result); // { letter: true, marketing: false }
  } catch (err) {
    next(err);
  }
};

// ========== Profile Controllers ==========
// GET /users/me/profile
export const handleGetMyProfile = async (req, res, next) => {
  try {
    const userId = req?.user?.id;
    if (!userId) throw new ProfileUnauthorizedError();

    const data = await getMyProfile({ userId });
    return res.status(200).success(data);
  } catch (e) {
    next(e);
  }
};

// PATCH /users/me/profile  (nickname)
export const handlePatchMyProfile = async (req, res, next) => {
  try {
    const userId = req?.user?.id;
    if (!userId) throw new ProfileUnauthorizedError();

    const { nickname } = req.body || {};
    const result = await updateMyNickname({ userId, nickname });

    return res.status(200).success(result);
  } catch (e) {
    next(e);
  }
};

// POST /users/me/profile/image  (multipart)
export const handlePostMyProfileImage = async (req, res, next) => {
  try {
    const userId = req?.user?.id;
    if (!userId) throw new ProfileUnauthorizedError();

    const file = req.file; // multer single("image")
    const result = await updateMyProfileImage({ userId, file });

    return res.status(200).success(result);
  } catch (e) {
    next(e);
  }
};

// ========== Activity Controller ==========
export const handleUpdateActivity = async (req, res, next) => {
  try {
    const userId = req?.user?.id;
    if (!userId) throw new ProfileUnauthorizedError();

    const result = await updateActivity(userId);

    return res.status(200).success(result);
  } catch (e) {
    next(e);
  }
};