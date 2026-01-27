import { BadRequestError, NotFoundError, InternalServerError, ForbiddenError } from "./base.error.js";

/**
 * 400: 올바르지 않은 Arguments 입력 (SESSION_400_01)
 */
export class SelfFriendRequestError extends BadRequestError {
  constructor(code = "FRIEND_SELFREQUEST_ERROR", message = "자기 자신과는 친구 신청을 할 수 없습니다.", data = null) {
    super(code, message, data);
  }
}

export class SessionParticipantNotFoundError extends NotFoundError {
  constructor(code = "SESSION_PARTICIPANTNOTFOUND_ERROR", message = "존재하지 않는 세션 참가자입니다.", data = null) {
        super(code, message, data);
  }
}

/**
 * 500: 세션 처리 중 서버 오류 (SESSION_500_01)
 */
export class SessionInternalError extends InternalServerError {
  constructor(code = "SESSION_INTERNALSERVER_ERROR", message = "친구 처리 중 서버 오류가 발생했습니다.", data = null) {
        super(code, message, data);
  }
}

export class MaxTurnIsOver extends BadRequestError {
  constructor(code = "SESSION_TURNOVER_ERROR", message = "편지 주고 받은 횟수가 10번이 되었습니다.", data = null) {
        super(code, message, data);
  }
}

/**
 * 404: 세션을 찾을 수 없음 (SESSION_404_02)
 */
export class SessionNotFoundError extends NotFoundError {
  constructor(code = "SESSION_NOTFOUND_ERROR", message = "세션을 찾을 수 없습니다.", data = null) {
        super(code, message, data);
  }
}

/**
 * 500: 세션 개수 초과 (SESSION_500_03)
 */
export class SessionCountOverError extends InternalServerError {
  constructor(code = "SESSION_COUNTOVER_ERROR", message = "세션이 10개 이상입니다.", data = null) {
        super(code, message, data);
  }
}

export class SessionFullError extends NotFoundError {
  constructor(code = "SESSION_FULL_ERROR", message = "세션을 맺을 유저가 없습니다.", data = null) {
        super(code, message, data);
  }
}

export class UnExpectTagError extends BadRequestError {
  constructor(code = "SESSION_WRONGTAG_ERROR", message = "잘못된 리뷰 태그 입력입니다.", data = null){
    super(code, message, data);
  }
}

export class TemperatureRangeError extends BadRequestError {
  constructor(code = "SESSION_SCORERANGE_ERROR", message = "온도 입력 범위 오류입니다.", data = null){
    super(code, message, data);
  }
}
