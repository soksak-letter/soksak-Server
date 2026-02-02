import { prisma } from "../configs/db.config.js";

export const findQuestionByDate = async ({startTime, endTime}) => {
    const question = await prisma.dailyQuestion.findFirst({
        where: {
            day: {
                gte: startTime,
                lte: endTime
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