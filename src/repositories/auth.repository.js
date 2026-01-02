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