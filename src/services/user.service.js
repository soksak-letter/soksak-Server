import fs from "fs";
import * as common from "oci-common";
import * as objectstorage from "oci-objectstorage";

import { RequiredTermAgreementError } from "../errors/auth.error.js";
import {
  CONSENT_ERRORS,
  DEVICE_TOKEN_ERRORS,
  MAILBOX_ERROR,
  throwMailboxError,
  InvalidNoticeIdError,
  NoticeNotFoundError,
  PolicyNotFoundError,
  ProfileErrors,
  ProfileError,
} from "../errors/user.error.js";

import {
  upsertUserDeviceToken,
  findActiveInterests,
  findMyActiveInterests,
  findActiveInterestsByIds,
  replaceUserInterests,
  findReceivedLettersForThreads,
  findReceivedLettersBySender,
  findSelfLetters,
  findUsersNicknameByIds,
  findActiveNotices,
  findNoticeById,
  findOrCreateNotificationSetting,
  upsertNotificationSetting,
  findUserAgreementByUserId,
  upsertUserAgreement,
  findPolicyDocumentByKey,
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
} from "../repositories/user.repository.js";
import {
  ALLOWED_GENDERS,
  ALLOWED_JOBS,
  isBooleanOrUndefined,
  LETTER_TYPE_ANON,
  LETTER_TYPE_SELF,
  makePreview,
  mimeToExt,
  requiredEnv,
  toIntArray,
  MAX_PROFILE_IMAGE_SIZE,
} from "../utils/user.util.js";

// ------------------------------
// Onboarding / Agreements (기존 user.service.js)
// ------------------------------

export const updateOnboardingStep1 = async ({ userId, gender, job }) => {
  // validation 
  if (!gender || !ALLOWED_GENDERS.has(gender)) {
    const e = new Error("gender 값이 올바르지 않습니다.");
    e.status = 400;
    e.errorCode = "USER_400";
    throw e;
  }
  if (!job || !ALLOWED_JOBS.has(job)) {
    const e = new Error("job 값이 올바르지 않습니다.");
    e.status = 400;
    e.errorCode = "USER_400";
    throw e;
  }

  const user = await getUserForOnboarding(userId);
  if (!user) {
    const e = new Error("유저를 찾을 수 없습니다.");
    e.status = 404;
    e.errorCode = "USER_404";
    throw e;
  }

  // 온보딩 1회 정책 
  if (user.gender != null && user.job != null) {
    const e = new Error("이미 온보딩 1이 완료된 사용자입니다.");
    e.status = 409;
    e.errorCode = "USER_409";
    throw e;
  }

  await updateUserOnboardingStep1({ userId, gender, job });

  return { updated: true };
};

export const createUserAgreements = async (data) => {
  const user = await findUserById(data.userId);
  if (!user) throw new Error("존재하지 않는 사용자입니다.");

  if (!data?.body?.termsAgreed || !data?.body?.privacyAgreed || !data?.body?.ageOver14Agreed) {
    throw new RequiredTermAgreementError("TERM_400_01", "필수 약관에 모두 동의해주세요.");
  }

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
  if (!userId) throw CONSENT_ERRORS.UNAUTHORIZED;

  const agreement = await findUserAgreementByUserId(userId);
  const safe = agreement ?? (await upsertUserAgreement({ userId, data: {} }));

  return {
    termsAgreed: safe.termsAgreed,
    privacyAgreed: safe.privacyAgreed,
    ageOver14Agreed: safe.ageOver14Agreed,
    marketingAgreed: safe.marketingAgreed,
  };
};

export const patchMyConsents = async ({ userId, payload }) => {
  if (!userId) throw CONSENT_ERRORS.UNAUTHORIZED;

  const { termsAgreed, privacyAgreed, marketingAgreed, ageOver14Agreed } = payload ?? {};

  if (
    !isBooleanOrUndefined(termsAgreed) ||
    !isBooleanOrUndefined(privacyAgreed) ||
    !isBooleanOrUndefined(marketingAgreed) ||
    !isBooleanOrUndefined(ageOver14Agreed)
  ) {
    throw CONSENT_ERRORS.INVALID_BODY;
  }

  const updateData = {};
  if (typeof termsAgreed === "boolean") updateData.termsAgreed = termsAgreed;
  if (typeof privacyAgreed === "boolean") updateData.privacyAgreed = privacyAgreed;
  if (typeof marketingAgreed === "boolean") updateData.marketingAgreed = marketingAgreed;
  if (typeof ageOver14Agreed === "boolean") updateData.ageOver14Agreed = ageOver14Agreed;

  await upsertUserAgreement({ userId, data: updateData });

  return { updated: true };
};

