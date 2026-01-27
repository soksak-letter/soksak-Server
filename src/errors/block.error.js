import { InternalServerError } from "./base.error.js";

export class BlockInternalServerError extends InternalServerError {
    constructor(code = "BLOCK_INTERNALSERVER_ERROR", message = "서버 에러가 발생하였습니다.", data = null){
        super(code, message, data);
    }
}