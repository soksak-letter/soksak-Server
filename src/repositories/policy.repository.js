import { prisma } from "../configs/db.config.js";

export const findPolicyDocumentByKey = async (key) => {
  return prisma.policyDocument.findUnique({
    where: { key },
    select: {
      key: true,
      content: true,
      version: true,
      effectiveAt: true,
      updatedAt: true,
    },
  });
};