// ------------------------------
// DeviceToken 
// ------------------------------
export const updateMyDeviceToken = async ({ userId, deviceToken }) => {
  if (!userId) throw DEVICE_TOKEN_ERRORS.UNAUTHORIZED;
  if (typeof deviceToken !== "string" || deviceToken.trim().length === 0) {
    throw DEVICE_TOKEN_ERRORS.INVALID_BODY;
  }

  await upsertUserDeviceToken({
    userId,
    deviceToken: deviceToken.trim(),
    deviceType: "FCM",
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
    throw new Error("interestIds는 배열이어야 합니다.");
  }

  const parsed = toIntArray(interestIds);

  if (parsed.some((n) => !Number.isInteger(n) || n <= 0)) {
    throw new Error("interestIds는 양의 정수 배열이어야 합니다.");
  }

  const uniqueIds = [...new Set(parsed)];

  if (uniqueIds.length < 3) {
    throw new Error("관심사는 최소 3개 선택해야 합니다.");
  }

  const found = await findActiveInterestsByIds(uniqueIds);
  if (found.length !== uniqueIds.length) {
    const foundSet = new Set(found.map((x) => x.id));
    const invalid = uniqueIds.filter((id) => !foundSet.has(id));
    throw new Error(`유효하지 않은 관심사 id가 포함되어 있습니다: ${invalid.join(", ")}`);
  }

  await replaceUserInterests({ userId, interestIds: uniqueIds });

  return { updated: true };
};

// ------------------------------
// Mailbox 
// ------------------------------

export const getAnonymousThreads = async (userId) => {
  const letters = await findReceivedLettersForThreads({
    userId,
    letterType: LETTER_TYPE_ANON,
  });

  const latestBySender = new Map(); // senderUserId -> letter
  for (const l of letters) {
    if (!l.senderUserId) continue;
    if (!latestBySender.has(l.senderUserId)) {
      latestBySender.set(l.senderUserId, l);
    }
  }

  const senderIds = Array.from(latestBySender.keys());
  const nicknameMap = senderIds.length ? await findUsersNicknameByIds(senderIds) : new Map();

  const items = senderIds.map((senderId) => {
    const l = latestBySender.get(senderId);
    const updatedAt = l.deliveredAt ?? l.createdAt ?? null;

    return {
      threadId: senderId, // threadId = senderUserId
      lastLetterId: l.id,
      lastLetterTitle: l.title,
      lastLetterPreview: makePreview(l.content, 30),
      updatedAt,

      sender: {
        id: senderId,
        nickname: nicknameMap.get(senderId) ?? null,
      },

      paperId: l.design?.paperId ?? null,
    };
  });

  items.sort((a, b) => {
    const ta = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    const tb = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
    return tb - ta;
  });

  return { items };
};

export const getAnonymousThreadLetters = async (userId, threadIdRaw) => {
  const threadId = Number(threadIdRaw);
  if (!Number.isFinite(threadId) || threadId <= 0) {
    throwMailboxError(MAILBOX_ERROR.INVALID_THREAD_ID, { threadId: threadIdRaw });
  }

  const letters = await findReceivedLettersBySender({
    userId,
    senderUserId: threadId,
    letterType: LETTER_TYPE_ANON,
  });

  const items = letters.map((l) => ({
    id: l.id,
    title: l.title,
    content: l.content,
    deliveredAt: l.deliveredAt ?? null,
    createdAt: l.createdAt ?? null,
    design: l.design
      ? {
          paperId: l.design.paperId ?? null,
          stampId: l.design.stampId ?? null,
          fontId: l.design.fontId ?? null,
        }
      : { paperId: null, stampId: null, fontId: null },
  }));

  return { items };
};

export const getSelfMailbox = async (userId) => {
  const letters = await findSelfLetters({
    userId,
    letterType: LETTER_TYPE_SELF,
  });

  const items = letters.map((l) => ({
    id: l.id,
    title: l.title,
    createdAt: l.createdAt ?? null,
    paperId: l.design?.paperId ?? null,
  }));

  return { items };
};

// ------------------------------
// Notice 
// ------------------------------
export const getNotices = async () => {
  const items = await findActiveNotices();
  return { items };
};

export const getNoticeDetail = async (noticeId) => {
  const id = Number(noticeId);
  if (!Number.isInteger(id) || id <= 0) throw new InvalidNoticeIdError(noticeId);

  const notice = await findNoticeById(id);
  if (!notice) throw new NoticeNotFoundError(id);

  return notice;
};

// ------------------------------
// Notification
// ------------------------------
export const updateMyNotificationSettings = async ({ userId, letter, marketing }) => {
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

let cachedClient = null;

const getObjectStorageClient = () => {
  if (cachedClient) return cachedClient;

  const tenancyId = requiredEnv("OCI_TENANCY_OCID");
  const userId = requiredEnv("OCI_USER_OCID");
  const fingerprint = requiredEnv("OCI_FINGERPRINT");
  const privateKeyPath = requiredEnv("OCI_PRIVATE_KEY_PATH");
  const passphrase = process.env.OCI_PRIVATE_KEY_PASSPHRASE || null;
  const regionId = requiredEnv("OCI_REGION"); // 예: 'ap-seoul-1'

  const privateKey = fs
    .readFileSync(privateKeyPath, "utf8")
    .replace(/\r/g, "")
    .trim();

  const regionObj = common.Region.fromRegionId(regionId);

  const provider = new common.SimpleAuthenticationDetailsProvider(
    tenancyId,
    userId,
    fingerprint,
    privateKey,
    passphrase,
    regionObj
  );

  const client = new objectstorage.ObjectStorageClient({
    authenticationDetailsProvider: provider,
    region: regionObj,
  });

  cachedClient = client;
  return client;
};

export const uploadUserProfileImage = async ({ userId, fileBuffer, mimeType }) => {
  if (!fileBuffer || fileBuffer.length === 0) {
    const err = new Error("업로드할 파일이 비어있습니다.");
    err.statusCode = 400;
    throw err;
  }
  if (fileBuffer.length > MAX_PROFILE_IMAGE_SIZE) {
    const err = new Error("파일 크기가 너무 큽니다. 최대 5MB까지 업로드 가능합니다.");
    err.code = "FILE_TOO_LARGE";
    err.statusCode = 400;
    throw err;
  }
  console.log("파일은 받음");
  const namespaceName = requiredEnv("OCI_NAMESPACE");
  const bucketName = requiredEnv("OCI_BUCKET_NAME");
  const regionId = requiredEnv("OCI_REGION");
  console.log(namespaceName);
  console.log(bucketName);
  console.log(regionId);
  const ext = mimeToExt(mimeType);
  if (!ext) {
    const err = new Error("지원하지 않는 이미지 형식입니다. (jpg/png/webp 허용)");
    err.code = "UNSUPPORTED_IMAGE_TYPE";
    err.statusCode = 400;
    throw err;
  }
  console.log("여기까지");
  const objectName = `profiles/${userId}/profile${ext}`;

  const client = getObjectStorageClient();

  try {
    await client.putObject({
      namespaceName,
      bucketName,
      objectName,
      contentType: mimeType,
      contentLength: fileBuffer.length,
      putObjectBody: fileBuffer,
    });
  } catch (error) {
    console.error("❌ OCI 상세 에러 발생:");
    console.error("상태 코드:", error.statusCode);
    console.error("에러 코드:", error.code);
    console.error("메시지:", error.message);
    console.error("요청 ID:", error.opcRequestId);
    throw error;
  }

  const publicUrl =
    `https://objectstorage.${regionId}.oraclecloud.com` +
    `/n/${namespaceName}/b/${bucketName}/o/${encodeURIComponent(objectName)}`;

  return { objectName, publicUrl };
};

// ------------------------------
// Policy
// ------------------------------
const POLICY_KEYS = {
  COMMUNITY_GUIDELINES: "COMMUNITY_GUIDELINES",
  TERMS: "TERMS",
  PRIVACY: "PRIVACY",
};

export const getCommunityGuidelines = async () => {
  const doc = await findPolicyDocumentByKey(POLICY_KEYS.COMMUNITY_GUIDELINES);
  if (!doc) throw new PolicyNotFoundError(POLICY_KEYS.COMMUNITY_GUIDELINES);

  return {
    title: "커뮤니티 가이드라인",
    content: doc.content,
  };
};

export const getTerms = async () => {
  const doc = await findPolicyDocumentByKey(POLICY_KEYS.TERMS);
  if (!doc) throw new PolicyNotFoundError(POLICY_KEYS.TERMS);

  return {
    title: "서비스 이용약관",
    content: doc.content,
  };
};

export const getPrivacy = async () => {
  const doc = await findPolicyDocumentByKey(POLICY_KEYS.PRIVACY);
  if (!doc) throw new PolicyNotFoundError(POLICY_KEYS.PRIVACY);

  return {
    title: "개인정보 처리방침",
    content: doc.content,
  };
};

// ------------------------------
// Profile
// ------------------------------
export const getMyProfile = async ({ userId }) => {
  const user = await findUserByIdForProfile(userId);
  if (!user) throw new ProfileError("유저를 찾을 수 없습니다.", 404, "USER_NOT_FOUND");

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
  if (typeof nickname !== "string") throw ProfileErrors.INVALID_NICKNAME();
  const trimmed = nickname.trim();
  if (trimmed.length < 2 || trimmed.length > 20) throw ProfileErrors.INVALID_NICKNAME();

  await updateUserNicknameById({ userId, nickname: trimmed });
  return { updated: true };
};

export const updateMyProfileImage = async ({ userId, file }) => {
  if (!file) throw ProfileErrors.FILE_REQUIRED();

  if (!file.buffer) throw new ProfileError("파일 버퍼를 찾을 수 없습니다.", 400, "FILE_BUFFER_MISSING");

  const { publicUrl } = await uploadUserProfileImage({
    userId,
    fileBuffer: file.buffer,
    mimeType: file.mimetype,
  });

  await updateUserProfileImageUrlById({ userId, profileImageUrl: publicUrl });

  return { updated: true, profileImageUrl: publicUrl };
};