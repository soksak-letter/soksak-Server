import { BadRequestError, NotFoundError, unauthorizedError } from "./base.error.js";

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

// ========== Mailbox Errors ==========
export class MailboxUnauthorizedError extends unauthorizedError {
  constructor(code = "USER_401_03", message = "인증이 필요합니다.", data = null) {
    super(code, message, data);
  }
}

export class MailboxInvalidThreadIdError extends BadRequestError {
  constructor(code = "USER_400_03", message = "threadId가 올바르지 않습니다.", data = null) {
    super(code, message, data);
  }
}

// ========== Notice Errors ==========
export class NoticeNotFoundError extends NotFoundError {
  constructor(code = "USER_404_02", message = "해당 공지사항을 찾을 수 없습니다.", data = null) {
    super(code, message, data);
  }
}

export class InvalidNoticeIdError extends BadRequestError {
  constructor(code = "USER_400_04", message = "noticeId는 양의 정수여야 합니다.", data = null) {
    super(code, message, data);
  }
}

// ========== Policy Errors ==========
export class PolicyNotFoundError extends NotFoundError {
  constructor(code = "USER_404_03", message = "해당 정책 문서를 찾을 수 없습니다.", data = null) {
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