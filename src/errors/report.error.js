import { BadRequestError, InternalServerError } from "./base.error.js"

export class ReportUnexpectedArgumentError extends BadRequestError {
  constructor(message="잘못된 인자 입력입니다.") {
    super(message, 400, "REPORT_400_1", data)
  }
}

export class ReportInternalError extends BadRequestError {
  constructor(message="db 에러입니다.") {
    super(message, 500, "REPORT_500_1", data) 
  }
}

export class UnExpectedReportReasonError extends InternalServerError {
  constructor(message="잘못된 report reason입니다.") {
    super(message, 400, "REPORT_400_02", data)
  }
}