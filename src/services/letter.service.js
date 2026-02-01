import { UserNotFoundError } from "../errors/user.error.js";
import { DuplicatedValueError } from "../errors/base.error.js";
import { findFriendById, selectAllFriendsByUserId } from "../repositories/friend.repository.js";
import { countLetterStatsForWeek, countTotalSentLetter, createLetter, getLetterDetail, getPublicLetters, updateLetter } from "../repositories/letter.repository.js"
import { createLetterLike, deleteLetterLike, findLetterLike } from "../repositories/like.repository.js";
import { findRandomUserByPool, findUserByIdForProfile } from "../repositories/user.repository.js";
import { getDayStartAndEnd, getMonthAndWeek, getToday, getWeekStartAndEnd } from "../utils/date.util.js";
import { getLevelInfo } from "../constants/planet.constant.js";
import { blockBadWordsInText } from "../utils/profanity.util.js";
import { LetterBadRequest, LetterNotFound } from "../errors/letter.error.js";
import { findLetterAssets } from "../repositories/asset.repository.js";
import { countMatchingSessionWhichChating, decrementSessionTurn, existsMatchingSession, updateMatchingSessionToChating } from "../repositories/session.repository.js";
import { createMatchingSession } from "./session.service.js";
import { QuestionNotFoundError } from "../errors/question.error.js";
import { findQuestionByQuestionId } from "../repositories/question.repository.js";
import { prisma } from "../configs/db.config.js";
import { SessionCountOverError, SessionNotFoundError } from "../errors/session.error.js";
import { sendPushNotification } from "./push.service.js";

export const getLetter = async ({userId, letterId}) => {
    const {letter, receiverUserId, senderUserId, readAt} = await getLetterDetail(letterId);
    if(!letter) throw new LetterNotFound("LETTER_NOT_FOUND", "작성되지 않은 편지입니다.");

    if(userId == receiverUserId && !readAt) {
        await updateLetter({id: letter.id, data: { readAt: new Date() }});

        const friend = await findFriendById(receiverUserId);

        await sendPushNotification({
            userId: senderUserId, 
            type: "READ_CONFIRMATION",
            data: {
                isFriend: !!friend,
                nickname: friend?.nickname
            }
        });

    }

    return letter;
}

export const sendLetterToMe = async (userId, data) => {
    const question = await findQuestionByQuestionId(data.questionId);
    if(question == null) throw new QuestionNotFoundError("QUESTION_NOT_FOUND", "해당 질문을 찾을 수 없습니다.");
    
    const isProfane = blockBadWordsInText(data.content);
    if(isProfane) throw new LetterBadRequest("LETTER_BAD_WORD", "부적절한 단어가 포함되어있습니다.");

    const letterId = await createLetter({
        letter: {
            senderUserId: userId,
            letterType: "TO_ME",
            questionId: data.questionId,
            title: data.title,
            content: data.content,
            isPublic: data.isPublic,
            scheduledAt: data.scheduledAt,
            status: "PENDING"
        },
        design: {
            paperId: data.paperId,
            stampId: data.stampId,
            fontId: data.fontId
        }
    });

    const letter = await getLetterDetail(letterId);
    return { letter };
}

