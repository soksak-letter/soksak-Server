import { BadRequestError, NotFoundError, InternalServerError } from "./base.error.js";
/**
 * 400: 자기 자신에게 친구 신청 (FRIEND_400_01)
 */
export class SelfFriendRequestError extends BadRequestError {
  constructor(message = "자기 자신과는 친구 신청을 할 수 없습니다.") {
    super(message, 400, "FRIEND_400_01", null);
  }
}

export class UnExpectArgumentsError extends BadRequestError {
    constructor(message = "올바르지 않은 Arguments 입력입니다.") {
        super(message, 400, "SESSION_400_1", null);
    }
}

export class SessionParticipantNotFoundError extends NotFoundError {
  constructor(message = "존재하지 않는 세션 참가자입니다.") {
    super(message, 404, "SESSION_404_1", null);
  }
}

export class SessionInternalError extends InternalServerError {
  constructor(data = null, message = "친구 처리 중 서버 오류가 발생했습니다.") {
    super(message, 500, "SESSION_500_01", data);
  }
}

export class MaxTurnIsOver extends InternalServerError {
  constructor(data = null, message = "편지 주고 받은 횟수가 10번이 되었습니다.") {
    super(message, 500, "SESSION_500_02", data);
  }
}

export class SessionNotFoundError extends NotFoundError {
  constructor(data = null, message = "세션을 찾을 수 없습니다.") {
    super(message, 404, "SESSION_404_02", data);
  }
}

export class SessionCountOverError extends InternalServerError {
  constructor(data = null, message = "세션이 10개 이상입니다.") {
    super(message, 500, "SESSION_500_3", data);
  }
}