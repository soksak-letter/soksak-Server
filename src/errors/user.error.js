import { BadRequestError, NotFoundError, unauthorizedError } from "./base.error.js";

/**
 * 404: 유저 없음 (USER_404_01)
 * - userId 또는 targetUserId가 존재하지 않을 때
 */
export class InvalidUserError extends NotFoundError {
  constructor(data = null, message = "잘못된 유저 정보 입력입니다.") {
    super("USER_404_01", message, data);
  }
}

export class UserNotFoundError extends NotFoundError {
  constructor(code, message, data = null){
    super(code, message, data);
  }
}

// ========== Consent Errors ==========
export class ConsentUnauthorizedError extends unauthorizedError {
  constructor(message = "인증이 필요합니다.", data = null) {
    super("USER_401_01", message, data);
  }
}

export class ConsentInvalidBodyError extends BadRequestError {
  constructor(message = "요청 바디가 올바르지 않습니다. (termsAgreed/privacyAgreed/marketingAgreed/ageOver14Agreed 중 일부 boolean)", data = null) {
    super("USER_400_01", message, data);
  }
}

export const CONSENT_ERRORS = {
  UNAUTHORIZED: new ConsentUnauthorizedError(),
  INVALID_BODY: new ConsentInvalidBodyError(),
};

// ========== DeviceToken Errors ==========
export class DeviceTokenUnauthorizedError extends unauthorizedError {
  constructor(message = "인증이 필요합니다.", data = null) {
    super("USER_401_02", message, data);
  }
}

export class DeviceTokenInvalidBodyError extends BadRequestError {
  constructor(message = "요청 바디가 올바르지 않습니다. (deviceToken: string 필수)", data = null) {
    super("USER_400_02", message, data);
  }
}

export const DEVICE_TOKEN_ERRORS = {
  UNAUTHORIZED: new DeviceTokenUnauthorizedError(),
  INVALID_BODY: new DeviceTokenInvalidBodyError(),
};

// ========== Mailbox Errors ==========
export const MAILBOX_ERROR = {
  UNAUTHORIZED: {
    statusCode: 401,
    errorCode: "USER_401_03",
    message: "인증이 필요합니다.",
  },
  INVALID_THREAD_ID: {
    statusCode: 400,
    errorCode: "USER_400_03",
    message: "threadId가 올바르지 않습니다.",
  },
};

export const throwMailboxError = (errorObj, detail = null) => {
  const err = new Error(errorObj.message);
  err.statusCode = errorObj.statusCode;
  err.errorCode = errorObj.errorCode;
  err.reason = errorObj.message;
  err.data = detail ?? null;
  throw err;
};

// ========== Notice Errors ==========
export class NoticeNotFoundError extends NotFoundError {
  constructor(noticeId, message = null, data = null) {
    const msg = message || `해당 공지사항을 찾을 수 없습니다. noticeId=${noticeId}`;
    super("USER_404_02", msg, data);
  }
}

export class InvalidNoticeIdError extends BadRequestError {
  constructor(noticeId, message = null, data = null) {
    const msg = message || `noticeId는 양의 정수여야 합니다. noticeId=${noticeId}`;
    super("USER_400_04", msg, data);
  }
}

// ========== Policy Errors ==========
export class PolicyNotFoundError extends NotFoundError {
  constructor(key, message = null, data = null) {
    const msg = message || `해당 정책 문서를 찾을 수 없습니다. key=${key}`;
    super("USER_404_03", msg, data);
  }
}

// ========== Profile Errors ==========
export class ProfileError extends BadRequestError {
  constructor(message, statusCode = 400, code = "USER_400_05", detail = null) {
    super(code, message, detail);
    if (statusCode !== 400) {
      this.status = statusCode;
    }
  }
}

export const PROFILE_ERROR = {
  UNAUTHORIZED: {
    statusCode: 401,
    errorCode: "USER_401_04",
    message: "인증이 필요합니다.",
  },
  USER_NOT_FOUND: {
    statusCode: 404,
    errorCode: "USER_404_04",
    message: "유저를 찾을 수 없습니다.",
  },
  INVALID_NICKNAME: {
    statusCode: 400,
    errorCode: "USER_400_05",
    message: "닉네임 형식이 올바르지 않습니다.",
  },
  FILE_REQUIRED: {
    statusCode: 400,
    errorCode: "USER_400_06",
    message: "이미지 파일이 필요합니다.",
  },
  UNSUPPORTED_IMAGE_TYPE: {
    statusCode: 400,
    errorCode: "USER_400_07",
    message: "지원하지 않는 이미지 형식입니다. (jpg/png/webp 허용)",
  },
  INVALID_PROFILE_IMAGE_URL: {
    statusCode: 400,
    errorCode: "USER_400_08",
    message: "프로필 이미지 URL 형식이 올바르지 않습니다.",
  },
};

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