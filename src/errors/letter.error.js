import { BadRequestError, NotFoundError } from "../errors/base.error.js";
/**
 * 400: 자기 자신에게 친구 신청 (FRIEND_400_01)
 */
export class SelfFriendRequestError extends BadRequestError {
  constructor(message = "자기 자신과는 친구 신청을 할 수 없습니다.") {
    super(message, 400, "FRIEND_400_01", null);
  }
}

export class LetterBadRequest extends BadRequestError {
    constructor(
    ) {
        super(this.message, 400, "LETTER_400_01", null);
    }
}

export class LetterNotFoundError extends NotFoundError {
    constructor(message="편지를 찾을 수 없습니다.") {
        super(message, 404, "LETTER_404_01", null);
    }
}