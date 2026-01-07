import { createMyLetter } from "../repositories/letter.repository.js"

export const sendLetterToMe = async (userId, data) => {
    let status, deliveredAt;

    if(data.scheduledAt){
        status = "PENDING";
        deliveredAt = null;
    }
    else{
        status = "DELIVERED";
        deliveredAt = new Date();
    }

    await createMyLetter({
        letter: {
            senderUserId: userId,
            letterType: "TO_ME",
            questionId: data.questionId,
            title: data.title,
            contentCipher: data.content,
            isPublic: data.isPublic,
            scheduledAt: data.scheduledAt,
            status: status,
            deliveredAt: deliveredAt,
        },
        design: {
            create: {
                paperId: data.paperId,
                stampId: data.stampId,
                fontId: data.fontId
            }
        }
    });

    return { status: "success" };
}
