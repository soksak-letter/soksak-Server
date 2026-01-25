import { BadRequestError, InternalServerError } from "./base.error.js"

export class UnexpectedArgumentError extends BadRequestError {
  constructor(code = "REPORT_400_01", message = "잘못된 인자 입력입니다.", data=null) {
    super (code, message, data);
  }
}

export class ReportInternalError extends BadRequestError {
  constructor(code = "REPORT_500_01", message = "신고 처리 중 서버 에러가 발생하였습니다.", data=null) {
    super (code, message, data);
  }
}

export class UnExpectedReportReasonError extends InternalServerError {
  constructor(code = "REPORT_400_02", message = "잘못된 신고 이유 입력입니다.", data=null) {
    super (code, message, data);
  }
}