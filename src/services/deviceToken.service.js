import { upsertUserDeviceToken } from "../repositories/deviceToken.repository.js";
import { DEVICE_TOKEN_ERRORS } from "../errors/deviceToken.error.js";

export const updateMyDeviceToken = async ({ userId, deviceToken }) => {
  if (!userId) throw DEVICE_TOKEN_ERRORS.UNAUTHORIZED;
  if (typeof deviceToken !== "string" || deviceToken.trim().length === 0) {
    throw DEVICE_TOKEN_ERRORS.INVALID_BODY;
  }

  await upsertUserDeviceToken({
    userId,
    deviceToken: deviceToken.trim(),
    deviceType: "FCM", 
  });

  return { updated: true };
};
