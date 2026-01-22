import { prisma } from "../db.config.js";
import { MaxTurnIsOver, SessionInternalError, SessionNotFoundError } from "../errors/session.error.js";
import { findRandomUserByPool } from "../repositories/user.repository.js";

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

export const decrementSessionTurn = async (sessionId) => {
  return await prisma.$transaction(async (tx) => {
    const session = await tx.matchingSession.findUnique({
      where: { id: sessionId },
      select: { id: true, maxTurns: true },
    });

    if (!session) throw new SessionNotFoundError();
    if (session.maxTurns <= 0) throw new MaxTurnIsOver();

    return await tx.matchingSession.update({
      where: { id: sessionId },
      data: { maxTurns: { decrement: 1 } },
      select: { id: true, maxTurns: true },
    });
  });
};

export const findMaxTurnBySessionId = async(sessionId) => {
  const result = await prisma.matchingSession.findFirst({
    where: {
      id: sessionId
    },
    select: {
      maxTurns: true,
    }
  })
  if(result.maxTurns <= 0) return false;
  return true;
}

export async function acceptSessionRequestTx(id, questionId) {
  try {
    const targetUserId = await findRandomUserByPool(id);
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

export const updateMatchingSessionToChating = async(sessionId) => {
  return await prisma.matchingSession.updateMany({
    where: {
      id: sessionId
    },
    data: {
      status: "CHATING"
    }
  })
}

export const countMatchingSessionWhichChating = async (userId) => {
  return await prisma.matchingSession.count({
    where: {
      status: "CHATING",
      participants: {
        some: { userId },
      },
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

export const countMatchingSessionByUserId = async (userId) => {
  const participants = await prisma.sessionParticipant.findMany({
    where: { userId },
    select: { sessionId: true },
    distinct: ["sessionId"], // 중복 방지 (가능하면 추천)
  });

  const sessionIds = participants.map((p) => p.sessionId);
  if (sessionIds.length === 0) return 0;

  const count = await prisma.matchingSession.count({
    where: {
      id: { in: sessionIds },
      status: "PENDING",
    },
  });

  return count;
};