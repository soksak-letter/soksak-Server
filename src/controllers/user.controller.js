import {
  createUserAgreements,
  updateOnboardingStep1,
  getMyConsents,
  patchMyConsents,
  updateMyDeviceToken,
  getAllInterests,
  getMyInterests,
  updateMyOnboardingInterests,
  getAnonymousThreads,
  getAnonymousThreadLetters,
  getSelfMailbox,
  getNotices,
  getNoticeDetail,
  updateMyNotificationSettings,
  getMyNotificationSettings,
  getCommunityGuidelines,
  getTerms,
  getPrivacy,
  getMyProfile,
  updateMyNickname,
  updateMyProfileImage,
} from "../services/user.service.js";
import {
  MailboxUnauthorizedError,
  ProfileUnauthorizedError,
} from "../errors/user.error.js";

// ========== Onboarding Controllers ==========
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

export const handleCreateUserAgreements = async (req, res, next) => {
  const userId = req.user.id;
  
  try{
    await createUserAgreements({userId, body: req.body});

    res.status(200).success({ message: "약관 동의가 완료되었습니다." });
  } catch(err) {
    next(err);
  }
};

// ========== Consent Controllers ==========
export const handleGetMyConsents = async (req, res) => {
  try {
    const userId = req.user?.id;

    const result = await getMyConsents({ userId });

    return res.status(200).json({
      resultType: "SUCCESS",
      error: null,
      success: result,
    });
  } catch (err) {
    const status = err.status ?? 500;
    const code = err.code ?? "INTERNAL_SERVER_ERROR";
    const message = err.message ?? "서버 내부 오류";

    return res.status(status).json({
      resultType: "ERROR",
      error: { code, message },
      success: null,
    });
  }
};

export const handlePatchMyConsents = async (req, res) => {
  try {
    const userId = req.user?.id;
    const payload = req.body ?? {};

    const result = await patchMyConsents({ userId, payload });

    return res.status(200).json({
      resultType: "SUCCESS",
      error: null,
      success: result,
    });
  } catch (err) {
    const status = err.status ?? 500;
    const code = err.code ?? "INTERNAL_SERVER_ERROR";
    const message = err.message ?? "서버 내부 오류";

    return res.status(status).json({
      resultType: "ERROR",
      error: { code, message },
      success: null,
    });
  }
};

// ========== DeviceToken Controllers ==========
export const handlePutMyDeviceToken = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { deviceToken } = req.body ?? {};

    const result = await updateMyDeviceToken({ userId, deviceToken });

    return res.status(200).json({
      resultType: "SUCCESS",
      error: null,
      success: result,
    });
  } catch (err) {
    const status = err.status ?? 500;
    const code = err.code ?? "INTERNAL_SERVER_ERROR";
    const message = err.message ?? "서버 내부 오류";

    return res.status(status).json({
      resultType: "ERROR",
      error: { code, message },
      success: null,
    });
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

// ========== Mailbox Controllers ==========
const getAuthUserId = (req) => req.user?.id ?? req.userId ?? req.user?.userId ?? null;

export const handleGetAnonymousThreads = async (req, res, next) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) throw new MailboxUnauthorizedError();

    const result = await getAnonymousThreads(userId);
    return res.status(200).json({
      resultType: "SUCCESS",
      error: null,
      success: result,
    });
  } catch (err) {
    next(err);
  }
};

export const handleGetAnonymousThreadLetters = async (req, res, next) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) throw new MailboxUnauthorizedError();

    const { threadId } = req.params;
    const result = await getAnonymousThreadLetters(userId, threadId);

    return res.status(200).json({
      resultType: "SUCCESS",
      error: null,
      success: result,
    });
  } catch (err) {
    next(err);
  }
};

export const handleGetSelfMailbox = async (req, res, next) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) throw new MailboxUnauthorizedError();

    const result = await getSelfMailbox(userId);
    return res.status(200).json({
      resultType: "SUCCESS",
      error: null,
      success: result,
    });
  } catch (err) {
    next(err);
  }
};

// ========== Notice Controllers ==========
export const handleGetNotices = async (req, res, next) => {
  try {
    const data = await getNotices();
    return res.status(200).json({ resultType: "SUCCESS", error: null, success: data });
  } catch (err) {
    next(err);
  }
};

export const handleGetNoticeDetail = async (req, res, next) => {
  try {
    const { noticeId } = req.params;
    const data = await getNoticeDetail(noticeId);
    return res.status(200).json({ resultType: "SUCCESS", error: null, success: data });
  } catch (err) {
    next(err);
  }
};

// ========== Notification Controllers ==========
export const handleUpdateMyNotificationSettings = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new Error("인증 정보가 없습니다.");

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
    if (!userId) throw new Error("인증 정보가 없습니다.");

    const result = await getMyNotificationSettings({ userId });

    return res.status(200).success(result); // { letter: true, marketing: false }
  } catch (err) {
    next(err);
  }
};

// ========== Policy Controllers ==========
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

// ========== Profile Controllers ==========
const ok = (res, success) => {
  return res.status(200).json({ resultType: "SUCCESS", error: null, success });
};

const fail = (res, err) => {
  const status = err?.statusCode || 500;
  const code = err?.code || "INTERNAL_SERVER_ERROR";
  const message = err?.message || "서버 내부 오류";

  return res.status(status).json({
    resultType: "ERROR",
    error: { code, message },
    success: null,
  });
};

// GET /users/me/profile
export const handleGetMyProfile = async (req, res) => {
  try {
    const userId = req?.user?.id;
    if (!userId) throw new ProfileUnauthorizedError();

    const data = await getMyProfile({ userId });
    return ok(res, data);
  } catch (e) {
    return fail(res, e);
  }
};

// PATCH /users/me/profile  (nickname)
export const handlePatchMyProfile = async (req, res) => {
  try {
    const userId = req?.user?.id;
    if (!userId) throw new ProfileUnauthorizedError();

    const { nickname } = req.body || {};
    const result = await updateMyNickname({ userId, nickname });

    return ok(res, result);
  } catch (e) {
    return fail(res, e);
  }
};

// POST /users/me/profile/image  (multipart)
export const handlePostMyProfileImage = async (req, res) => {
  try {
    const userId = req?.user?.id;
    if (!userId) throw new ProfileUnauthorizedError();

    const file = req.file; // multer single("image")
    const result = await updateMyProfileImage({ userId, file });

    return ok(res, result);
  } catch (e) {
    return fail(res, e);
  }
};