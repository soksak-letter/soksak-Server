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
} from "../errors/friend.error.js";

async function userExistsOrThrow(userId) {
  const userById = await findUserById(userId);
  if (!userById)
    throw new InvalidUserError();
}

async function assertUsersExistOrThrow(userId, targetUserId) {
  const [userById, targetUserById] = await Promise.all([
    findUserById(userId),
    findUserById(targetUserId),
  ]);

  if (!userById)
    throw new InvalidUserError();
  if (!targetUserById)
    throw new InvalidUserError(
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
      });
    }
    return result;
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
        throw new FriendRequestAlreadyExistsError();
      } else {
        throw new AlreadyFriendsError();
      }
    }
    throw new FriendInternalError();
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
    return friendsList;
  } catch (error) {
     if (error instanceof FriendNotFoundError) throw error;
    throw new FriendInternalError();
  }
};

// 3) 들어온 친구 신청 목록 조회
export const getIncomingFriendRequests = async (userId) => {
  await userExistsOrThrow(userId);

  try {
    const incomingRequests = await selectFriendsRequestByTargetUserId(userId);
    if (incomingRequests.length === 0) {
      throw new FriendRequestNotFoundError();
    }
    return incomingRequests;
  } catch (error) {
     if (error instanceof FriendRequestNotFoundError) throw error;
    throw new FriendInternalError();
  }
};

// 4) 보낸 친구 신청 목록 조회
export const getOutgoingFriendRequests = async (userId) => {
  await userExistsOrThrow(userId);
  try {
    const outgoingRequests = await selectFriendsRequestByUserId(userId);
    if (outgoingRequests.length === 0) {
      throw new FriendRequestNotFoundError();
    }
    return outgoingRequests;
  } catch (error) {
     if (error instanceof FriendRequestNotFoundError) throw error;
    throw new FriendInternalError();
  }
};

// 5) 친구 신청 수락
export const acceptFriendRequest = async (receiverUserId, requesterUserId) => {
  await assertUsersExistOrThrow(receiverUserId, requesterUserId);

  const req = await userExistsFriendRequest(receiverUserId, requesterUserId);
  if (!req) throw new FriendRequestNotFoundError({ receiverUserId, requesterUserId });

  try {
    const result = await acceptFriendRequestTx(receiverUserId, requesterUserId);
    return result;
  } catch (error) {
    if (error?.message === "수락 대기 중인 친구 요청이 없습니다.") {
      throw new FriendRequestNotFoundError();
    }
    if (error?.code === "P2025") {
      throw new FriendRequestNotFoundError();
    } else if (error?.code === "P2002") {
      throw new AlreadyFriendsError();
    }
    throw new FriendInternalError();
  }
};

// 6) 친구 신청 거절
export const rejectFriendRequest = async (receiverUserId, requesterUserId) => {
  await assertUsersExistOrThrow(receiverUserId, requesterUserId);

  try {
    const rejectedFriendRequest = await updateFriendRequestRejectTx(
      receiverUserId, requesterUserId
    );
    return rejectedFriendRequest;
  } catch (error) {
    if (error?.code === "P2025") {
      throw new FriendRequestNotFoundError();
    }
    throw new FriendInternalError();
  }
};

// 7) 친구 삭제
export const deleteFriendRequestData = async (requesterUserId, receiverUserId) => {
  await assertUsersExistOrThrow(receiverUserId, requesterUserId);

  try {
    const result = await deleteFriendRequest(receiverUserId, requesterUserId);
    if(result.count === 0)throw new FriendRequestNotFoundError();
    return result;
  } catch (error) {
     if (error instanceof FriendRequestNotFoundError) throw error;
    if (error?.code === "P2025") {
      throw new FriendRequestNotFoundError();
    }
    throw new FriendInternalError();
  }
};
