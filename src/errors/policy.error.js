import { NotFoundError } from "./base.error.js";

// ========== Policy Errors ==========
export class PolicyNotFoundError extends NotFoundError {
  constructor(code = "POLICY_NOT_FOUND", message = "해당 정책 문서를 찾을 수 없습니다.", data = null) {
    super(code, message, data);
  }
}
