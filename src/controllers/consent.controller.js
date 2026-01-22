import { getMyConsents, patchMyConsents } from "../services/consent.service.js";

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
