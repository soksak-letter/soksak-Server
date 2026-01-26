import { BadRequestError, InternalServerError } from "./base.error.js"

export class ReportInternalError extends InternalServerError {
  constructor(code = "REPORT_INTERNAL_ERROR", message="db 에러입니다.", data = null) {
    super(code, message, data); 
  }
}

export class UnExpectedReportReasonError extends BadRequestError {
  constructor(code = "REPORT_UNEXPECTEDREASON_ERROR", message="잘못된 report reason입니다.", data = null) {
    super(code, message, data);
  }
}