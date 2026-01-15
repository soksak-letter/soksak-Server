import { upsertNotificationSetting } from "../repositories/notification.repository.js";
import { findOrCreateNotificationSetting } from "../repositories/notification.repository.js";

export const updateMyNotificationSettings = async ({ userId, letter, marketing }) => {
  // body 검증
  if (typeof letter !== "boolean" && typeof marketing !== "boolean") {
    throw new Error('요청 바디에 "letter" 또는 "marketing" 중 하나 이상이 boolean으로 필요합니다.');
  }
  if (typeof letter !== "undefined" && typeof letter !== "boolean") {
    throw new Error('"letter"는 boolean이어야 합니다.');
  }
  if (typeof marketing !== "undefined" && typeof marketing !== "boolean") {
    throw new Error('"marketing"은 boolean이어야 합니다.');
  }

  await upsertNotificationSetting({
    userId,
    letterEnabled: letter,
    marketingEnabled: marketing,
  });

  return { updated: true };
};


// 알람 설정 조회 (없으면 기본값으로 생성)

export const getMyNotificationSettings = async ({ userId }) => {
  const setting = await findOrCreateNotificationSetting({ userId });

  // 프론트 요청/응답 형태에 맞춰 key 변환
  return {
    letter: setting.letterEnabled,
    marketing: setting.marketingEnabled,
  };
};