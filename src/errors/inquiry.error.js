import { BadRequestError, ConflictError, InternalServerError, NotFoundError } from "./base.error.js";

export class InquiryAlreadyExistsError extends ConflictError {
    constructor(
        code = "INQUIRY_ALREADYEXISTS_ERROR",
        message = "이미 존재하는 문의입니다.",
        data = null
    ) {
        super(code, message, data);
    }
}

export class InquiryBadRequestError extends BadRequestError {
    constructor(
        code = "INQUIRY_BADREQUEST_ERROR",
        message = "대상이 존재하지 않습니다.",
        data = null
    ) {
        super(code, message, data)
    }
}

export class InquiryNotFoundError extends NotFoundError {
    constructor(
        code = "INQUIRY_NOTFOUND_ERROR",
        message = "대상이 존재하지 않습니다.",
        data = null
    ) {
        super(code, message, data)
    }
}

export class InquiryInternalError extends InternalServerError {
    constructor(
        code = "INQUIRY_INTERNALSERVER_ERROR",
        message = "문의 생성 중 서버 오류가 발생하였습니다.",
        data = null
    ) {
        super(code,  message, data)
    }
}
