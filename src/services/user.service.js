import { RequiredTermAgreementError } from "../errors/auth.error.js";
import { BadRequestError } from "../errors/base.error.js";
import {
  ConsentUnauthorizedError,
  PushSubscriptionUnauthorizedError,
  ProfileUnauthorizedError,
  ProfileUserNotFoundError,
  ProfileFileRequiredError,
  ProfileUnsupportedImageTypeError,
  ProfileFileTooLargeError,
  ProfileFileBufferMissingError,
  UserNotFoundError,
  OnboardingAlreadyCompletedError,
  InterestIdsNotArrayError,
  InterestIdsInvalidFormatError,
  InterestIdsMinCountError,
  InterestIdsInvalidError,
} from "../errors/user.error.js";

import {
  upsertPushSubscription,
  findActiveInterests,
  findMyActiveInterests,
  findActiveInterestsByIds,
  replaceUserInterests,
  findOrCreateNotificationSetting,
  upsertNotificationSetting,
  findUserAgreementByUserId,
  upsertUserAgreement,
  getUserForOnboarding,
  updateUserOnboardingStep1,
  createUserAgreement,
  findUserById,
  findUserByIdForProfile,
  findUserInterestsByUserId,
  countSentLetters,
  countReceivedLetters,
  getAverageTemperatureScore,
  getTotalUsageMinutes,
  updateUserNicknameById,
  updateUserProfileImageUrlById,
  findRandomUserByPool,
  incrementTotalUsageMinutes,
  uploadProfileImageToStorage,
} from "../repositories/user.repository.js";
import {
  mimeToExt,
  requiredEnv,
  toIntArray,
  MAX_PROFILE_IMAGE_SIZE,
} from "../utils/user.util.js";

// ------------------------------
// Onboarding
// ------------------------------

export const updateOnboardingStep1 = async ({ userId, gender, job }) => {
  const user = await getUserForOnboarding(userId);
  if (!user) {
    throw new UserNotFoundError("USER_NOT_FOUND", "유저를 찾을 수 없습니다.");
  }

  // 온보딩 1회 정책 
  if (user.gender != null && user.job != null) {
    throw new OnboardingAlreadyCompletedError();
  }

  await updateUserOnboardingStep1({ userId, gender, job });

  return { updated: true };
};


export const createUserAgreements = async (data) => {
  const user = await findUserById(data.userId);
  if(!user) throw new UserNotFoundError("USER_NOT_FOUND", "해당 정보로 가입된 계정을 찾을 수 없습니다.", "id");

  await createUserAgreement({
    userId: data.userId,
    termsAgreed: data.body.termsAgreed,
    privacyAgreed: data.body.privacyAgreed,
    ageOver14Agreed: data.body.ageOver14Agreed,
    marketingAgreed: data.body.marketingAgreed || false,
  });
};


// ------------------------------
// Consent 
// ------------------------------

export const getMyConsents = async ({ userId }) => {
  if (!userId) throw new ConsentUnauthorizedError();

  const agreement = await findUserAgreementByUserId(userId);
  const safe = agreement ?? (await upsertUserAgreement({ userId, data: {} }));

  return {
    termsAgreed: safe.termsAgreed,
    privacyAgreed: safe.privacyAgreed,
    ageOver14Agreed: safe.ageOver14Agreed,
    marketingPushAgreed: safe.marketingPushAgreed,
    marketingEmailAgreed: safe.marketingEmailAgreed
  };
};


export const patchMyConsents = async ({ userId, data }) => {
  const user = await findUserById(userId);
  if(!user) throw new UserNotFoundError("USER_NOT_FOUND", "해당 정보로 가입된 계정을 찾을 수 없습니다.", "id");

  if(!data?.termsAgreed || !data?.privacyAgreed || !data?.ageOver14Agreed) throw new RequiredTermAgreementError("TERM_BAD_REQUEST", "필수 약관에 모두 동의해주세요.");


  const result = await upsertUserAgreement({ userId, data });

  return { result };
};

// ------------------------------
// PushSubscription 
// ------------------------------
export const updateMyPushSubscription = async ({ userId, subscription }) => {
  if (!userId) throw new PushSubscriptionUnauthorizedError();
  
  const { endpoint, keys } = subscription || {};
  const { p256dh, auth } = keys || {};

  await upsertPushSubscription({
    userId,
    endpoint: endpoint.trim(),
    p256dh: p256dh.trim(),
    auth: auth.trim(),
  });

  return { updated: true };
};

// ------------------------------
// Interest
// ------------------------------

export const getAllInterests = async () => {
  const items = await findActiveInterests();
  return { items };
};

