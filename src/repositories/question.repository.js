import { prisma } from "../configs/db.config.js";

export const findQuestionByDate = async (date) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const question = await prisma.dailyQuestion.findFirst({
        where: {
            day: {
                gte: start,
                lte: end
            }
        },
        include: {
            question: true
        }
    })

    return question;
}

export const findQuestionByQuestionId = async(id) => {
    const result = prisma.question.findFirst({
        where: {
            id
        },
        select: {
            id: true
        }
    })

    return result;
}