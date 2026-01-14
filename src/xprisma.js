import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function normalizeIdFilter(prev) {
  if (prev && typeof prev === "object") return prev;
  if (prev !== undefined) return { equals: prev };
  return {};
}

async function applyBlockFilter(args) {
  const blockerUserId = args?.where?.blockerId;
  if (blockerUserId == null) return;

  const prevAuthorId = args.where?.authorId;

  delete args.where.blockerId;

  const blockedUserIds = await prisma.block.findMany({
    where: { blockerId: blockerUserId },
    select: { blockedId: true },
  });

  const blockedIds = blockedUserIds.map((b) => b.blockedId);
  if (blockedIds.length === 0) return;

  args.where = {
    ...args.where,
    authorId: {
      ...normalizeIdFilter(prevAuthorId),
      notIn: blockedIds,
    },
  };
}

export const xprisma = prisma.$extends({
  query: {
    post: {
      findMany: async ({ args, query }) => {
        await applyBlockFilter(args);
        return query(args);
      },
      findFirst: async ({ args, query }) => {
        await applyBlockFilter(args);
        return query(args);
      },
    },
  },
});