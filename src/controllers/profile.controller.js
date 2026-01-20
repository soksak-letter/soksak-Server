import { getMyProfile, updateMyNickname, updateMyProfileImage } from "../services/user.service.js";
import { ProfileError } from "../errors/profile.error.js";

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
    if (!userId) throw new ProfileError("인증이 필요합니다.", 401, "UNAUTHORIZED");

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
    if (!userId) throw new ProfileError("인증이 필요합니다.", 401, "UNAUTHORIZED");

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
    if (!userId) throw new ProfileError("인증이 필요합니다.", 401, "UNAUTHORIZED");

    const file = req.file; // multer single("image")
    const result = await updateMyProfileImage({ userId, file });

    return ok(res, result);
  } catch (e) {
    return fail(res, e);
  }
};
