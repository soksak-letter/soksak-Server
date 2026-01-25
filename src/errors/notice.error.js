import { BadRequestError, NotFoundError } from "./base.error.js";

// ========== Notice Errors ==========
export class NoticeNotFoundError extends NotFoundError {
  constructor(code = "NOTICE_NOT_FOUND", message = "해당 공지사항을 찾을 수 없습니다.", data = null) {
    super(code, message, data);
  }
}

export class InvalidNoticeIdError extends BadRequestError {
  constructor(code = "NOTICE_INVALID_ID", message = "noticeId는 양의 정수여야 합니다.", data = null) {
    super(code, message, data);
  }
}
