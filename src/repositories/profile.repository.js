import { prisma } from "../configs/db.config.js";

export const findUserByIdForProfile = async (userId) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      nickname: true,
      email: true,
      profileImageUrl: true,
    },
  });
};

export const findUserInterestsByUserId = async (userId) => {
  const rows = await prisma.userInterest.findMany({
    where: { userId },
    select: {
      interest: {
        select: { id: true, name: true },
      },
    },
    orderBy: { interestId: "asc" },
  });

  return rows.map((r) => r.interest);
};

export const countSentLetters = async (userId) => {
  return prisma.letter.count({
    where: { senderUserId: userId },
  });
};

export const countReceivedLetters = async (userId) => {
  return prisma.letter.count({
    where: { receiverUserId: userId },
  });
};

//  온도: session_review.temperature_score 평균(타겟 유저 기준)
export const getAverageTemperatureScore = async (userId) => {
  const result = await prisma.sessionReview.aggregate({
    where: { targetUserId: userId },
    _avg: { temperatureScore: true },
  });

  return result?._avg?.temperatureScore ?? null;
};

//  이용시간(분): matching_session started_at~ended_at 합 (참여한 세션 기준)
export const getTotalUsageMinutes = async (userId) => {
  const participants = await prisma.sessionParticipant.findMany({
    where: { userId },
    select: {
      session: {
        select: { startedAt: true, endedAt: true },
      },
    },
  });

  let totalMs = 0;
  for (const p of participants) {
    const startedAt = p?.session?.startedAt;
    const endedAt = p?.session?.endedAt;
    if (!startedAt || !endedAt) continue;

    const diff = new Date(endedAt).getTime() - new Date(startedAt).getTime();
    if (diff > 0) totalMs += diff;
  }

  return Math.floor(totalMs / 1000 / 60);
};

export const updateUserNicknameById = async ({ userId, nickname }) => {
  return prisma.user.update({
    where: { id: userId },
    data: { nickname },
    select: { id: true },
  });
};

export const updateUserProfileImageUrlById = async ({ userId, profileImageUrl }) => {
  return prisma.user.update({
    where: { id: userId },
    data: { profileImageUrl },
    select: { id: true },
  });
};
