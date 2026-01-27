import { NotFoundError } from "./base.error.js";

export class QuestionNotFoundError extends NotFoundError {
    constructor(code = "QUESTION_NOTFOUND_ERROR", message = "질문을 찾을 수 없습니다.", data = null) {
        super(code, message, data);
    }
}