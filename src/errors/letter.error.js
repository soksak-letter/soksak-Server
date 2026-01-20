
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

export class LetterBadRequest extends BaseError {
    constructor(
    ) {
        super(this.message, 400, "LETTER_400_01", null);
    }
}

export class LetterNotFoundError extends BaseError {
    constructor(message="편지를 찾을 수 없습니다.") {
        super(message, 404, "LETTER_404_01", null);
    }
}