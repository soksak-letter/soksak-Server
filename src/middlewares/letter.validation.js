import validator from "validator"

class BaseLetterValidator {
    errors = [];

    constructor(data) {
        this.questionId = data.questionId;
        this.title = data.title;
        this.content = data.content;
        this.isPublic = data.isPublic;
        this.paperId = data.paperId;
        this.stampId = data.stampId;
        this.fontId = data.fontId;

        this.validateBase();
    }

    validateBase() {
        const requireFields = ["questionId", "title", "content", "isPublic", "paperId", "stampId", "fontId"];

        for(const field of requireFields){
            if (!this[field]) {
                this.errors.push(`${field} 필드는 필수입니다.`);
            }
        }
        if(this.title && (this.title.length < 3 || this.title.length > 20)) this.errors.push(`제목은 최소 3자, 최대 20자까지 입니다.`);
        if(this.content && this.content.length > 500) this.errors.push(`본문은 최대 500자까지 입니다.`);
        if(this.questionId < 1 || this.paperId < 1 || this.stampId < 1 || this.fontId < 1) this.errors.push(`id는 1부터 유효합니다.`);
    }
}

export class LetterToMeValidator extends BaseLetterValidator {
    constructor(data){
        super(data);
        this.scheduledAt = data.scheduledAt;

        this.validateToMe();
    }

    validateToMe(){
        if(!this.scheduledAt){
            this.errors.push(`scheduledAt 필드는 필수입니다.`);
        }
        if (this.scheduledAt && !validator.isISO8601(String(this.scheduledAt))) {
            this.errors.push("올바른 날짜 형식이 아닙니다. (ISO8601 형식이 필요합니다)");
        }
        if (this.scheduledAt && !validator.isAfter(String(this.scheduledAt))) {
            this.errors.push("예약 시간은 현재 시간보다 미래여야 합니다.");
        }
        
        if(this.errors.length > 0) throw new Error(this.errors);
    }
}

export class LetterToOtherValidator extends BaseLetterValidator{
    constructor(data){
        super(data);
        this.receiverUserId = data.receiverUserId;

        this.validateToOther();
    }

    validateToOther(){
        if(!this.receiverUserId){
            this.errors.push(`receiverUserId 필드는 필수입니다.`);
        }
        if(!this.receiverUserId && this.receiverUserId < 1){
            this.errors.push(`id는 1부터 유효합니다.`);
        }

        if(this.errors.length > 0) throw new Error(this.errors);
    }
}