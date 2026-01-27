import { InternalServerError } from "./base.error.js";

export class RestrictInternalError extends InternalServerError{
    constructor(code = "RESTRICT_INTERNALSERVER_ERROR", message = "서버 오류가 발생하였습니다.", data = null){
        super(code, message, data);
    }
}