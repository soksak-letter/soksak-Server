import { UserNotFoundError } from "../errors/user.error.js";
import { DuplicatedValueError } from "../errors/base.error.js";
import { selectAllFriendsByUserId } from "../repositories/friend.repository.js";
import { countLetterStatsForWeek, countTotalSentLetter, createLetter, getLetterDetail, getPublicLetters } from "../repositories/letter.repository.js"
import { createLetterLike, deleteLetterLike, findLetterLike } from "../repositories/like.repository.js";
import { findRandomUserByPool, findUserById } from "../repositories/user.repository.js";
import { getMonthAndWeek, getWeekStartAndEnd } from "../utils/date.util.js";
import { getLevelInfo } from "../utils/planetConstants.js";
import { blockBadWordsInText } from "../utils/profanity.util.js";
import { LetterBadRequest, LetterNotFound } from "../errors/letter.error.js";
import { findLetterAssets } from "../repositories/asset.repository.js";
import { countMatchingSessionByUserId, decrementSessionTurn, existsMatchingSession, updateMatchingSessionToChating } from "../repositories/session.repository.js";
import { createMatchingSession } from "./session.service.js";
import { QuestionNotFoundError } from "../errors/question.error.js";
import { findQuestionByQuestionId } from "../repositories/question.repository.js";
import { prisma } from "../configs/db.config.js";
import { MaxTurnIsOver, SessionCountOverError, SessionNotFoundError } from "../errors/session.error.js";

export const getLetter = async (id) => {
    const letter = await getLetterDetail(id);
    if(!letter) throw new LetterNotFound("LETTER_NOT_FOUND", "작성되지 않은 편지입니다.");
    
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
        if (!data.receiverUserId) throw new SessionNotFoundError("SESSION_CANDIDATE_NOT_FOUND", "채팅할 수 있는 상대가 없습니다.");
    }

    const count = await countMatchingSessionByUserId(userId);
    if(count >= 10) throw new MaxTurnIsOver("SESSION_MAX_TURN", "편지를 주고 받은 횟수가 10번이 되었습니다.");

    const question = await findQuestionByQuestionId(data.questionId);
    if(question == null) throw new QuestionNotFoundError("QUESTION_NOT_FOUND", "해당 질문을 찾을 수 없습니다.");

    const receiver = await findUserById(data.receiverUserId);
    if(!receiver) throw new UserNotFoundError("USER_NOT_FOUND", "해당 정보로 가입된 계정을 찾을 수 없습니다.", "id");
    if(userId === receiver.id) throw new DuplicatedValueError("USER_DUPLICATED_ID", "전송하는 유저와 전달받는 유저의 ID가 같습니다", "id");

    const isProfane = blockBadWordsInText(data.content);
    if(isProfane) throw new LetterBadRequest("LETTER_BAD_WORD", "부적절한 단어가 포함되어있습니다.");

    let session = await existsMatchingSession(userId, data.receiverUserId, data.questionId);
    const letterId = await prisma.$transaction(async (tx) => {
        // 친구는 아닌데 비활성화 세션일 때
        if(session?.status === "PENDING") {
            await updateMatchingSessionToChating(session.id, tx)
            await decrementSessionTurn(session.id, tx);
        }

        // 친구는 아닌데 채팅중일 때
        if(session?.status === "CHATING") {
            await decrementSessionTurn(session.id, tx);
        }
        
        // 친구도 아니고 채팅중도 아닐 때
        if(!session){
            session = await createMatchingSession(userId, data.receiverUserId, data.questionId, tx);
            await decrementSessionTurn(session.id, tx);
        }

        const letterId = await createLetter({
            letter: {
                senderUserId: userId,
                receiverUserId: data.receiverUserId,
                sessionId: session.id,
                letterType: "TO_OTHER",
                questionId: data.questionId,
                title: data.title,
                content: data.content,
                isPublic: data.isPublic,
                status: "DELIVERED",
                deliveredAt: new Date()
            },
            design: {
                paperId: data.paperId,
                stampId: data.stampId,
                fontId: data.fontId
            }
        }, tx);

        return letterId
    })

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

export const getPublicLetterFromOther = async (userId, isDetail) => {
    const friends = await selectAllFriendsByUserId(userId);
    const friendIds = friends.map(friend => friend.friendUserId);

    const letters = await getPublicLetters({ids: [...friendIds, userId], userId, isDetail});

    return letters;
}

export const getPublicLetterFromFriend = async (userId, isDetail) => {
    const friends = await selectAllFriendsByUserId(userId);
    const friendIds = friends.map(friend => friend.friendUserId);

    const letters = await getPublicLetters({ids: [...friendIds], userId, isFriendOnly: true, isDetail});

    return letters;
}

export const getUserLetterStats = async (userId) => {
    const today = new Date();

    const {weekStart, weekEnd} = getWeekStartAndEnd(today);
    const counts = await countLetterStatsForWeek({userId, weekStart, weekEnd});
    const totalSentCount = await countTotalSentLetter(userId);

    const {month, week} = getMonthAndWeek(today);

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