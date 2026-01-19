export class ConsentError extends Error {
    constructor({ status = 400, code = "CONSENT_ERROR", message = "정보 동의 오류" }) {
      super(message);
      this.status = status;
      this.code = code;
    }
  }
  
  export const CONSENT_ERRORS = {
    UNAUTHORIZED: new ConsentError({
      status: 401,
      code: "UNAUTHORIZED",
      message: "인증이 필요합니다.",
    }),
    INVALID_BODY: new ConsentError({
      status: 400,
      code: "INVALID_BODY",
      message: "요청 바디가 올바르지 않습니다. (termsAgreed/privacyAgreed/marketingAgreed/ageOver14Agreed 중 일부 boolean)",
    }),
  };
  