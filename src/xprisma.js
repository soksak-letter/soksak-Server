import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

function normalizeIdFilter(prev) {
  if (prev && typeof prev === "object") return prev;
  if (prev !== undefined) return { equals: prev };
  return {};
}

async function getBlockedUserIds(blockerUserId) {
  const blocked = await prisma.block.findMany({
    where: { blockerUserId: blockerUserId },
    select: { blockedUserId: true },
  });
  return blocked.map((b) => b.blockedUserId);
}

async function applyBlockFilterForPost(args) {
  const blockerUserId = args?.where?.blockerUserId;
  if (blockerUserId == null) return;

  const prevAuthorId = args.where?.authorId;
  delete args.where.blockerUserId;

  const blockedUserIds = await getBlockedUserIds(blockerUserId);
  if (blockedUserIds.length === 0) return;

  args.where = {
    ...args.where,
    authorId: {
      ...normalizeIdFilter(prevAuthorId),
      notIn: blockedUserIds,
    },
  };
}

async function applyBlockFilterForUser(args) {
  const blockerUserId = args?.where?.blockerUserId;
  if (blockerUserId == null) return;

  const prevId = args.where?.id;
  delete args.where.blockerUserId;

  const blockedUserIds = await getBlockedUserIds(blockerUserId);
  if (blockedUserIds.length === 0) return;

  args.where = {
    ...args.where,
    id: {
      ...normalizeIdFilter(prevId),
      notIn: blockedUserIds,
    },
  };
}

async function applyBlockFilterForFriend(args) {
  const blockerUserId = args?.where?.blockerUserId;
  if (blockerUserId == null) return;

  delete args.where.blockerUserId;

  const blockedUserIds = await getBlockedUserIds(blockerUserId);
  if (blockedUserIds.length === 0) return;

  // friend 쿼리는 보통 OR: [{userAId: me},{userBId: me}] 를 함께 쓰겠지?
  // 여기서는 "내가 포함된 친구관계에서, 상대가 blockedUserIds에 있으면 제외"를 추가한다.
  args.where = {
    ...args.where,
    NOT: [
      { userAId: blockerUserId, userBId: { in: blockedUserIds } },
      { userBId: blockerUserId, userAId: { in: blockedUserIds } },
    ],
  };
}

export const xprisma = prisma.$extends({
  query: {
    post: {
      findMany: async ({ args, query }) => {
        await applyBlockFilterForPost(args);
        return query(args);
      },
      findFirst: async ({ args, query }) => {
        await applyBlockFilterForPost(args);
        return query(args);
      },
    },
    user: {
      findMany: async ({ args, query }) => {
        await applyBlockFilterForUser(args);
        return query(args);
      },
      findFirst: async ({ args, query }) => {
        await applyBlockFilterForUser(args);
        return query(args);
      },
    },
    friend: {
      findMany: async ({ args, query }) => {
        await applyBlockFilterForFriend(args);
        return query(args);
      },
      findFirst: async ({ args, query }) => {
        await applyBlockFilterForFriend(args);
        return query(args);
      },
    },
  },
});
