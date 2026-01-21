import { NotFoundError } from "./base.error.js";

export class QuestionNotFoundError extends NotFoundError {
    constructor(code, message, data = null) {
        super(code, message, data);
    }
}