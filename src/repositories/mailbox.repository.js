import { prisma } from "../configs/db.config.js";

/**
 * 익명 스레드 목록용:
 * - receiverUserId = me
 * - letterType = ANON_SESSION
 * - senderUserId별 최신 편지 1개씩 뽑기 위해, 일단 최신순 전체를 가져오고 service에서 group 처리
 */
export const findReceivedLettersForThreads = async ({ userId, letterType }) => {
  return prisma.letter.findMany({
    where: {
      receiverUserId: userId,
      letterType,
    },
    orderBy: [{ deliveredAt: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      senderUserId: true,
      title: true,
      content: true,
      deliveredAt: true,
      createdAt: true,
      design: {
        select: { paperId: true }, // 편지통 색상용
      },
    },
  });
};

/**
 * 특정 익명 스레드(=senderUserId)의 편지 목록
 */
export const findReceivedLettersBySender = async ({ userId, senderUserId, letterType }) => {
  return prisma.letter.findMany({
    where: {
      receiverUserId: userId,
      senderUserId,
      letterType,
    },
    orderBy: [{ deliveredAt: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      title: true,
      content: true,
      deliveredAt: true,
      createdAt: true,
      design: {
        select: { paperId: true, stampId: true, fontId: true },
      },
    },
  });
};

/**
 * 나에게(SELF) 목록:
 * - senderUserId = me
 * - letterType = SELF
 */
export const findSelfLetters = async ({ userId, letterType }) => {
  return prisma.letter.findMany({
    where: {
      senderUserId: userId,
      letterType,
    },
    orderBy: [{ createdAt: "desc" }],
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      deliveredAt: true,
      design: {
        select: { paperId: true },
      },
    },
  });
};

export const findUsersNicknameByIds = async (userIds) => {
  const rows = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, nickname: true },
  });

  const map = new Map();
  for (const r of rows) map.set(r.id, r.nickname ?? null);
  return map;
};
