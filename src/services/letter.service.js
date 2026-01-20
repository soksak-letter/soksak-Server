import { UserNotFoundError } from "../errors/user.error.js";
import { DuplicatedValueError } from "../errors/base.error.js";
import { selectAllFriendsByUserId } from "../repositories/friend.repository.js";
import { countLetterStatsForWeek, countTotalSentLetter, createLetter, getFriendLetters, getLetterDetail, getMyLettersWithFriend, getPublicLetters } from "../repositories/letter.repository.js"
import { createLetterLike, deleteLetterLike, findLetterLike } from "../repositories/like.repository.js";
import { findUserById } from "../repositories/user.repository.js";
import { getMonthAndWeek, getWeekStartAndEnd } from "../utils/day.util.js";
import { getLevelInfo } from "../utils/planetConstants.js";
import { blockBadWordsInText } from "../utils/profanity.util.js";
import { LetterBadRequest } from "../errors/letter.error.js";

export const getLetter = async (id) => {
    const letter = await getLetterDetail(id);
    if(!letter) throw new LetterBadRequest("LETTER_400_01", "작성되지 않은 편지입니다.");
    
    return letter;
}

export const sendLetterToMe = async (userId, data) => {
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
            create: {
                paperId: data.paperId,
                stampId: data.stampId,
                fontId: data.fontId
            }
        }
    });

    const letter = await getLetterDetail(letterId);
    return { letter };
}

export const sendLetterToOther = async (userId, data) => {
    const receiver = await findUserById(data.receiverUserId);
    if(!receiver) throw new UserNotFoundError("USER_404_02", "해당 정보로 가입된 계정을 찾을 수 없습니다.", "id");
    if(userId === receiver.id) throw new DuplicatedValueError("USER_409_04", "전송하는 유저와 전달받는 유저의 id가 같습니다", "id");

    const isProfane = blockBadWordsInText(data.content);
    if(isProfane) throw new LetterBadRequest("LETTER_400_02", "부적절한 단어가 포함되어있습니다.");
    
    const letterId = await createLetter({
        letter: {
            senderUserId: userId,
            receiverUserId: data.receiverUserId,
            letterType: "TO_OTHER",
            questionId: data.questionId,
            title: data.title,
            content: data.content,
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

    const letter = await getLetterDetail(letterId);
    return { letter };
}

export const addLetterLike = async ({userId, letterId}) => {
    const isLiked = await findLetterLike({userId, letterId});
    if(isLiked) throw new DuplicatedValueError("LIKE_409_01", "이미 좋아요를 눌렀습니다."); 

    await createLetterLike({userId, letterId});

    return {
        letterId,
        isLiked: true
    }
}

export const removeLetterLike = async ({userId, letterId}) => {
    const isLiked = await findLetterLike({userId, letterId});
    if(!isLiked) throw new DuplicatedValueError("LIKE_409_02", "이미 좋아요를 누르지 않았습니다."); 

    await deleteLetterLike({userId, letterId});

    return {
        letterId,
        isLiked: false
    }
}

export const getPublicLetterFromOther = async (userId, isDetail) => {
    const friends = await selectAllFriendsByUserId(userId);
    const friendIds = friends.map(f => {
        return f.userAId === userId ? f.userBId : f.userAId;
    });

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