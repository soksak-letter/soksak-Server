import { prisma } from "../db.config.js";
import { xprisma } from "../xprisma.js";

export const insertUserReport = async(reporterUserId, targetUserId, letterId) => {  
    const result = await prisma.userReport.create({
        data: {
            reporterUserId: reporterUserId,
            targetUserId: targetUserId,
            letterId: letterId,
            status: "PENDING",
            createdAt: new Date(),
        }
    });
    return result;
}

export const insertUserReportReason = async (reportId, reasons) => {
  // reasons: string[]
  if (!Array.isArray(reasons) || reasons.length === 0) {
    return { count: 0 }; // 또는 throw
  }

  return await prisma.userReportReason.createMany({
    data: reasons.map((reason) => ({
      reportId,
      reason, // ✅ 한 행당 reason은 문자열 1개
    })),
    // skipDuplicates: true, // (선택) unique 제약이 있을 때 중복 무시
  });
};

export const getUserReportAndReasonByUserId = async(reporterUserId) => {
    const result = await prisma.userReport.findMany({
        where: {
            reporterUserId
        },
        select: {
            createdAt: true,
            status: true,
            reasons: {
                select: { reason: true }
            }
        }
    })
    return result;
}   