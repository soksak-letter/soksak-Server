// errors/weeklyReport.error.js
import { NotFoundError, ConflictError, InternalServerError, BadRequestError } from "./base.error.js";

/**
 * 404: 주간 리포트가 존재하지 않음 (WEEKLY_REPORT_404_01)
 * - findFirst / update / delete 시 P2025
 */
export class WeeklyReportNotFoundError extends NotFoundError {
  constructor(code = "WEEKLYREPORT_NOTFOUND_ERROR", message = "주간 리포트를 찾을 수 없습니다.", data = null) {
    super(code, message, data);
  }
}

/**
 * 409: 이미 해당 주간 리포트가 존재함 (WEEKLY_REPORT_409_01)
 * - create 시 unique 제약(P2002)
 */
export class WeeklyReportAlreadyExistsError extends ConflictError {
  constructor(code = "WEEKLYREPORT_ALREADYEXISTS_ERROR", message = "이미 해당 주차의 주간 리포트가 존재합니다.", data = null) {
    super(code, message, data);
  }
}

/**
 * 500: 주간 리포트 처리 중 서버 오류 (WEEKLY_REPORT_500_01)
 */
export class WeeklyReportInternalError extends InternalServerError {
  constructor(code = "WEEKLYREPORT_500", message = "주간 리포트 처리 중 서버 오류가 발생했습니다.", data = null) {
    super(code, message, data);
  }
}


export class UnExpectArgumentsError extends BadRequestError {
    constructor(code = "WEEKLYREPORT_UNEXPECTEDARGS_ERROR", message = "잘못된 argument 입력입니다.", data = null) {
        super(code, message, data);
    }
}