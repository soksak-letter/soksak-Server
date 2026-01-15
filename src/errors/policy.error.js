export class PolicyNotFoundError extends Error {
    constructor(key) {
      super(`해당 정책 문서를 찾을 수 없습니다. key=${key}`);
      this.name = "PolicyNotFoundError";
      this.statusCode = 404;
      this.code = "POLICY_NOT_FOUND";
    }
  }
  