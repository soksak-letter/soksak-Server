import {
  insertSessionReview,
  acceptSessionRequestTx,
  updateMatchingSessionToDiscard,
  updateMatchingSessionToFriends,
  findSessionParticipantByUserIdAndSessionId,
  countMatchingSessionByUserId
} from "../repositories/session.repository.js";
import {
  SessionCountOverError,
  SessionInternalError,
  SessionParticipantNotFoundError,
  UnExpectTagError,
  TemperatureRangeError,
} from "../errors/session.error.js";
import { InvalidUserError } from "../errors/user.error.js";
import { findUserById } from "../repositories/user.repository.js";
import { findQuestionByQuestionId } from "../repositories/question.repository.js";
import { QuestionNotFoundError } from "../errors/question.error.js";
import { BadRequestError, NotFoundError, InternalServerError } from "../errors/base.error.js";

async function assertUsersExistOrThrow(userId) {
  const [userById] = await Promise.all([
    findUserById(userId),
  ]);

  if (!userById)
    throw new InvalidUserError(undefined, undefined, userId);
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
  questionId
) => {
  const count = await countMatchingSessionByUserId(userId);
  console.log("count" + count);
  if(count >= 10) throw new SessionCountOverError(undefined, undefined, { count });
  const question = await findQuestionByQuestionId(questionId);
  console.log("question" + question.id);
  if(question == null) throw new QuestionNotFoundError(undefined, undefined, { questionId });

  try {
    const result = await acceptSessionRequestTx(userId, questionId);
    if (result == null) throw new SessionInternalError(undefined, undefined, { userId, questionId });
    return {
      data: result,
    };
  } catch (error) {
    if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof InternalServerError) {
      throw error;
    }
    throw new SessionInternalError();
  }
};

export const updateSessionFriends = async (userId, sessionId) => {
  try {
    const findResult = await findSessionParticipantByUserIdAndSessionId(
      userId,
      sessionId
    );
    if (findResult == null) throw new SessionParticipantNotFoundError(undefined, undefined, { userId, sessionId });

    const result = await updateMatchingSessionToFriends(sessionId);
    if (!result) throw new SessionInternalError();
    return {
      data: result,
    };
  } catch (error) {
    if (error instanceof BadRequestError || error instanceof NotFoundError) {
      throw error;
    }
    throw new SessionInternalError();
  }
};

export const updateSessionDiscarded = async (userId, sessionId) => {
  try {
    const findResult = await findSessionParticipantByUserIdAndSessionId(
      userId,
      sessionId
    );
    if (findResult.length == 0) throw new SessionParticipantNotFoundError(undefined, undefined, { sessionId });
    const result = await updateMatchingSessionToDiscard(sessionId);
    if (!result) throw new SessionInternalError();
    return {
      data: result,
    };
  } catch (error) {
    if (error instanceof BadRequestError || error instanceof NotFoundError) {
      throw error;
    }
    throw new SessionInternalError();
  }
};

export const createSessionReview = async (
  id,
  userId,
  temperatureScore,
  tag
) => {
  if (!validateTag(tag)) {
    throw new UnExpectTagError(undefined, undefined, { tag });
  }

  if (!validateTemperatureScore(temperatureScore)) {
    throw new TemperatureRangeError(undefined, undefined, { temperatureScore });
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
      data: result,
    };
  } catch (error) {
    if (error instanceof BadRequestError || error instanceof NotFoundError) {
      throw error;
    }
    throw new SessionInternalError();
  }
};
