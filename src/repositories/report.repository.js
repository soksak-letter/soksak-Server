import { prisma } from "../db.config.js";
import { xprisma } from "../xprisma.js";

export const insertUserReport = async (reporterUserId, targetUserId, letterId) => {
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
    if (!Array.isArray(reasons) || reasons.length === 0) {
        return { count: 0 }; // 또는 throw
    }

    return await prisma.userReportReason.createMany({
        data: reasons.map((reason) => ({
            reportId,
            reason, 
        })),
    });
};

export const getUserReportAndReasonByUserId = async (reporterUserId) => {
    const result = await prisma.userReport.findMany({
        where: {
            reporterUserId
        },
        select: {
            id: true,
            createdAt: true,
            status: true,
            reasons: {
                select: { reason: true }
            }
        }
    })
    return result;
}

export const getUserReportAndReasonByReportId = async (reporterUserId, id) => {
    return await prisma.userReport.findFirst({
        where: {
            id,
            reporterUserId
        },
        select: {
            id: true,
            reporterUserId: true,
            targetUserId: true,
            letterId: true,
            status: true,
            createdAt: true,
            reasons: {
                select: { reason: true }
            }
        }
    })
}