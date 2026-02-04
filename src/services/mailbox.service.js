import {
  findReceivedLettersForThreads,
  findSelfLetters,
  findUsersNicknameByIds,
} from "../repositories/user.repository.js";
import { LETTER_TYPE_ANON, LETTER_TYPE_SELF, makePreview } from "../utils/user.util.js";
import { findFriendById } from "../repositories/friend.repository.js";
import { NotFriendError } from "../errors/friend.error.js";
import { getFriendLetters, getMyLettersWithFriend } from "../repositories/letter.repository.js";
import { prisma } from "../configs/db.config.js";
import { MailboxInvalidSessionIdError } from "../errors/mailbox.error.js";

// ------------------------------
// Mailbox
// ------------------------------

export const getAnonymousThreads = async (userId) => {
  const receivedLetters = await findReceivedLettersForThreads({
    userId,
    letterType: LETTER_TYPE_ANON,
  });

  // sessionId로 그룹화
  const latestBySession = new Map(); // sessionId -> { letter, otherParticipantId }
  for (const l of receivedLetters) {
    if (!l.sessionId || !l.senderUserId) continue;
    
    // 상대방 ID는 senderUserId
    const otherParticipantId = l.senderUserId;
    
    if (!latestBySession.has(l.sessionId)) {
      latestBySession.set(l.sessionId, {
        letter: l,
        otherParticipantId: otherParticipantId
      });
    } else {
      // 더 최신 편지로 업데이트
      const existing = latestBySession.get(l.sessionId);
      const existingTime = existing.letter.deliveredAt 
        ? new Date(existing.letter.deliveredAt).getTime() 
        : new Date(existing.letter.createdAt).getTime();
      const currentTime = l.deliveredAt 
        ? new Date(l.deliveredAt).getTime() 
        : new Date(l.createdAt).getTime();
      
      if (currentTime > existingTime) {
        latestBySession.set(l.sessionId, {
          letter: l,
          otherParticipantId: otherParticipantId
        });
      }
    }
  }

  const sessionIds = Array.from(latestBySession.keys());
  const sessionData = Array.from(latestBySession.values());
  const otherParticipantIds = sessionData.map(s => s.otherParticipantId);
  const nicknameMap = otherParticipantIds.length 
    ? await findUsersNicknameByIds(otherParticipantIds) 
    : new Map();

  // 각 세션별 편지 개수 조회 (sessionId 기준, 개별 조회)
  const letterCounts = await Promise.all(
    sessionIds.map(async (sessionId) => {
      const count = await prisma.letter.count({
        where: {
          letterType: LETTER_TYPE_ANON,
          sessionId: sessionId,
          OR: [
            { receiverUserId: userId },
            { senderUserId: userId }
          ]
        }
      });
      return [sessionId, count];
    })
  );
  const letterCountMap = new Map(letterCounts);

  const letters = sessionIds.map((sessionId) => {
    const { letter: l, otherParticipantId } = latestBySession.get(sessionId);

    return {
      sessionId: sessionId, // threadId -> sessionId로 변경
      lastLetterId: l.id,
      lastLetterTitle: l.title,
      lastLetterPreview: makePreview(l.content, 30),
      deliveredAt: l.deliveredAt ?? null,
      sender: {
        id: otherParticipantId, // 상대방 ID
        nickname: nicknameMap.get(otherParticipantId) ?? null,
        letterCount: letterCountMap.get(sessionId) ?? 0, // sessionId 기준 개수
      },
      stampId: l.design?.stamp?.id ?? null,
      stampUrl: l.design?.stamp?.assetUrl ?? null,
      design: l.design
        ? {
            paper: l.design.paper
              ? {
                  id: l.design.paper.id,
                  name: l.design.paper.color, // color를 name으로 매핑
                }
              : null,
          }
        : { paper: null },
    };
  });

  letters.sort((a, b) => {
    const ta = a.deliveredAt ? new Date(a.deliveredAt).getTime() : 0;
    const tb = b.deliveredAt ? new Date(b.deliveredAt).getTime() : 0;
    return tb - ta;
  });

  return { letters };
};

