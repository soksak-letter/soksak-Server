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

export class BlockInternalError extends BaseError {
  constructor(data = null, message = "차단 처리 중 오류가 발생했습니다.") {
    super(message, 500, "BLOCK_500", data);
  }
}