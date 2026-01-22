import {
  postFriendRequest,
  getFriendsList,
  getIncomingFriendRequests,
  getOutgoingFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  deleteFriendRequestData as deleteFriendRequest,
} from "../services/friend.service.js";

function userIsNull(...users) {
  const isInvalid = users.some((u) => !u || u.isNull);

  if (isInvalid) {
    throw {
      status: 400,
      errorCode: "FRIEND_400",
      reason: "유저 정보가 올바르지 않습니다.",
      data: null,
    };
  }
}
export const handleGetFriendsList = async (req, res, next) => {
  // 친구 목록 조회 로직 구현
  const userId = req.user.id;

  userIsNull(userId);

  try {
    const result = await getFriendsList(userId);
    return res.success({
      message: "친구 조회가 성공적으로 처리되었습니다.",
      result,
    });
  } catch (error) {
    next(error);
  }
};

export const handlePostFriendsRequest = async (req, res, next) => {
  const userId = req.user.id;
  const targetUserId = req.body.targetUserId;
  const sessionId = req.body.sessionId;

  userIsNull(userId, targetUserId);

  try {
    const result = await postFriendRequest(userId, targetUserId, sessionId);
    return res.success({ message: "친구 신청이 완료되었습니다.", result });
  } catch (error) {
    return next(error);
  }
};

export const handleGetIncomingFriendRequests = async (req, res, next) => {
  // 들어온 친구 신청 목록 조회 로직 구현

  const userId = req.user.id;
  userIsNull(userId);
  try {
    const result = await getIncomingFriendRequests(userId);
    return res.success({ message: "들어온 친구 신청 목록 조회가 성공하였습니다.", result });
  } catch (error) {
    next(error);
  }
};

export const handleGetOutgoingFriendRequests = async (req, res, next) => {
  // 보낸 친구 신청 목록 조회 로직 구현
  const userId = req.user.id;
  userIsNull(userId);
  try {
    const result = await getOutgoingFriendRequests(userId);
    return res.success({ message: "보낸 친구 신청 목록 조회가 성공하였습니다.", result });
  } catch (error) {
    next(error);
  }
};

export const handleAcceptFriendRequest = async (req, res, next) => {
  // 친구 신청 수락 로직 구현
  const userId = req.user.id;
  const targetUserId = req.body.targetUserId;
  userIsNull(userId, targetUserId);
  try {
    const result = await acceptFriendRequest(userId, targetUserId);
    return res.success({ message: "친구 신청 수락이 성공하였습니다.", result });
  } catch (error) {
    next(error);
  }
};

export const handleRejectFriendRequest = async (req, res, next) => {
  // 친구 신청 거절 로직 구현
  const userId = req.user.id;
  const targetUserId = req.body.targetUserId;
  userIsNull(userId, targetUserId);
  try {
    const result = await rejectFriendRequest(userId, targetUserId);
    return res.success({ message: "친구 신청 거절이 성공하였습니다.", result });
  } catch (error) {
    next(error);
  }
};

export const handleDeleteFriendRequest = async (req, res, next) => {
  // 친구 신청 취소 로직
  const userId = req.user.id;
  const targetUserId = Number(req.params.targetUserId);
  userIsNull(userId, targetUserId);
  try {
    const result = await deleteFriendRequest(userId, targetUserId);
    return res.success({ message: "친구 신청 취소가 성공하였습니다.", result });
  } catch (error) {
    next(error);
  }
};
