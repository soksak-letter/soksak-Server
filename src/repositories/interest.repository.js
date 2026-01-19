import { prisma } from "../configs/db.config.js";

export const findActiveInterests = async () => {
  return prisma.interest.findMany({
    where: { isActive: true },
    select: { id: true, name: true },
    orderBy: { id: "asc" },
  });
};

export const findMyActiveInterests = async (userId) => {
    return prisma.userInterest.findMany({
      where: {
        userId,
        interest: { isActive: true },
      },
      select: {
        interest: { select: { id: true, name: true } },
      },
      orderBy: { interestId: "asc" },
    }).then((rows) => rows.map((r) => r.interest));
  };

export const findActiveInterestsByIds = async (interestIds) => {
  return prisma.interest.findMany({
    where: {
      id: { in: interestIds },
      isActive: true,
    },
    select: { id: true },
  });
};

export const replaceUserInterests = async ({ userId, interestIds }) => {
  return prisma.$transaction(async (tx) => {
    await tx.userInterest.deleteMany({
      where: { userId },
    });

    // interestIds가 빈 배열이면 createMany를 스킵
    if (interestIds.length > 0) {
      await tx.userInterest.createMany({
        data: interestIds.map((interestId) => ({
          userId,
          interestId,
        })),
      });
    }

    return true;
  });
};

export const updateUserPoolByUserId = async ({ userId, userPoolId }) => {
  return prisma.user.update({
    where: { id: userId },
    data: { userPoolId },
    select: { id: true, userPoolId: true },
  });
};
