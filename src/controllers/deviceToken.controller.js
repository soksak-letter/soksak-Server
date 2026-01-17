import { updateMyDeviceToken } from "../services/deviceToken.service.js";

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
