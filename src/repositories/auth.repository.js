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

export const getHashedPassword = async (username) => {
    const {passwordHash} = await prisma.auth.findFirst({ select: { passwordHash: true }, where: { username } });

    return passwordHash;
}

export const saveEmailVarifyCode = async ({email, authCode}) => {
    await redis.set(`emailVerifyNumber:${email}`, authCode, {
        EX: 60 * 10 // 10분
    });
}

export const checkEmailRateLimit = async (email) => {
    const isLocked = await redis.set(`limit:send-email:${email}`, "locked", {
        NX: true,   // 중복 저장 방지
        EX: 60 * 5  // 5분
    })

    return isLocked
}

export const getEmailVarifyCode = async (email) => {
    const authCode = await redis.get(`emailVerifyNumber:${email}`);

    return authCode;
}