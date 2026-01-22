import { prisma } from "../db.config.js";
import { SessionInternalError } from "../errors/session.error.js";

export async function existsMatchingSession(userId, targetUserId, questionId) {
  const session = await prisma.MatchingSession.findFirst({
    where: {
      questionId: questionId,
      AND: [
        { participants: { some: { userId: userId } } },
        { participants: { some: { userId: targetUserId } } },
      ],
    },
    select: { id: true, maxTurns: true },
  });

  return session;
}

export async function acceptSessionRequestTx(id, targetUserId, questionId) {
  try {
    await prisma.$transaction(async (tx) => {
      const sessionResult = await tx.matchingSession.create({
        data: { questionId, status: "IN_PROGRESS" },
      });

      const result = await tx.sessionParticipant.createMany({
        data: [
          { sessionId: sessionResult.id, userId: id },
          { sessionId: sessionResult.id, userId: targetUserId },
        ],
      });

      if (result.count !== 2) throw new SessionInternalError();

      return true;
    });
  } catch (error) {
    return false;
  }
}

export const insertMatchingSession = async (questionId) => {
  const session = await prisma.matchingSession.create({
    data: {
      questionId: questionId,
      status: "IN_PROGRESS",
    },
  });
  return {
    id: session.id,
  };
};

export const decrementSessionTurn = async (sessionId) => {
  return await prisma.matchingSession.update({
    data: {
      maxTurns: maxTurns - 1,
    },
    where: {
      id: sessionId,
    },
  });
};

export const updateMatchingSessionToFriends = async (sessionId) => {
  return await prisma.matchingSession.update({
    where: {
      id: sessionId,
    },
    data: {
      status: "FRIENDS",
    },
  });
};

export const updateMatchingSessionToDiscard = async (sessionId) => {
  return await prisma.matchingSession.update({
    where: {
      id: sessionId,
    },
    data: {
      status: "DISCARDED",
    },
  });
};

export const insertSessionReview = async (
  id,
  userId,
  targetUserId,
  temperatureScore,
  tag
) => {
  return await prisma.sessionReview.create({
    data: {
      sessionId: id,
      reviewerUserId: userId,
      targetUserId: targetUserId,
      temperatureScore: temperatureScore,
      reviewTag: tag,
    },
  });
};

export const findSessionParticipantByUserIdAndSessionId = async (id, sessionId) => {
  const other = await prisma.sessionParticipant.findFirst({
    where: {
      sessionId: sessionId,
      NOT: { userId: id },
    },
    select: {
      userId: true,
    },
  });

  // 상대가 없으면 null 반환 (원하면 여기서 커스텀 에러 throw로 바꿔도 됨)
  return other?.userId ?? null;
};


export const findMatchingSessionBySessionId = async(sessionId) => {
    return await prisma.matchingSession.findFirst({
        where: {
            id: sessionId
        }
    })
}