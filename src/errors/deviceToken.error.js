export class DeviceTokenError extends Error {
  constructor({ status = 400, code = "DEVICE_TOKEN_ERROR", message = "디바이스 토큰 오류" }) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export const DEVICE_TOKEN_ERRORS = {
  UNAUTHORIZED: new DeviceTokenError({
    status: 401,
    code: "UNAUTHORIZED",
    message: "인증이 필요합니다.",
  }),
  INVALID_BODY: new DeviceTokenError({
    status: 400,
    code: "INVALID_BODY",
    message: "요청 바디가 올바르지 않습니다. (deviceToken: string 필수)",
  }),
};
