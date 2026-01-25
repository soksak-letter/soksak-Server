// errors/friend.error.js
import { BadRequestError, NotFoundError, ConflictError, InternalServerError, ForbiddenError } from "./base.error.js";

/**
 * 400: 자기 자신에게 친구 신청 (FRIEND_400_01)
 */
export class SelfFriendRequestError extends BadRequestError {
  constructor(
    code = "FRIEND_SELFREQUEST_ERROR",
    message = "자기 자신과는 친구 신청을 할 수 없습니다.",
    data = null
  ) {
    super(code, message, data);
  }
}

/**
 * 404: 수락/거절할 친구 요청이 없음 (FRIEND_404_02)
 * - PENDING 요청 자체가 없거나 이미 처리됨
 */
export class FriendRequestNotFoundError extends NotFoundError {
  constructor(
    code = "FRIEND_REQUESTNOTFOUND_ERROR",
    message = "처리할 수 있는 친구 요청이 없습니다.",
    data = null
  ) {
    super(code, message, data);
  }
}

/**
 * 409: 이미 친구 요청을 보냈음 (FRIEND_409_01)
 * - insertFriendRequest에서 유니크 충돌(P2002)로 주로 발생
 */
export class FriendRequestAlreadyExistsError extends ConflictError {
  constructor(
    code = "FRIEND_ALREADYEXISTS_ERROR",
    message = "이미 친구 요청이 존재합니다.",
    data = null
  ) {
    super(code, message, data);
  }
}

/**
 * 409: 이미 친구 관계임 (FRIEND_409_02)
 * - insertFriend에서 유니크 충돌(P2002) 또는 정책상 선검증으로 발생
 */
export class AlreadyFriendsError extends ConflictError {
  constructor(
    code = "FRIEND_ALREADY_ERROR",
    message = "이미 친구입니다.",
    data = null
  ) {
    super(code, message, data);
  }
}

/**
 * 404: 삭제할 친구 관계가 없음 (FRIEND_404_03)
 * - deleteFriend에서 P2025로 주로 발생
 */
export class FriendDeletingNotFoundError extends NotFoundError {
  constructor(
    code = "FRIEND_DELETINGNOTFOUND_ERROR",
    message = "삭제할 친구 관계가 존재하지 않습니다.",
    data = null
  ) {
    super(code, message, data);
  }
}

/**
 * 500: 친구 기능 처리 중 서버 오류 (FRIEND_500_01)
 * - 잡히지 않은 예외를 도메인 관점에서 감싸고 싶을 때
 */
export class FriendInternalError extends InternalServerError {
  constructor(
    code = "FRIEND_500",
    message = "친구 처리 중 서버 오류가 발생했습니다.",
    data = null
  ) {
    super(code, message, data);
  }
}

/**
 * 403: 친구 관계가 아님 (FRIEND_403_01) - (코드는 네가 원하면 바꿔도 됨)
 */
export class NotFriendError extends ForbiddenError {
  constructor(
    code = "FRIEND_NOTFRIEND_ERROR",
    message = "친구 관계가 아닙니다.",
    data = null
  ) {
    super(code, message, data);
  }
}

export class FriendNotFoundError extends NotFoundError {
  constructor(code = "FRIEND_NOTFOUND_ERROR", message = "친구를 찾을 수 없습니다.", data = null) {
    super(code, message, data);
  }
}
