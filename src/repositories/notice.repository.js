import { prisma } from "../configs/db.config.js";

export const findActiveNotices = async () => {

  return prisma.notice.findMany({
    orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      title: true,
      summary: true,
      pinned: true,
      createdAt: true,
    },
  });
};

export const findNoticeById = async (id) => {
  return prisma.notice.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      content: true,
      pinned: true,
      createdAt: true,
    },
  });
};
