import { BadRequestError, ConflictError, NotFoundError, unauthorizedError, ForbiddenError, InternalServerError } from "./base.error.js";

/**
 * 401: 차단된 유저
 */
export class RestrictedUserError extends unauthorizedError {
  constructor(code = "USER_RESTRICTED", message = "해당 유저는 차단된 유저입니다.", data = null) {
    super(code, message, data);
  }
}

/**
 * 404: 유저 없음
 * - userId 또는 targetUserId가 존재하지 않을 때
 */
export class InvalidUserError extends NotFoundError {
  constructor(code = "USER_NOT_FOUND", message = "잘못된 유저 정보 입력입니다.", data = null) {
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
  constructor(code = "USER_UNAUTHORIZED", message = "인증이 필요합니다.", data = null) {
    super(code, message, data);
  }
}

export class ConsentInvalidBodyError extends BadRequestError {
  constructor(code = "USER_CONSENT_INVALID_BODY", message = "요청 바디가 올바르지 않습니다. (termsAgreed/privacyAgreed/marketingAgreed/ageOver14Agreed 중 일부 boolean)", data = null) {
    super(code, message, data);
  }
}

// ========== PushSubscription Errors ==========
export class PushSubscriptionUnauthorizedError extends unauthorizedError {
  constructor(code = "USER_UNAUTHORIZED", message = "인증이 필요합니다.", data = null) {
    super(code, message, data);
  }
}

export class PushSubscriptionInvalidBodyError extends BadRequestError {
  constructor(code = "USER_PUSH_SUBSCRIPTION_INVALID", message = "요청 바디가 올바르지 않습니다. (endpoint, keys.p256dh, keys.auth 필수)", data = null) {
    super(code, message, data);
  }
}

// ========== Profile Errors ==========
export class ProfileUnauthorizedError extends unauthorizedError {
  constructor(code = "USER_UNAUTHORIZED", message = "인증이 필요합니다.", data = null) {
    super(code, message, data);
  }
}

export class ProfileUserNotFoundError extends NotFoundError {
  constructor(code = "USER_NOT_FOUND", message = "유저를 찾을 수 없습니다.", data = null) {
    super(code, message, data);
  }
}

export class ProfileInvalidNicknameError extends BadRequestError {
  constructor(code = "USER_NICKNAME_INVALID", message = "닉네임 형식이 올바르지 않습니다.", data = null) {
    super(code, message, data);
  }
}

export class ProfileFileRequiredError extends BadRequestError {
  constructor(code = "USER_PROFILE_FILE_REQUIRED", message = "이미지 파일이 필요합니다.", data = null) {
    super(code, message, data);
  }
}

export class ProfileUnsupportedImageTypeError extends BadRequestError {
  constructor(code = "USER_PROFILE_IMAGE_TYPE_INVALID", message = "지원하지 않는 이미지 형식입니다. (jpg/png/webp 허용)", data = null) {
    super(code, message, data);
  }
}

export class ProfileInvalidImageUrlError extends BadRequestError {
  constructor(code = "USER_PROFILE_IMAGE_URL_INVALID", message = "프로필 이미지 URL 형식이 올바르지 않습니다.", data = null) {
    super(code, message, data);
  }
}

export class ProfileFileTooLargeError extends BadRequestError {
  constructor(code = "USER_PROFILE_FILE_TOO_LARGE", message = "파일 크기가 너무 큽니다. 최대 5MB까지 업로드 가능합니다.", data = null) {
    super(code, message, data);
  }
}

export class ProfileFileBufferMissingError extends BadRequestError {
  constructor(code = "USER_PROFILE_FILE_BUFFER_MISSING", message = "파일 버퍼를 찾을 수 없습니다.", data = null) {
    super(code, message, data);
  }
}

// ========== Onboarding Errors ==========
export class OnboardingInvalidGenderError extends BadRequestError {
  constructor(code = "USER_ONBOARDING_INVALID_GENDER", message = "gender 값이 올바르지 않습니다.", data = null) {
    super(code, message, data);
  }
}

export class OnboardingInvalidJobError extends BadRequestError {
  constructor(code = "USER_ONBOARDING_INVALID_JOB", message = "job 값이 올바르지 않습니다.", data = null) {
    super(code, message, data);
  }
}

export class OnboardingAlreadyCompletedError extends ConflictError {
  constructor(code = "USER_ONBOARDING_ALREADY_COMPLETED", message = "이미 온보딩 1이 완료된 사용자입니다.", data = null) {
    super(code, message, data);
  }
}

// ========== Interest Errors ==========
export class InterestIdsNotArrayError extends BadRequestError {
  constructor(code = "USER_INTEREST_IDS_NOT_ARRAY", message = "interestIds는 배열이어야 합니다.", data = null) {
    super(code, message, data);
  }
}

export class InterestIdsInvalidFormatError extends BadRequestError {
  constructor(code = "USER_INTEREST_IDS_INVALID_FORMAT", message = "interestIds는 양의 정수 배열이어야 합니다.", data = null) {
    super(code, message, data);
  }
}

export class InterestIdsMinCountError extends BadRequestError {
  constructor(code = "USER_INTEREST_IDS_MIN_COUNT", message = "관심사는 최소 3개 선택해야 합니다.", data = null) {
    super(code, message, data);
  }
}

export class InterestIdsInvalidError extends BadRequestError {
  constructor(code = "USER_INTEREST_IDS_INVALID", message = "유효하지 않은 관심사 id가 포함되어 있습니다.", data = null) {
    super(code, message, data);
  }
}

// ========== Notification Errors ==========
export class NotificationSettingsInvalidBodyError extends BadRequestError {
  constructor(code = "USER_NOTIFICATION_SETTINGS_INVALID_BODY", message = "요청 바디가 올바르지 않습니다.", data = null) {
    super(code, message, data);
  }
}

// ========== Storage Errors ==========
/**
 * 500: Object Storage 설정 오류
 * - Private Key 파일 읽기 실패, 클라이언트 생성 실패 등
 */
export class StorageConfigError extends InternalServerError {
  constructor(code = "USER_STORAGE_CONFIG_ERROR", message = "Object Storage 설정 중 오류가 발생했습니다. (Private Key 파일 읽기 실패 또는 클라이언트 생성 실패)", data = null) {
    super(code, message, data);
  }
}

/**
 * 403: Object Storage 권한 오류
 * - OCI API 401/403: 인증 실패, 접근 권한 없음
 */
export class StoragePermissionError extends ForbiddenError {
  constructor(code = "USER_STORAGE_PERMISSION_DENIED", message = "Object Storage 접근 권한이 없습니다. (인증 실패 또는 Bucket/Namespace 접근 권한 없음)", data = null) {
    super(code, message, data);
  }
}

/**
 * 404: Object Storage 리소스 없음
 * - OCI API 404: Namespace, Bucket, Object 경로를 찾을 수 없음
 */
export class StorageNotFoundError extends NotFoundError {
  constructor(code = "USER_STORAGE_NOT_FOUND", message = "Object Storage 리소스를 찾을 수 없습니다. (Namespace, Bucket 또는 Object 경로 오류)", data = null) {
    super(code, message, data);
  }
}

/**
 * 500: Object Storage 업로드 오류
 * - 네트워크 오류, 타임아웃, 서버 오류 등
 */
export class StorageUploadError extends InternalServerError {
  constructor(code = "USER_STORAGE_UPLOAD_FAILED", message = "파일 업로드 중 오류가 발생했습니다. (네트워크 오류, 타임아웃 또는 서버 오류)", data = null) {
    super(code, message, data);
  }
}