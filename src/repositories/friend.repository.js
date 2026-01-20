import { xprisma } from "../xprisma.js";
import { prisma } from "../db.config.js";
import { FriendRequestNotFoundError } from "../errors/friend.error.js";
import { selectLetterByUserIds, selectRecentLetterByUserIds, selectLetterDesignByLetterId } from "./letter.repository.js";

export async function userExistsFriendRequest(receiverUserId, requesterUserId) {
  return await prisma.FriendRequest.findFirst({
    where: {
      requesterUserId: requesterUserId,
      receiverUserId: receiverUserId,
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

export async function selectFriendsRequestByTargetUserId(userId) {
  return await prisma.FriendRequest.findMany({
    where: {
      receiverUserId: userId,
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

export async function acceptFriendRequestTx(receiverUserId, requesterUserId) {
  return prisma.$transaction(async (tx) => {
    console.log("acceptFriendRequestTx args:", { receiverUserId, requesterUserId });
    const result = await tx.FriendRequest.updateMany({
      where: {
        requesterUserId: requesterUserId, 
        receiverUserId: receiverUserId, 
        status: "PENDING",
      },
      data: { status: "ACCEPTED" },
    });
    
    if(!result) throw new FriendRequestNotFoundError(null, "해당 친구 신청을 찾을 수 없습니다.");

    const rows = await tx.FriendRequest.findMany({
      where: {
        OR: [
          { requesterUserId: receiverUserId, receiverUserId: requesterUserId },
          { requesterUserId: requesterUserId, receiverUserId: receiverUserId },
        ],
      },
      select: {
        id: true,
        requesterUserId: true,
        receiverUserId: true,
        status: true,
      },
    });
    console.log("rows (both directions):", rows);

    if (result.count === 0) {
      throw new Error("수락 대기 중인 친구 요청이 없습니다.");
    }

    const userMin = Math.min(userId, targetUserId);
    const userMax = Math.max(userId, targetUserId);

    const friendResult = await tx.Friend.create({
      data: { userAId: userMin, userBId: userMax },
    });

    return friendResult;
  });
}

export async function updateFriendRequestRejectTx(userId, targetUserId) {
  return prisma.$transaction(async (tx) => {
    const result = await tx.FriendRequest.updateMany({
    where: {
        requesterUserId: targetUserId, //4
        receiverUserId: userId, //5
        status: "PENDING",
      },
    data: {
      status: "REJECTED",
    },
  });

  if(!result) throw new FriendRequestNotFoundError(null, "해당 친구 신청을 찾을 수 없습니다.");

  const rejectedResult = await tx.FriendRequest.findFirst({
    where: {
      requesterUserId: targetUserId, //4
        receiverUserId: userId, //5
        status: "REJECTED",
    }
  });

  return rejectedResult;
  });
}

export async function updateFriendRequestReject(userId, targetUserId) {
  const result = await prisma.FriendRequest.updateMany({
    where: {
        requesterUserId: targetUserId, //4
        receiverUserId: userId, //5
        status: "PENDING",
      },
    data: {
      status: "REJECTED",
    },
  });
  return result[0];
} // 친구 신청 거절

export async function selectAllFriendsByUserId(userId) {
  const rows = await xprisma.Friend.findMany({
    where: { OR: [{ userAId: userId }, { userBId: userId }] },
    select: { id: true, userAId: true, userBId: true },
  });
  const friendIds = rows.map((r) => (r.userAId === userId ? r.userBId : r.userAId));
  const uniqueFriendIds = [...new Set(friendIds)];

  const users = await prisma.user.findMany({
    where: { id: { in: uniqueFriendIds } },
    select: { id: true, nickname: true },
  });
  const nicknameById = new Map(users.map((u) => [u.id, u.nickname]));

  // 친구별 메타(편지수 + 최근편지 + 디자인) 캐싱
  const letterMetaEntries = await Promise.all(
    uniqueFriendIds.map(async (fid) => {
      const [letterCount, recentLetter] = await Promise.all([
        selectLetterByUserIds(userId, fid),        // letterCount 반환한다고 가정
        selectRecentLetterByUserIds(userId, fid),  // { id, createdAt } 반환한다고 가정
      ]);

      if (!recentLetter) {
        return [
          fid,
          {
            letterCount,
            recentLetter: null,
          },
        ];
      }

      const design = await selectLetterDesignByLetterId(recentLetter.id);

      return [
        fid,
        {
          letterCount,
          recentLetter: {
            createdAt: recentLetter.createdAt ?? null,
            design
          },
        },
      ];
    })
  );

  const letterMetaByFriendId = new Map(letterMetaEntries);

  return rows.map((r) => {
    const friendUserId = r.userAId === userId ? r.userBId : r.userAId;
    const letterMeta = letterMetaByFriendId.get(friendUserId) ?? {
      letterCount: 0,
      recentLetter: null,
    };

    return {
      id: r.id,
      friendUserId,
      nickname: nicknameById.get(friendUserId) ?? null,
      letterCount: letterMeta.letterCount,
      recentLetter: letterMeta.recentLetter, // null | { createdAt, letterPaperDesign, letterStampDesign }
    };
  });
}

export async function deleteFriendRequest(userId, targetUserId) {
  return await prisma.FriendRequest.deleteMany({
    where: {
        requesterUserId: userId,
        receiverUserId: targetUserId,
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
