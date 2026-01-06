import { prisma } from "../db.config.js";

export async function insertBlockedUser(blockerId, blockedId) {
    return await prisma.block.create({
        data: {
            blockerId: blockerId,
            blockedId: blockedId,
        },
    });
}