// errors/friend.error.js

import { ConflictError, NotFoundError, unauthorizedError } from "./base.error.js";

export class RestrictedUserError extends unauthorizedError {
    constructor(message = "해당 유저는 차단된 유저입니다.") {
        super(message, "USER_401_02", null)
    }
}
/**
 * 404: 유저 없음 (FRIEND_404_01)
 * - userId 또는 targetUserId가 존재하지 않을 때
 */
export class InvalidUserError extends NotFoundError {
  constructor(data, message = "잘못된 유저 정보 입력입니다.") {
    super(message, 404, "FRIEND_404_01", data);
  }
}

export class UserNotFoundError extends NotFoundError {
  constructor(code, message, data = null){
    super(code, message, data);
  }
}