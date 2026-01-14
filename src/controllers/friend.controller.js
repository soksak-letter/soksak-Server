import {
  postFriendRequest,
  getFriendsList,
  getIncomingFriendRequests,
  getOutgoingFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  deleteFriendData as deleteFriend,
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
  const userId = req.body.userId; // 세션이나 토큰에서 가져오는걸로 변경 필요

  userIsNull(userId);

  try {
    const result = await getFriendsList(userId);
    res
      .status(result.status)
      .json({ data: result.data, message: result.message });
  } catch (error) {
    next(error);
  }
};

export const handlePostFriendsRequest = async (req, res, next) => {
  console.log("1. controller start", req.body);

  const userId = req.body.userId;
  const targetUserId = req.body.targetUserId;

  userIsNull(userId, targetUserId);

  try {
    console.log("2. before service");
    const result = await postFriendRequest(userId, targetUserId);
    console.log("3. after service", result);
return res.status(result.status).json({ message: result.message, data: result.data });
  } catch (error) {
    console.error("controller error", error);
    return next(error);
  }
};


export const handleGetIncomingFriendRequests = async (req, res, next) => {
  // 들어온 친구 신청 목록 조회 로직 구현

  const userId = req.body.userId; // 세션이나 토큰에서 가져오는걸로 변경 필요
  userIsNull(userId);
  try {
    const result = await getIncomingFriendRequests(userId);
    res
      .status(result.status)
      .json({ data: result.data, message: result.message });
  } catch (error) {
    next(error);
  }
};

export const handleGetOutgoingFriendRequests = async (req, res, next) => {
  // 보낸 친구 신청 목록 조회 로직 구현
  const userId = req.body.userId; // 세션이나 토큰에서 가져오는걸로 변경 필요
  console.log("userId1:"+ userId);
  userIsNull(userId);
  console.log("userId2:"+ userId);
  try {
    const result = await getOutgoingFriendRequests(userId);
    res
      .status(result.status)
      .json({ data: result.data, message: result.message });
  } catch (error) {
    next(error);
  }
};

export const handleAcceptFriendRequest = async (req, res, next) => {
  // 친구 신청 수락 로직 구현
  const userId = req.body.userId; // 세션이나 토큰에서 가져오는걸로 변경 필요
  const targetUserId = req.body.targetUserId;
  userIsNull(userId, targetUserId);
  try {
    const result = await acceptFriendRequest(userId, targetUserId);
    res.status(result.status).json({ data: result.data, message: result.message });
  } catch (error) {
    next(error);
  }
};

export const handleRejectFriendRequest = async (req, res, next) => {
  // 친구 신청 거절 로직 구현
  const userId = req.body.userId; // 세션이나 토큰에서 가져오는걸로 변경 필요
  const targetUserId = req.body.targetUserId;
  userIsNull(userId, targetUserId);
  try {
    const result = await rejectFriendRequest(userId, targetUserId);
    res.status(result.status).json({ data: result.data, message: result.message });
  } catch (error) {
    next(error);
  }
};

export const handleDeleteFriend = async (req, res, next) => {
  // 친구 삭제(취소) 로직 구현
  const userId = req.body.userId; // 세션이나 토큰에서 가져오는걸로 변경 필요
  const friendId = req.params.requestId;
  userIsNull(userId, friendId);
  try {
    const result = await deleteFriend(userId, friendId);
    res.status(result.status).json({ data: result.data, message: result.message });
  } catch (error) {
    next(error);
  }
};
