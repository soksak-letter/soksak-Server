import { ConflictError, InternalServerError } from "./base.error.js";

export class BlockInternalServerError extends InternalServerError {
    constructor(code = "BLOCK_INTERNALSERVER_ERROR", message = "서버 에러가 발생하였습니다.", data = null){
        super(code, message, data);
    }
}

export class BlockAlreadyExistsError extends ConflictError {
    constructor(code = "BLOCK_ALREADYEXISTS_ERROR", message = "이미 차단된 유저입니다.", data = null){
        super(code, message, data);
    }
}