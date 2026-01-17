import { prisma } from "../configs/db.config.js";

export const findUserAgreementByUserId = async (userId) => {
  return prisma.userAgreement.findUnique({
    where: { userId },
    select: {
      termsAgreed: true,
      privacyAgreed: true,
      marketingAgreed: true,
      ageOver14Agreed: true,
    },
  });
};

export const upsertUserAgreement = async ({ userId, data }) => {
  return prisma.userAgreement.upsert({
    where: { userId }, // userId @unique 필요
    update: {
      ...data,
      agreedAt: new Date(),
    },
    create: {
      userId,
      // 없으면 기본 false로 생성
      termsAgreed: data.termsAgreed ?? false,
      privacyAgreed: data.privacyAgreed ?? false,
      marketingAgreed: data.marketingAgreed ?? false,
      ageOver14Agreed: data.ageOver14Agreed ?? false,
      agreedAt: new Date(),
    },
    select: {
      termsAgreed: true,
      privacyAgreed: true,
      marketingAgreed: true,
      ageOver14Agreed: true,
    },
  });
};