export const getMyInterests = async ({ userId }) => {
  const items = await findMyActiveInterests(userId);
  return { items };
};

export const updateMyOnboardingInterests = async ({ userId, interestIds }) => {
  if (!Array.isArray(interestIds)) {
    throw new InterestIdsNotArrayError();
  }

  const parsed = toIntArray(interestIds);

  if (parsed.some((n) => !Number.isInteger(n) || n <= 0)) {
    throw new InterestIdsInvalidFormatError();
  }

  const uniqueIds = [...new Set(parsed)];

  if (uniqueIds.length < 3) {
    throw new InterestIdsMinCountError();
  }

  const found = await findActiveInterestsByIds(uniqueIds);
  if (found.length !== uniqueIds.length) {
    const foundSet = new Set(found.map((x) => x.id));
    const invalid = uniqueIds.filter((id) => !foundSet.has(id));
    throw new InterestIdsInvalidError("USER_INTEREST_IDS_INVALID", `유효하지 않은 관심사 id가 포함되어 있습니다: ${invalid.join(", ")}`, { invalidIds: invalid });
  }

  await replaceUserInterests({ userId, interestIds: uniqueIds });

  return { updated: true };
};

// ------------------------------
// Notification
// ------------------------------
export const updateMyNotificationSettings = async ({ userId, letter, marketing }) => {
  await upsertNotificationSetting({
    userId,
    letterEnabled: letter,
    marketingEnabled: marketing,
  });

  return { updated: true };
};

export const getMyNotificationSettings = async ({ userId }) => {
  const setting = await findOrCreateNotificationSetting({ userId });

  return {
    letter: setting.letterEnabled,
    marketing: setting.marketingEnabled,
  };
};

// ------------------------------
// Object Storage
// ------------------------------

export const uploadUserProfileImage = async ({ userId, fileBuffer, mimeType }) => {
  if (!fileBuffer || fileBuffer.length === 0) {
    throw new ProfileFileRequiredError("USER_PROFILE_FILE_REQUIRED", "업로드할 파일이 비어있습니다.");
  }
  if (fileBuffer.length > MAX_PROFILE_IMAGE_SIZE) {
    throw new ProfileFileTooLargeError();
  }

  const ext = mimeToExt(mimeType);
  if (!ext) {
    throw new ProfileUnsupportedImageTypeError();
  }
  const objectName = `profiles/${userId}/profile${ext}`;

  const { publicUrl } = await uploadProfileImageToStorage({
    objectName,
    fileBuffer,
    contentType: mimeType,
  });

  return { objectName, publicUrl };
};

// ------------------------------
// Profile
// ------------------------------
export const getMyProfile = async ({ userId }) => {
  const user = await findUserByIdForProfile(userId);
  if (!user) throw new ProfileUserNotFoundError();

  const interests = await findUserInterestsByUserId(userId);

  const [sentCount, receivedCount, temperatureAvg, usageMinutes] = await Promise.all([
    countSentLetters(userId),
    countReceivedLetters(userId),
    getAverageTemperatureScore(userId),
    getTotalUsageMinutes(userId),
  ]);

  return {
    id: user.id,
    nickname: user.nickname,
    email: user.email,
    profileImageUrl: user.profileImageUrl,
    interests, // [{id,name}]
    sentLettersCount: sentCount,
    receivedLettersCount: receivedCount,
    temperatureAvg: temperatureAvg === null ? null : Number(temperatureAvg),
    totalUsageMinutes: usageMinutes,
  };
};

export const updateMyNickname = async ({ userId, nickname }) => {
  const trimmed = nickname.trim();

  await updateUserNicknameById({ userId, nickname: trimmed });
  return { updated: true };
};

export const updateMyProfileImage = async ({ userId, file }) => {
  if (!file) throw new ProfileFileRequiredError();

  if (!file.buffer) {
    throw new ProfileFileBufferMissingError();
  }

  const { publicUrl } = await uploadUserProfileImage({
    userId,
    fileBuffer: file.buffer,
    mimeType: file.mimetype,
  });

  await updateUserProfileImageUrlById({ userId, profileImageUrl: publicUrl });

  return { updated: true, profileImageUrl: publicUrl };
};

export const selectRandomUser = async (userId) => {
  const receiverUserId = await findRandomUserByPool(userId);
  
  return receiverUserId;
}
// ========== Activity Service ==========
export const updateActivity = async (userId) => {
  const user = await incrementTotalUsageMinutes(userId);
  
  if (!user) {
    throw new ProfileUserNotFoundError("USER_NOT_FOUND", "사용자를 찾을 수 없습니다.");
  }

  return { message: "Activity updated successfully" };
};