export const sendLetterToOther = async (userId, data) => {
    if(!data?.receiverUserId) {
        data.receiverUserId = await findRandomUserByPool(userId);
    }

    const question = await findQuestionByQuestionId(data.questionId);
    if(question == null) throw new QuestionNotFoundError("QUESTION_NOT_FOUND", "해당 질문을 찾을 수 없습니다.");

    const isProfane = blockBadWordsInText(data.content);
    if(isProfane) throw new LetterBadRequest("LETTER_BAD_WORD", "부적절한 단어가 포함되어있습니다.");
    
    let session = null;
    let receiver = null;
    if(data.receiverUserId) {
        receiver = await findUserByIdForProfile(data.receiverUserId);
        if(!receiver) throw new UserNotFoundError("USER_NOT_FOUND", "해당 정보로 가입된 계정을 찾을 수 없습니다.", "id");
        if(userId === receiver.id) throw new DuplicatedValueError("USER_DUPLICATED_ID", "전송하는 유저와 전달받는 유저의 ID가 같습니다", "id");

        session = await existsMatchingSession(userId, data.receiverUserId);
    }

    const letterId = await prisma.$transaction(async (tx) => {
        if(data.receiverUserId) {
            // 친구는 아닌데 비활성화 세션일 때
            if(session?.status === "PENDING") {
                await updateMatchingSessionToChating(session.id, tx)
                session.status = "CHATING";
            }

            // 친구는 아닌데 채팅중일 때
            if(session?.status === "CHATING") {
                await decrementSessionTurn(session.id, tx);
            }
            
            // 친구도 아니고 채팅중도 아닐 때
            if(!session){
                const count = await countMatchingSessionWhichChating(userId);
                if(count >= 10) throw new SessionCountOverError("SESSION_COUNTOVER_ERROR", "세션이 10개 이상입니다.");

                session = await createMatchingSession(userId, data.receiverUserId, data.questionId, tx);
                await decrementSessionTurn(session.id, tx);
            }
        }

        const letterId = await createLetter({
            letter: {
                senderUserId: userId,
                receiverUserId: data.receiverUserId || null,
                sessionId: session?.id || null,
                letterType: "TO_OTHER",
                questionId: data.questionId,
                title: data.title,
                content: data.content,
                isPublic: data.isPublic,
                status: data.receiverUserId ? "DELIVERED" : "QUEUED",
                deliveredAt: data.receiverUserId ? new Date() : null
            },
            design: {
                paperId: data.paperId,
                stampId: data.stampId,
                fontId: data.fontId
            }
        }, tx);

        return letterId
    })
    console.log(session);

    // 매칭잡혔을 때 푸시알림 전송
    if (data.receiverUserId) {  
        await sendPushNotification({
            userId: data.receiverUserId, 
            type: "NEW_LETTER",
            data: {
                nickname: receiver.nickname,
                status: session.status
            }
        });
    }

    const letter = await getLetterDetail(letterId);

    return { letter };
}

export const addLetterLike = async ({userId, letterId}) => {
    const isLiked = await findLetterLike({userId, letterId});
    if(isLiked) throw new DuplicatedValueError("LIKE_ALREADY_LIKED", "이미 좋아요를 눌렀습니다."); 

    await createLetterLike({userId, letterId});

    return {
        letterId,
        isLiked: true
    }
}

export const removeLetterLike = async ({userId, letterId}) => {
    const isLiked = await findLetterLike({userId, letterId});
    if(!isLiked) throw new DuplicatedValueError("LIKE_ALREADY_UNLIKED", "이미 좋아요를 누르지 않았습니다."); 

    await deleteLetterLike({userId, letterId});

    return {
        letterId,
        isLiked: false
    }
}

export const getPublicLetterFromOther = async ({userId, date, isDetail}) => {
    const friends = await selectAllFriendsByUserId(userId);
    const friendIds = friends.map(friend => friend.friendUserId);

    const {startTime, endTime} = getDayStartAndEnd(date);

    const letters = await getPublicLetters({ids: [...friendIds], userId, startTime, endTime, isDetail});

    return letters;
}

export const getPublicLetterFromFriend = async ({userId, date, isDetail}) => {
    const friends = await selectAllFriendsByUserId(userId);
    const friendIds = friends.map(friend => friend.friendUserId);

    const {startTime, endTime} = getDayStartAndEnd(date);

    const letters = await getPublicLetters({ids: [...friendIds], userId, isFriendOnly: true, startTime, endTime, isDetail});

    return letters;
}

export const getUserLetterStats = async (userId, date) => {
    const {weekStart, weekEnd} = getWeekStartAndEnd(date);
    const today = getToday(date);

    const counts = await countLetterStatsForWeek({userId, weekStart, weekEnd});
    const totalSentCount = await countTotalSentLetter(userId, today);

    const {month, week} = getMonthAndWeek(date);

    const info = getLevelInfo(totalSentCount);

    return {
        "reportPeriod": `${month}월 ${week}주차`,
        "stats": {
            "receivedCount": counts.receivedCount,
            "sentCount": counts.sentCount,
            "totalSentCount": totalSentCount
        },
        message: info.fullMessage
    }
}

export const getLetterAssets = async () => {
    const assets = await findLetterAssets();

    return assets;
}