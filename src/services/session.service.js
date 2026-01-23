import {
  insertSessionReview,
  acceptSessionRequestTx,
  updateMatchingSessionToDiscard,
  updateMatchingSessionToFriends,
  findSessionParticipantByUserIdAndSessionId,
  findMatchingSessionBySessionId,
  countMatchingSessionWhichChating,
} from "../repositories/session.repository.js";
import {
  SessionInternalError,
  SessionParticipantNotFoundError,
} from "../errors/session.error.js";
import { InvalidUserError } from "../errors/user.error.js";
import { findUserById } from "../repositories/user.repository.js";

async function assertUsersExistOrThrow(userId, targetUserId) {
  const [userById, targetUserById] = await Promise.all([
    findUserById(userId),
    findUserById(targetUserId),
  ]);

  if (!userById)
    throw new InvalidUserError(userId, "잘못된 유저 정보 입력입니다.");
  if (!targetUserById)
    throw new InvalidUserError(
      targetUserId,
      "잘못된 타겟 유저 정보 입력입니다."
    );
}

export function validateTag(tag) {
  const allowed = ["그냥 그래요", "좋아요!", "또 만나고 싶어요"];

  if (typeof tag !== "string") return false;
  const v = tag.trim();

  return allowed.includes(v);
}

export function validateTemperatureScore(temperatureScore) {
  const v = Number(temperatureScore);

  if (!Number.isFinite(v)) return false;
  return v >= 0 && v <= 100;
}

export const createMatchingSession = async (
  userId,
  targetUserId,
  questionId
) => {
  //question 존재 유무 확인
  try {
    const result = await acceptSessionRequestTx(userId, targetUserId, questionId);
    if (!result) throw new SessionInternalError();
    return {
      status: 200,
      message: "question에 따른 세션이 생성되었습니다.",
      data: result,
    };
  } catch (error) {
    // 2. Prisma에서 정의한 에러인지 확인
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // 주요 에러 코드별 처리
      switch (error.code) {
        case "P2002":
          throw new Error("이미 존재하는 데이터입니다. (중복 오류)");
        case "P2025":
          throw new Error("대상 데이터를 찾을 수 없습니다.");
        case "P2003":
          throw new Error("연결된 상위 데이터(질문 등)가 존재하지 않습니다.");
        default:
          throw new Error(
            `데이터베이스 오류가 발생했습니다. (코드: ${error.code})`
          );
      }
    }

    // 3. Prisma 문법 오류 (필드명 오타 등)
    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new Error("데이터 형식이 맞지 않거나 필수값이 누락되었습니다.");
    }

    // 4. 그 외 일반적인 에러 처리
    console.error("Unexpected Error:", error);
    throw new Error("알 수 없는 오류가 발생했습니다.");
  }
};

export const updateSessionFriends = async (userId, sessionId) => {
  try {
    const findResult = await findSessionParticipantByUserIdAndSessionId(
      userId,
      sessionId
    );
    if (findResult.length == 0) throw new SessionParticipantNotFoundError();
    const result = await updateMatchingSessionToFriends(sessionId);
    if (!result) throw new SessionInternalError();
    return {
      status: 200,
      message: "세션 상태가 FRIENDS으로 변경되었습니다.",
      data: result,
    };
  } catch (error) {
    // 2. Prisma에서 정의한 에러인지 확인
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // 주요 에러 코드별 처리
      switch (error.code) {
        case "P2002":
          throw new Error("이미 존재하는 데이터입니다. (중복 오류)");
        case "P2025":
          throw new Error("대상 데이터를 찾을 수 없습니다.");
        case "P2003":
          throw new Error("연결된 상위 데이터(질문 등)가 존재하지 않습니다.");
        default:
          throw new Error(
            `데이터베이스 오류가 발생했습니다. (코드: ${error.code})`
          );
      }
    }

    // 3. Prisma 문법 오류 (필드명 오타 등)
    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new Error("데이터 형식이 맞지 않거나 필수값이 누락되었습니다.");
    }

    // 4. 그 외 일반적인 에러 처리
    console.error("Unexpected Error:", error);
    throw new Error("알 수 없는 오류가 발생했습니다.");
  }
};

