// errors/weeklyReport.error.js

export class BaseError extends Error {
  constructor(message, status, errorCode, data = null) {
    super(message);
    this.status = status;
    this.errorCode = errorCode;
    this.reason = message;
    this.data = data;
  }
}

/**
 * 404: 주간 리포트가 존재하지 않음 (WEEKLY_REPORT_404_01)
 * - findFirst / update / delete 시 P2025
 */
export class WeeklyReportNotFoundError extends BaseError {
  constructor(data = null, message = "주간 리포트를 찾을 수 없습니다.") {
    super(message, 404, "WEEKLY_REPORT_404_01", data);
  }
}

/**
 * 409: 이미 해당 주간 리포트가 존재함 (WEEKLY_REPORT_409_01)
 * - create 시 unique 제약(P2002)
 */
export class WeeklyReportAlreadyExistsError extends BaseError {
  constructor(data = null, message = "이미 해당 주차의 주간 리포트가 존재합니다.") {
    super(message, 409, "WEEKLY_REPORT_409_01", data);
  }
}

/**
 * 500: 주간 리포트 처리 중 서버 오류 (WEEKLY_REPORT_500_01)
 */
export class WeeklyReportInternalError extends BaseError {
  constructor(data = null, message = "주간 리포트 처리 중 서버 오류가 발생했습니다.") {
    super(message, 500, "WEEKLY_REPORT_500_01", data);
  }
}


export class UnExpectArgumentsError extends BaseError {
    constructor(data = null, message = "잘못된 argument 입력입니다.") {
        super(message, 404, "WEEKLYREPORT_404_02", data);
    }
}