import { prisma, redis } from "../configs/db.config.js";

export const saveRefreshToken = async ({id, jwtRefreshToken}) => {
    await redis.set(`refreshToken:${id}`, jwtRefreshToken, {
        EX: 60 * 60 * 24 * 14 // 14일
    });
}

export const getRefreshToken = async (id) => {
    const value = await redis.get(`refreshToken:${id}`);
    
    return value;
}

export const revokeToken = async (id, token, ttl) => {
    const result = await redis.unlink(`refreshToken:${id}`);

    await redis.set(`blackList:accessToken:${token}`, "blackList", {
        EX: ttl
    })

    return result;
}

export const getBlackListToken = async (token) => {
    const value = await redis.get(`blackList:accessToken:${token}`);

    return value;
}

export const getHashedPasswordByUsername = async (username) => {
    const {passwordHash} = await prisma.auth.findFirst({ select: { passwordHash: true }, where: { username } });

    return passwordHash;
}

export const getHashedPasswordByUserId = async (userId) => {
    const {passwordHash} = await prisma.auth.findFirst({ select: { passwordHash: true }, where: { userId } });

    return passwordHash;
}

export const saveEmailVerifyCode = async ({email, authCode, type}) => {
    await redis.set(`emailVerifyNumber:${type}:${email}`, authCode, {
        EX: 60 * 10 // 10분
    });
}

export const checkEmailRateLimit = async (email, type) => {
    const isLocked = await redis.set(`limit:send-email:${type}:${email}`, "locked", {
        NX: true,   // 중복 저장 방지
        EX: 60 * 5  // 5분
    })

    return isLocked
}

export const getEmailVerifyCode = async (email, type) => {
    const authCode = await redis.get(`emailVerifyNumber:${type}:${email}`);

    return authCode;
}

/**
 * 이메일 인증 성공시 2분간 아이디 접근 권한 생성
 * 
 * @param {string} email 
 * @param {string} type 
 */
export const createEmailVerifiedKey = async (email, type) => {
    await redis.set(`${type}:varified:${email}`, "pass", { 
        EX: 60 * 2 // 2분
    })
}

export const getEmailVerifiedKey = async (email, type) => {
    const isValid = await redis.get(`${type}:varified:${email}`);

    return isValid;
}

export const updatePassword = async ({userId, newPassword}) => {

    await prisma.auth.update({
        data: {
            passwordHash: newPassword
        },
        where: {
            userId: userId
        }
    });
}