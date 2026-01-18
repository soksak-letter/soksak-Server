import { prisma } from "../configs/db.config.js";

export const createLetterLike = async ({userId, letterId}) => {
    await prisma.letterLike.create({
        data:{
            letterId: letterId,
            userId: userId
        }
    });
}

export const deleteLetterLike = async ({userId, letterId}) => {
    await prisma.letterLike.delete({
        where: {
            letterId_userId: {
                letterId: letterId,
                userId: userId
            }
        }
    });
}

export const findLetterLike = async ({userId, letterId}) => {
    const isLiked = await prisma.letterLike.findFirst({
        where: {
            letterId: letterId,
            userId: userId
        }
    })

    return isLiked;
}

export const countLetterLike = async (letterId) => {
    const likes = await prisma.letterLike.count({
        where: {
            letterId: letterId
        }
    })

    return likes;
}