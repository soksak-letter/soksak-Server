import { BadRequestError, NotFoundError } from "./base.error.js";

export class LetterBadRequest extends BadRequestError {
    constructor(code, message, data = null) {
        super(code, message, data);
    }
}

export class LetterNotFoundError extends NotFoundError {
    constructor(message="편지를 찾을 수 없습니다.") {
        super(message, 404, "LETTER_404_01", null);
    }
}

export class LetterNotFound extends NotFoundError {
    constructor(code, message, data = null) {
        super(code, message, data);
    }
}