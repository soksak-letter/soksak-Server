import { prisma } from "../configs/db.config.js";

export const getUserForOnboarding = async (userId) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, gender: true, job: true },
  });
};

export const updateUserOnboardingStep1 = async ({ userId, gender, job }) => {
  return prisma.user.update({
    where: { id: userId },
    data: { gender, job },
  });
};
