// errors/report.error.js

// 기본 에러 클래스
export class BaseError extends Error {
  constructor({
    message,
    status,
    errorCode,
    data = null,
  }) {
    super(message);
    this.status = status;
    this.errorCode = errorCode;
    this.reason = message;
    this.data = data;
  }
}

export class ReportUnexpectedArgumentError extends BaseError {
  constructor(message="잘못된 인자 입력입니다.") {
    super(message, 400, "REPORT_400_1", data)
  }
}

export class ReportInternalError extends BaseError {
  constructor(message="db 에러입니다.") {
    super(message, 500, "REPORT_500_1", data) 
  }
}

export class UnExpectedReportReasonError extends BaseError {
  constructor(message="잘못된 report reason입니다.") {
    super(message, 400, "REPORT_400_02", data)
  }
}