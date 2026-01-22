import { BadRequestError, NotFoundError, InternalServerError } from "./base.error.js";

/**
 * 400: 올바르지 않은 Arguments 입력 (SESSION_400_01)
 */
export class UnExpectArgumentsError extends BadRequestError {
  constructor(
    code = "SESSION_400_01",
    message = "올바르지 않은 Arguments 입력입니다.",
    data = null
  ) {
    super(code, message, data);
  }
}

/**
 * 404: 존재하지 않는 세션 참가자 (SESSION_404_01)
 */
export class SessionParticipantNotFoundError extends NotFoundError {
  constructor(
    code = "SESSION_404_01",
    message = "존재하지 않는 세션 참가자입니다.",
    data = null
  ) {
    super(code, message, data);
  }
}

/**
 * 500: 세션 처리 중 서버 오류 (SESSION_500_01)
 */
export class SessionInternalError extends InternalServerError {
  constructor(
    code = "SESSION_500_01",
    message = "세션 처리 중 서버 오류가 발생했습니다.",
    data = null
  ) {
    super(code, message, data);
  }
}

/**
 * 500: 편지 주고 받은 횟수 초과 (SESSION_500_02)
 */
export class MaxTurnIsOver extends InternalServerError {
  constructor(
    code = "SESSION_500_02",
    message = "편지 주고 받은 횟수가 10번이 되었습니다.",
    data = null
  ) {
    super(code, message, data);
  }
}

/**
 * 404: 세션을 찾을 수 없음 (SESSION_404_02)
 */
export class SessionNotFoundError extends NotFoundError {
  constructor(
    code = "SESSION_404_02",
    message = "세션을 찾을 수 없습니다.",
    data = null
  ) {
    super(code, message, data);
  }
}

/**
 * 500: 세션 개수 초과 (SESSION_500_03)
 */
export class SessionCountOverError extends InternalServerError {
  constructor(
    code = "SESSION_500_03",
    message = "세션이 10개 이상입니다.",
    data = null
  ) {
    super(code, message, data);
  }
}