export const updateSessionDiscarded = async (userId, sessionId) => {
  try {
    const findResult = await findSessionParticipantByUserIdAndSessionId(
      userId,
      sessionId
    );
    if (findResult.length == 0) throw new SessionParticipantNotFoundError();
    const result = await updateMatchingSessionToDiscard(sessionId);
    if (!result) throw new SessionInternalError();
    return {
      status: 200,
      message: "세션 상태가 DISCARDED로 변경되었습니다.",
      data: result,
    };
  } catch (error) {
    // 2. Prisma에서 정의한 에러인지 확인
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // 주요 에러 코드별 처리
      switch (error.code) {
        case "P2002":
          throw new Error("이미 존재하는 데이터입니다. (중복 오류)");
        case "P2025":
          throw new Error("대상 데이터를 찾을 수 없습니다.");
        case "P2003":
          throw new Error("연결된 상위 데이터(질문 등)가 존재하지 않습니다.");
        default:
          throw new Error(
            `데이터베이스 오류가 발생했습니다. (코드: ${error.code})`
          );
      }
    }

    // 3. Prisma 문법 오류 (필드명 오타 등)
    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new Error("데이터 형식이 맞지 않거나 필수값이 누락되었습니다.");
    }

    // 4. 그 외 일반적인 에러 처리
    console.error("Unexpected Error:", error);
    throw new Error("알 수 없는 오류가 발생했습니다.");
  }
};

export const createSessionReview = async (
  id,
  userId,
  temperatureScore,
  tag
) => {
  if (!validateTag(tag)) {
    return res.status(400).json({
      errorCode: "VALIDATION_400_TAG",
      reason:
        "tag는 그냥 그래요, 좋아요!, 또 만나고 싶어요 중 하나여야 합니다.",
      data: { tag },
    });
  }

  if (!validateTemperatureScore(temperatureScore)) {
    return res.status(400).json({
      errorCode: "VALIDATION_400_TEMPERATURE_SCORE",
      reason: "temperatureScore는 0부터 100 사이의 숫자여야 합니다.",
      data: { temperatureScore },
    });
  }
  const targetUserId = await findSessionParticipantByUserIdAndSessionId(userId, id);
  assertUsersExistOrThrow(userId, targetUserId);

  try {
    const result = await insertSessionReview(
      id,
      userId,
      targetUserId,
      temperatureScore,
      tag
    );
    if (!result) throw new SessionInternalError();
    return {
      status: 200,
      message: "세션에 대한 review가 작성되었습니다.",
      data: result,
    };
  } catch (error) {
    // 2. Prisma에서 정의한 에러인지 확인
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // 주요 에러 코드별 처리
      switch (error.code) {
        case "P2002":
          throw new Error("이미 존재하는 데이터입니다. (중복 오류)");
        case "P2025":
          throw new Error("대상 데이터를 찾을 수 없습니다.");
        case "P2003":
          throw new Error("연결된 상위 데이터(질문 등)가 존재하지 않습니다.");
        default:
          throw new Error(
            `데이터베이스 오류가 발생했습니다. (코드: ${error.code})`
          );
      }
    }

    // 3. Prisma 문법 오류 (필드명 오타 등)
    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new Error("데이터 형식이 맞지 않거나 필수값이 누락되었습니다.");
    }

    // 4. 그 외 일반적인 에러 처리
    console.error("Unexpected Error:", error);
    throw new Error("알 수 없는 오류가 발생했습니다.");
  }
};

export const countUserSession = async (userId) => {
  const count = await countMatchingSessionWhichChating(userId);

  return count;
}