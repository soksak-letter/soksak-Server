export const PROFILE_ERROR = {
  UNAUTHORIZED: {
    statusCode: 401,
    errorCode: "PROFILE_UNAUTHORIZED",
    message: "인증이 필요합니다.",
  },
  USER_NOT_FOUND: {
    statusCode: 404,
    errorCode: "PROFILE_USER_NOT_FOUND",
    message: "유저를 찾을 수 없습니다.",
  },
  INVALID_NICKNAME: {
    statusCode: 400,
    errorCode: "PROFILE_INVALID_NICKNAME",
    message: "닉네임 형식이 올바르지 않습니다.",
  },
  FILE_REQUIRED: {
    statusCode: 400,
    errorCode: "PROFILE_FILE_REQUIRED",
    message: "이미지 파일이 필요합니다.",
  },
  UNSUPPORTED_IMAGE_TYPE: {
    statusCode: 400,
    errorCode: "PROFILE_UNSUPPORTED_IMAGE_TYPE",
    message: "지원하지 않는 이미지 형식입니다. (jpg/png/webp 허용)",
  },
  INVALID_PROFILE_IMAGE_URL: {
    statusCode: 400,
    errorCode: "PROFILE_INVALID_PROFILE_IMAGE_URL",
    message: "프로필 이미지 URL 형식이 올바르지 않습니다.",
  },
};

export class ProfileError extends Error {
  constructor(message, statusCode = 400, code = "PROFILE_ERROR", detail = null) {
    super(message);
    this.name = "ProfileError";
    this.statusCode = statusCode;
    this.code = code;
    this.detail = detail;
  }
}

export const throwProfileError = (errorObj, detail = null) => {
  throw new ProfileError(errorObj.message, errorObj.statusCode, errorObj.errorCode, detail);
};

export const ProfileErrors = {
  UNAUTHORIZED: () => throwProfileError(PROFILE_ERROR.UNAUTHORIZED),
  USER_NOT_FOUND: () => throwProfileError(PROFILE_ERROR.USER_NOT_FOUND),
  INVALID_NICKNAME: () => throwProfileError(PROFILE_ERROR.INVALID_NICKNAME),
  FILE_REQUIRED: () => throwProfileError(PROFILE_ERROR.FILE_REQUIRED),
  UNSUPPORTED_IMAGE_TYPE: () => throwProfileError(PROFILE_ERROR.UNSUPPORTED_IMAGE_TYPE),
  INVALID_PROFILE_IMAGE_URL: () => throwProfileError(PROFILE_ERROR.INVALID_PROFILE_IMAGE_URL),
};
