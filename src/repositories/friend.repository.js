import { xprisma } from "../xprisma.js";
import { prisma } from "../db.config.js";

export async function userExistsFriendRequest(userId, targetUserId) {
  return await xprisma.FriendRequest.findFirst({
    where: {
      requesterUserId: targetUserId,
      receiverUserId: userId,
    },
  });
} // 친구 신청 존재 여부 확인

export async function insertFriendRequest(userId, targetUserId, sessionId) {
  return await prisma.FriendRequest.create({
    data: {
      requesterUserId: userId,
      receiverUserId: targetUserId,
      sessionId: sessionId,
      status: "PENDING",
    },
  });
} // 친구 신청 추가

export async function selectFriendsRequestByUserId(userId) {
  return await prisma.FriendRequest.findMany({
    where: {
      requesterUserId: userId,
      status: "PENDING",
    },
  });
} // 내가 보낸 친구 신청 목록 조회

export async function selectFriendsRequestByTargetUserId(targetUserId) {
  return await prisma.FriendRequest.findMany({
    where: {
      receiverUserId: targetUserId,
      status: "PENDING",
    },
  });
} // 나에게 온 친구 신청 목록 조회

export async function updateFriendRequestAccept(userId, targetUserId) {
  return await prisma.FriendRequest.update({
    where: {
      requesterUserId_receiverUserId: {
        requesterUserId: targetUserId,
        receiverUserId: userId,
      },
    },
    data: {
      status: "ACCEPTED",
    },
  });
} // 친구 신청 수락

export async function insertFriend(userId, targetUserId) {
  return await prisma.Friend.create({
    data: {
      userAId: userId,
      userBId: targetUserId,
    },
  });
} // 친구 테이블에 친구 추가

export async function acceptFriendRequestTx(userId, targetUserId) {
  return prisma.$transaction(async (tx) => {
    const result = await tx.FriendRequest.updateMany({
      where: {
        requesterUserId: targetUserId,
        receiverUserId: userId,
        status: "PENDING",
      },
      data: { status: "ACCEPTED" },
    });

    if (result.count === 0) {
      throw new Error("수락 대기 중인 친구 요청이 없습니다.");
    }

    const userMin = Math.min(userId, targetUserId);
    const userMax = Math.max(userId, targetUserId);

    await tx.Friend.create({
      data: { userAId: userMin, userBId: userMax },
    });

    return true;
  });
}

export async function updateFriendRequestReject(userId, targetUserId) {
  return await prisma.FriendRequest.update({
    where: {
      requesterUserId_receiverUserId: {
        requesterUserId: targetUserId,
        receiverUserId: userId,
      },
    },
    data: {
      status: "REJECTED",
    },
  });
} // 친구 신청 거절

export async function selectAllFriendsByUserId(userId) {
  return await xprisma.Friend.findMany({
    where: {
      OR: [{ userAId: userId }, { userBId: userId }],
    },
  });
} // 유저의 모든 친구 목록 조회

export async function deleteFriend(userId, targetUserId) {
  return await prisma.FriendRequest.delete({
    where: {
      requesterUserId_receiverUserId: {
        requesterUserId: userId,
        receiverUserId: targetUserId,
      },
    },
  });
} // 친구 신청 삭제

export const findFriendById = async (userId, friendId) => {
  const isFriend = await xprisma.friend.findFirst({
    where: {
      OR: [
        { userAId: userId, userBId: friendId },
        { userAId: friendId, userBId: userId }
      ]
    },
  })

  if(!isFriend) return null;

  const friend = await prisma.user.findFirst({
    where: { id: friendId }
  });

  return friend;
} // 특정 친구 조회