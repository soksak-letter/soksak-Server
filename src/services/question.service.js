import { QuestionNotFoundError } from "../errors/question.error.js";
import { findQuestionByDate } from "../repositories/question.repository.js";
import { getDayStartAndEnd } from "../utils/date.util.js";

export const getTodayQuestion = async (date) => {
    const {startTime, endTime} = getDayStartAndEnd(date);
    
    const todayQuestion = await findQuestionByDate({startTime, endTime});
    if(!todayQuestion) throw new QuestionNotFoundError(undefined, "오늘의 질문이 없습니다.");
    
    return {
        id: todayQuestion.questionId,
        content: todayQuestion.question.content,
        expiredAt: endTime
    }
}
