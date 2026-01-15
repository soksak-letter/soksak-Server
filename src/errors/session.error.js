// errors/session.error.js

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
export class SelfFriendRequestError extends BaseError {
  constructor(message = "자기 자신과는 친구 신청을 할 수 없습니다.") {
    super(message, 400, "FRIEND_400_01", null);
  }
}

export class UnExpectArgumentsError extends BaseError {
    constructor(message = "올바르지 않은 Arguments 입력입니다.") {
        super(message, 400, "SESSION_400_1", null);
    }
}

export class SessionParticipantNotFoundError extends BaseError {
  constructor(message = "존재하지 않는 세션 참가자입니다.") {
    super(message, 404, "SESSION_404_1", null);
  }
}

export class SessionInternalError extends BaseError {
  constructor(data = null, message = "친구 처리 중 서버 오류가 발생했습니다.") {
    super(message, 500, "SESSION_500_01", data);
  }
}