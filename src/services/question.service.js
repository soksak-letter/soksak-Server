import { QuestionNotFoundError } from "../errors/question.error.js";
import { findQuestionByDate } from "../repositories/question.repository.js";

export const getTodayQuestion = async () => {
    const today = new Date();
    const todayQuestion = await findQuestionByDate(today);
    if(!todayQuestion) throw new QuestionNotFoundError(undefined, "오늘의 질문이 없습니다.");
    
    todayQuestion.day.setHours(23, 59, 59, 999)
    
    return {
        id: todayQuestion.questionId,
        content: todayQuestion.question.content,
        expiredAt: todayQuestion.day
    }
}
