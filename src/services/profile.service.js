import {
  findUserByIdForProfile,
  findUserInterestsByUserId,
  countSentLetters,
  countReceivedLetters,
  getAverageTemperatureScore,
  getTotalUsageMinutes,
  updateUserNicknameById,
  updateUserProfileImageUrlById,
} from "../repositories/profile.repository.js";
import { uploadUserProfileImage } from "./objectStorage.service.js";
import { ProfileErrors, ProfileError } from "../errors/profile.error.js";

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
