import { findUserById } from "../repositories/user.repository.js";
import {
  insertFriendRequest,
  userExistsFriendRequest,
  selectAllFriendsByUserId,
  selectFriendsRequestByTargetUserId,
  selectFriendsRequestByUserId,
  acceptFriendRequestTx,
  updateFriendRequestRejectTx,
  deleteFriendRequest,
} from "../repositories/friend.repository.js";
import { InvalidUserError } from "../errors/user.error.js";
import {
  SelfFriendRequestError,
  FriendRequestNotFoundError,
  FriendRequestAlreadyExistsError,
  AlreadyFriendsError,
  FriendNotFoundError,
  FriendInternalError,
  BaseError,
} from "../errors/friend.error.js";

async function userExistsOrThrow(userId) {
  const userById = await findUserById(userId);
  if (!userById)
    throw new InvalidUserError(userId, "잘못된 유저 정보 입력입니다.");
}

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

async function userSameCheck(userId, targetUserId) {
  if (userId === targetUserId) throw new SelfFriendRequestError();
}

// 1) 친구 신청
export const postFriendRequest = async (userId, targetUserId, sessionId) => {
  await assertUsersExistOrThrow(userId, targetUserId);
  await userSameCheck(userId, targetUserId);

  try {
    const result = await insertFriendRequest(userId, targetUserId, sessionId);
    if (!result) {
      throw new FriendInternalError({
        reason: "친구 요청 생성 실패",
        action: "POST_FRIEND_REQUEST",
        userId,
        targetUserId,
      });
    }
    return {
      status: 201,
      message: "친구 신청이 성공적으로 처리되었습니다.",
      data: result,
    };
  } catch (error) {
    if (error?.code === "P2002") {
      // 유니크 제약 위반: 이미 친구 요청이 있거나 이미 친구인 경우
      const existingRequest1 = await userExistsFriendRequest(
        userId,
        targetUserId
      );
      const existingRequest2 = await userExistsFriendRequest(
        targetUserId,
        userId
      );
      if (existingRequest1 || existingRequest2) {
        throw new FriendRequestAlreadyExistsError({ userId, targetUserId });
      } else {
        throw new AlreadyFriendsError({ userId, targetUserId });
      }
    }
    throw new FriendInternalError({
      reason: error.message,
      action: "POST_FRIEND_REQUEST",
      userId,
    });
  }
};

// 2) 친구 목록 조회
export const getFriendsList = async (userId) => {
  await userExistsOrThrow(userId);

  try {
    const friendsList = await selectAllFriendsByUserId(userId);
    if (friendsList.length === 0) {
      throw new FriendNotFoundError({ userId });
    }
    return {
      status: 200,
      message: "친구 목록 조회가 성공적으로 처리되었습니다.",
      data: friendsList,
    };
  } catch (error) {
    if (error instanceof BaseError) throw error;
    throw new FriendInternalError({
      reason: error.message,
      action: "GET_FRIENDS_LIST",
      userId,
    });
  }
};

// 3) 들어온 친구 신청 목록 조회
export const getIncomingFriendRequests = async (userId) => {
  await userExistsOrThrow(userId);

  try {
    const incomingRequests = await selectFriendsRequestByTargetUserId(userId);
    if (incomingRequests.length === 0) {
      throw new FriendRequestNotFoundError({ userId, incomingRequests });
    }
    return {
      status: 200,
      message: "친구 신청 조회가 성공하였습니다.",
      data: incomingRequests,
    };
  } catch (error) {
    if (error instanceof BaseError) throw error;
    throw new FriendInternalError({
      reason: error.message,
      action: "GET_INCOMING_REQUESTS",
      userId,
    });
  }
};

// 4) 보낸 친구 신청 목록 조회
export const getOutgoingFriendRequests = async (userId) => {
  await userExistsOrThrow(userId);
  console.log("service userId:" + userId);
  try {
    const outgoingRequests = await selectFriendsRequestByUserId(userId);
    console.log("service outgoingRequests:" + JSON.stringify(outgoingRequests));
    if (outgoingRequests.length === 0) {
      throw new FriendRequestNotFoundError({ userId });
    }
    return {
      status: 200,
      message: "보낸 친구 신청 조회가 성공하였습니다.",
      data: outgoingRequests,
    };
  } catch (error) {
    if (error instanceof BaseError) throw error;
    throw new FriendInternalError({
      reason: error.message,
      action: "GET_OUTGOING_REQUESTS",
      userId,
    });
  }
};

// 5) 친구 신청 수락
export const acceptFriendRequest = async (receiverUserId, requesterUserId) => {
  await assertUsersExistOrThrow(receiverUserId, requesterUserId);

  const req = await userExistsFriendRequest(receiverUserId, requesterUserId);
  if (!req) throw new FriendRequestNotFoundError({ receiverUserId, requesterUserId });

  try {
    const result = await acceptFriendRequestTx(receiverUserId, requesterUserId);
    return {
      status: 200,
      message: "해당 친구 신청이 수락되었습니다.",
      data: result,
    };
  } catch (error) {
    if (error?.message === "수락 대기 중인 친구 요청이 없습니다.") {
      throw new FriendRequestNotFoundError({ receiverUserId, requesterUserId });
    }
    if (error?.code === "P2025") {
      throw new FriendRequestNotFoundError({ receiverUserId, requesterUserId });
    } else if (error?.code === "P2002") {
      throw new AlreadyFriendsError({ receiverUserId, requesterUserId });
    }
    throw new FriendInternalError({
      reason: error.message,
      action: "ACCEPT_REQUEST",
      userId,
      targetUserId,
    });
  }
};

// 6) 친구 신청 거절
export const rejectFriendRequest = async (userId, targetUserId) => {
  await assertUsersExistOrThrow(userId, targetUserId);

  try {
    const rejectedFriendRequest = await updateFriendRequestRejectTx(
      userId,
      targetUserId
    );
    return {
      status: 200,
      message: "해당 친구 신청이 거절되었습니다.",
      data: rejectedFriendRequest,
    };
  } catch (error) {
    if (error?.code === "P2025") {
      throw new FriendRequestNotFoundError({ userId, targetUserId });
    }
    throw new FriendInternalError({
      reason: error.message,
      action: "REJECT_REQUEST",
      userId,
      targetUserId,
    });
  }
};

// 7) 친구 삭제
export const deleteFriendRequestData = async (userId, targetUserId) => {
  await assertUsersExistOrThrow(userId, targetUserId);

  try {
    const result = await deleteFriendRequest(userId, targetUserId);
    return {
      status: 200,
      message: "해당 친구 신청이 삭제되었습니다.",
      data: result,
    };
  } catch (error) {
    if (error?.code === "P2025") {
      throw new FriendNotFoundError({ userId, targetUserId });
    }
    throw new FriendInternalError({
      reason: error.message,
      action: "DELETE_FRIEND_REQUEST",
      userId,
      targetUserId,
    });
  }
};