export const getAnonymousThreadLetters = async (userId, sessionIdRaw) => {
  const sessionId = Number(sessionIdRaw);

  // 세션 참가자 조회하여 권한 확인
  const session = await prisma.matchingSession.findFirst({
    where: {
      id: sessionId,
      participants: {
        some: {
          userId: userId // 현재 사용자가 참가자인 세션만
        }
      }
    },
    include: {
      participants: {
        select: {
          userId: true
        }
      }
    }
  });

  if (!session) {
    throw new MailboxInvalidSessionIdError();
  }

  // 받은 편지 조회 (sessionId로 필터링)
  const receivedLetters = await prisma.letter.findMany({
    where: {
      receiverUserId: userId,
      sessionId: sessionId,
      letterType: LETTER_TYPE_ANON,
    },
    orderBy: [{ deliveredAt: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      title: true,
      deliveredAt: true,
      readAt: true,
      createdAt: true,
      question: {
        select: {
          content: true
        }
      },
      design: {
        select: {
          paper: {
            select: {
              id: true,
              color: true,
            }
          },
          stamp: {
            select: {
              id: true,
              name: true,
              assetUrl: true
            }
          },
        },
      },
    },
  });

  // 보낸 편지 조회 (sessionId로 필터링)
  const sentLetters = await prisma.letter.findMany({
    where: {
      senderUserId: userId,
      sessionId: sessionId,
      letterType: LETTER_TYPE_ANON,
    },
    orderBy: [{ deliveredAt: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      title: true,
      deliveredAt: true,
      readAt: true,
      createdAt: true,
      question: {
        select: {
          content: true
        }
      },
      design: {
        select: {
          paper: {
            select: {
              id: true,
              color: true,
            }
          },
          stamp: {
            select: {
              id: true,
              name: true,
              assetUrl: true
            }
          },
        },
      },
    },
  });

  // firstQuestion: 받은 편지의 첫 번째 질문 우선, 없으면 보낸 편지의 첫 번째 질문
  const firstQuestion = receivedLetters[0]?.question?.content ?? sentLetters[0]?.question?.content ?? null;

  // 받은 편지에 isMine: false 추가
  const receivedLettersData = receivedLetters.map((l) => ({
    id: l.id,
    title: l.title,
    deliveredAt: l.deliveredAt ?? null,
    readAt: l.readAt ?? null,
    isMine: false,
    stampId: l.design?.stamp?.id ?? null,
    stampUrl: l.design?.stamp?.assetUrl ?? null,
    design: l.design
      ? {
          paper: l.design.paper
            ? {
                id: l.design.paper.id,
                name: l.design.paper.color, // color를 name으로 매핑
              }
            : null,
        }
      : { paper: null },
  }));

  // 보낸 편지에 isMine: true 추가
  const sentLettersData = sentLetters.map((l) => ({
    id: l.id,
    title: l.title,
    deliveredAt: l.deliveredAt ?? null,
    readAt: l.readAt ?? null,
    isMine: true,
    stampId: l.design?.stamp?.id ?? null,
    stampUrl: l.design?.stamp?.assetUrl ?? null,
    design: l.design
      ? {
          paper: l.design.paper
            ? {
                id: l.design.paper.id,
                name: l.design.paper.color, // color를 name으로 매핑
              }
            : null,
        }
      : { paper: null },
  }));

  // 받은 편지 먼저, 보낸 편지 나중에 배치
  const lettersData = [...receivedLettersData, ...sentLettersData];

  return {
    firstQuestion,
    letters: lettersData,
  };
};

export const getLetterFromFriend = async ({userId, friendId}) => {
    const friend = await findFriendById(userId, friendId);
    if(!friend) throw new NotFriendError("FRIEND_NOT_FRIEND", "친구가 아닙니다.");

    const {friendLetters, question: friendFirstQuestion} = await getFriendLetters({userId, friendId});
    const myLetters = await getMyLettersWithFriend({userId, friendId});

    const myFirstQuestion = myLetters[0]?.question?.content;

    return {
        friendName: friend.nickname,
        firstQuestion: friendFirstQuestion ?? myFirstQuestion,
        friendLetters: friendLetters,
        userLetters: myLetters
    };
}

export const getSelfMailbox = async (userId) => {
  const letters = await findSelfLetters({
    userId,
    letterType: LETTER_TYPE_SELF,
  });

  const lettersData = letters.map((l) => ({
    id: l.id,
    title: l.title,
    createdAt: l.createdAt ?? null,
    questionId: l.questionId ?? null,
    paperId: l.design?.paperId ?? null,
    stampId: l.design?.stampId ?? null,
    stampUrl: l.design?.stamp?.assetUrl ?? null,
  }));

  return { letters: lettersData };
};
