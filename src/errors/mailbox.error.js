import { BadRequestError, unauthorizedError } from "./base.error.js";

// ========== Mailbox Errors ==========
export class MailboxUnauthorizedError extends unauthorizedError {
  constructor(code = "MAILBOX_401_01", message = "인증이 필요합니다.", data = null) {
    super(code, message, data);
  }
}

export class MailboxInvalidThreadIdError extends BadRequestError {
  constructor(code = "MAILBOX_400_01", message = "threadId가 올바르지 않습니다.", data = null) {
    super(code, message, data);
  }
}
