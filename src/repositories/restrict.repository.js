import { prisma } from "../configs/db.config.js";

export const findRestrictById = async(userId) => {
    const result = await prisma.restriction.findMany({
        where: {
            userId
        }
    })
}