import { prisma } from "../configs/db.config.js";

export const createInquiryAsUser = async(userId, title, content) => {
    const result = await prisma.inquiry.create({
        data: {
            category: "INQUIRY",
            status: "PENDING",
            content,
            title,
            user: {
                connect: { id: userId }
            }
        }
    })
    return result;
}

export const createInquiryAsAdmin = async(id, answerContent) => {
    const now = new Date();
    const result = await prisma.inquiry.updateMany({
        where: {
            id
        },
        data: {
            answerContent,
            answeredAt: now,
            status: "FINISHED"
        }
    })
    return result;
}

export const findInquiryByUserId = async(userId) => {
    const result = await prisma.inquiry.findMany({
        where: { userId },
        select : {
            id: true,
            title: true,
            content: true,
            answerContent: true,
            createdAt: true,
            status: true,
        }
    })
    return result;
}

export const findInquiryDetail = async(userId, id) => {
    return await prisma.inquiry.findFirst({
        where: {
            userId,
            id,
        }
    })
}

export const findInquiryById = async(id) => {
    return await prisma.inquiry.findFirst({
        where: {
            id
        }
    })
}