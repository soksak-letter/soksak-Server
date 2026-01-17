import { prisma } from "../configs/db.config.js";

export const upsertUserDeviceToken = async ({ userId, deviceToken, deviceType = "FCM" }) => {
  // userId가 @unique라서 where에 userId 사용 가능
  return prisma.userDeviceToken.upsert({
    where: { userId },
    update: {
      deviceToken,
      deviceType,
      lastSeenAt: new Date(),
    },
    create: {
      userId,
      deviceToken,
      deviceType,
      lastSeenAt: new Date(),
    },
    select: { id: true, userId: true },
  });
};
