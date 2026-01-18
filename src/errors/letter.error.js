export class LetterBadRequest extends BadRequestError {
    constructor(code, message, data = null) {
        super(code, message, data);
    }
}