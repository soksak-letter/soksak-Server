import { BadRequestError, unauthorizedError } from "./base.error.js";

// ========== Mailbox Errors ==========
export class MailboxUnauthorizedError extends unauthorizedError {
  constructor(code = "MAILBOX_UNAUTHORIZED", message = "인증이 필요합니다.", data = null) {
    super(code, message, data);
  }
}

export class MailboxInvalidSessionIdError extends BadRequestError {
  constructor(code = "MAILBOX_INVALID_SESSION_ID", message = "sessionId가 올바르지 않습니다.", data = null) {
    super(code, message, data);
  }
}
