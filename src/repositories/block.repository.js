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
            blockedUserId: true,
            createdAt: true,
        }
    })
}

export const findBlockByTargetUserId = async(blockedUserId) => {
    return await prisma.block.findFirst({
        where: {
            blockedUserId
        }
    })
}