import { prisma } from "../configs/db.config.js";
import { redis } from "../configs/db.config.js";

export const saveRefreshToken = async ({id, jwtRefreshToken}) => {
    await redis.set(`refreshToken:${id}`, jwtRefreshToken, {
        EX: 60 * 60 * 24 * 14 // 14일
    });
}

export const getRefreshToken = async (id) => {
    const value = await redis.get(`refreshToken:${id}`);
    
    return value;
}

export const getHashedPassword = async (email) => {
    const {passwordHash} = await prisma.auth.findFirst({ select: { passwordHash: true }, where: { email: email } });
    console.log(passwordHash);
    return passwordHash;
}