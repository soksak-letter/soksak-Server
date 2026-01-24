import { BadRequestError, ConflictError, NotFoundError, unauthorizedError } from "./base.error.js";

/**
 * 401: 차단된 유저 (USER_401_05)
 */
export class RestrictedUserError extends unauthorizedError {
  constructor(code = "USER_401_05", message = "해당 유저는 차단된 유저입니다.", data = null) {
    super(code, message, data);
  }
}

/**
 * 404: 유저 없음 (USER_404_01)
 * - userId 또는 targetUserId가 존재하지 않을 때
 */
export class InvalidUserError extends NotFoundError {
  constructor(code = "USER_404_01", message = "잘못된 유저 정보 입력입니다.", data = null) {
    super(code, message, data);
  }
}


export class UserNotFoundError extends NotFoundError {
  constructor(code, message, data = null){
    super(code, message, data);
  }
}

// ========== Consent Errors ==========
export class ConsentUnauthorizedError extends unauthorizedError {
  constructor(code = "USER_401_01", message = "인증이 필요합니다.", data = null) {
    super(code, message, data);
  }
}

export class ConsentInvalidBodyError extends BadRequestError {
  constructor(code = "USER_400_01", message = "요청 바디가 올바르지 않습니다. (termsAgreed/privacyAgreed/marketingAgreed/ageOver14Agreed 중 일부 boolean)", data = null) {
    super(code, message, data);
  }
}

// ========== DeviceToken Errors ==========
export class DeviceTokenUnauthorizedError extends unauthorizedError {
  constructor(code = "USER_401_02", message = "인증이 필요합니다.", data = null) {
    super(code, message, data);
  }
}

export class DeviceTokenInvalidBodyError extends BadRequestError {
  constructor(code = "USER_400_02", message = "요청 바디가 올바르지 않습니다. (deviceToken: string 필수)", data = null) {
    super(code, message, data);
  }
}

// ========== Profile Errors ==========
export class ProfileUnauthorizedError extends unauthorizedError {
  constructor(code = "USER_401_04", message = "인증이 필요합니다.", data = null) {
    super(code, message, data);
  }
}

export class ProfileUserNotFoundError extends NotFoundError {
  constructor(code = "USER_404_04", message = "유저를 찾을 수 없습니다.", data = null) {
    super(code, message, data);
  }
}

export class ProfileInvalidNicknameError extends BadRequestError {
  constructor(code = "USER_400_05", message = "닉네임 형식이 올바르지 않습니다.", data = null) {
    super(code, message, data);
  }
}

export class ProfileFileRequiredError extends BadRequestError {
  constructor(code = "USER_400_06", message = "이미지 파일이 필요합니다.", data = null) {
    super(code, message, data);
  }
}

export class ProfileUnsupportedImageTypeError extends BadRequestError {
  constructor(code = "USER_400_07", message = "지원하지 않는 이미지 형식입니다. (jpg/png/webp 허용)", data = null) {
    super(code, message, data);
  }
}

export class ProfileInvalidImageUrlError extends BadRequestError {
  constructor(code = "USER_400_08", message = "프로필 이미지 URL 형식이 올바르지 않습니다.", data = null) {
    super(code, message, data);
  }
}