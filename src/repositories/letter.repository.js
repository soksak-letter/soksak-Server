import { prisma } from "../configs/db.config.js";

// senderUserId = receiverUserId, letterType, questionId, title, contentCipher, isPublic, status, scheduledAt 필수 deliveredAt, readAt은 scheduledAt에 따라서
export const createLetter = async ({letter, design}) => {
    await prisma.letter.create({
        data: {
            ...letter,
            design: {
                ...design
            }
        }
    });
}