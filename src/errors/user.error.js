// errors/friend.error.js

import { ConflictError } from "./base.error.js";

// 기본 에러 클래스
class BaseError extends Error {
  constructor(message, status, errorCode, data = null) {
    super(message);
    this.status = status;
    this.errorCode = errorCode;
    this.reason = message;
    this.data = data;
  }
}

/**
 * 404: 유저 없음 (FRIEND_404_01)
 * - userId 또는 targetUserId가 존재하지 않을 때
 */
export class InvalidUserError extends BaseError {
  constructor(data, message = "잘못된 유저 정보 입력입니다.") {
    super(message, 404, "FRIEND_404_01", data);
  }
}

export class DuplicatedValueError extends ConflictError {
  constructor(code, message, data = null){
    super(code, message, data);
  }
}