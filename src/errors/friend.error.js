// errors/friend.error.js

import { BadRequestError, ForbiddenError } from "./base.error.js";

// 기본 에러 클래스
export class BaseError extends Error {
  constructor(message, status, errorCode, data = null) {
    super(message);
    this.status = status;
    this.errorCode = errorCode;
    this.reason = message;
    this.data = data;
  }
}

/**
 * 400: 자기 자신에게 친구 신청 (FRIEND_400_01)
 */
export class SelfFriendRequestError extends BadRequestError {
  constructor(message = "자기 자신과는 친구 신청을 할 수 없습니다.") {
    super(message, 400, "FRIEND_400_01", null);
  }
}

/**
 * 404: 수락/거절할 친구 요청이 없음 (FRIEND_404_02)
 * - PENDING 요청 자체가 없거나 이미 처리됨
 */
export class FriendRequestNotFoundError extends BaseError {
  constructor(data = null, message = "처리할 수 있는 친구 요청이 없습니다.") {
    super(message, 404, "FRIEND_404_02", data);
  }
}

/**
 * 409: 이미 친구 요청을 보냈음 (FRIEND_409_01)
 * - insertFriendRequest에서 유니크 충돌(P2002)로 주로 발생
 */
export class FriendRequestAlreadyExistsError extends BaseError {
  constructor(data = null, message = "이미 친구 요청이 존재합니다.") {
    super(message, 409, "FRIEND_409_01", data);
  }
}

/**
 * 409: 이미 친구 관계임 (FRIEND_409_02)
 * - insertFriend에서 유니크 충돌(P2002) 또는 정책상 선검증으로 발생
 */
export class AlreadyFriendsError extends BaseError {
  constructor(data = null, message = "이미 친구입니다.") {
    super(message, 409, "FRIEND_409_02", data);
  }
}

/**
 * 404: 삭제할 친구 관계가 없음 (FRIEND_404_03)
 * - deleteFriend에서 P2025로 주로 발생
 */
export class FriendNotFoundError extends BaseError {
  constructor(data = null, message = "삭제할 친구 관계가 존재하지 않습니다.") {
    super(message, 404, "FRIEND_404_03", data);
  }
}

/**
 * 500: 친구 기능 처리 중 서버 오류 (FRIEND_500_01)
 * - 잡히지 않은 예외를 도메인 관점에서 감싸고 싶을 때
 */
export class FriendInternalError extends BaseError {
  constructor(data = null, message = "친구 처리 중 서버 오류가 발생했습니다.") {
    super(message, 500, "FRIEND_500_01", data);
  }
}

export class NotFriendError extends ForbiddenError {
  constructor(code, message, data = null) {
      super(code, message, data);
  }
}