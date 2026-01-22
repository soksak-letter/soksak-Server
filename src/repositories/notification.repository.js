import { prisma } from "../configs/db.config.js";

/**
 * 알림 설정 조회
 */
export const findNotificationSettingByUserId = async (userId) => {
  return prisma.userNotificationSetting.findUnique({
    where: { userId },
    select: {
      userId: true,
      letterEnabled: true,
      marketingEnabled: true,
      updatedAt: true,
    },
  });
};

/**
 * 알림 설정 생성 (기본값은 Prisma schema default를 따름)
 */
export const createNotificationSetting = async ({ userId, letterEnabled, marketingEnabled }) => {
  return prisma.userNotificationSetting.create({
    data: {
      userId,
      // 값이 undefined면 DB default 사용
      ...(typeof letterEnabled === "boolean" ? { letterEnabled } : {}),
      ...(typeof marketingEnabled === "boolean" ? { marketingEnabled } : {}),
    },
    select: { userId: true },
  });
};

/**
 * 알림 설정 업데이트
 */
export const updateNotificationSetting = async ({ userId, letterEnabled, marketingEnabled }) => {
  return prisma.userNotificationSetting.update({
    where: { userId },
    data: {
      ...(typeof letterEnabled === "boolean" ? { letterEnabled } : {}),
      ...(typeof marketingEnabled === "boolean" ? { marketingEnabled } : {}),
    },
    select: { userId: true },
  });
};

/**
 * upsert (없으면 생성)
 */
export const upsertNotificationSetting = async ({ userId, letterEnabled, marketingEnabled }) => {
  return prisma.userNotificationSetting.upsert({
    where: { userId },
    update: {
      ...(typeof letterEnabled === "boolean" ? { letterEnabled } : {}),
      ...(typeof marketingEnabled === "boolean" ? { marketingEnabled } : {}),
    },
    create: {
      userId,
      ...(typeof letterEnabled === "boolean" ? { letterEnabled } : {}),
      ...(typeof marketingEnabled === "boolean" ? { marketingEnabled } : {}),
    },
    select: { userId: true },
  });
};

// 알람 설정 조회 (없으면 기본값으로 생성)

export const findOrCreateNotificationSetting = async ({ userId }) => {
  // 없으면 기본값(Prisma default)으로 생성
  return prisma.userNotificationSetting.upsert({
    where: { userId },
    update: {}, // 조회 목적이라 update 없음
    create: { userId },
    select: {
      userId: true,
      letterEnabled: true,
      marketingEnabled: true,
      updatedAt: true,
    },
  });
};
