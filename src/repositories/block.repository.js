import { prisma } from "../configs/db.config.js";

export const insertUserBlock = async(blockerUserId, blockedUserId) => {
    const block = await prisma.block.create({
        data: {
            blockerUserId,
            blockedUserId
        }
    })
    if(block == null) return false;
    return true;
}

export const findBlockByUserId = async(blockerUserId) => {
    return await prisma.block.findMany({
        where: {
            blockerUserId
        },
        select: {
            blockeruserId: true,
            createdAt: true,
        }
    })
}