import { createLetter, getLetterDetail } from "../repositories/letter.repository.js"
import { findUserById } from "../repositories/user.repository.js";

export const getLetter = async (id) => {
    const letter = await getLetterDetail(id);
    if(!letter) throw new Error("작성되지 않은 편지입니다.");
    
    return letter;
}

export const sendLetterToMe = async (userId, data) => {
    await createLetter({
        letter: {
            senderUserId: userId,
            letterType: "TO_ME",
            questionId: data.questionId,
            title: data.title,
            contentCipher: data.content,
            isPublic: data.isPublic,
            scheduledAt: data.scheduledAt,
            status: "PENDING"
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

export const sendLetterToOther = async (userId, data) => {
    const receiver = await findUserById(data.receiverUserId);
    if(!receiver) throw new Error("존재하지 않는 유저입니다.");
    if(userId === receiver.id) throw new Error("전송하는 유저와 전달받는 유저의 id가 같습니다");

    await createLetter({
        letter: {
            senderUserId: userId,
            receiverUserId: data.receiverUserId,
            letterType: "TO_OTHER",
            questionId: data.questionId,
            title: data.title,
            contentCipher: data.content,
            isPublic: data.isPublic,
            status: "DELIVERED",
            deliveredAt: new Date()
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