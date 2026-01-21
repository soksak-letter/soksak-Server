import { BadRequestError, NotFoundError } from "./base.error.js";

export class LetterBadRequest extends BadRequestError {
    constructor(code, message, data = null) {
        super(code, message, data);
    }
}

export class LetterNotFound extends NotFoundError {
    constructor(code, message, data = null) {
        super(code, message, data);
    }
}