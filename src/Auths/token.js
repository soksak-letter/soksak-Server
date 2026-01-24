import jwt from "jsonwebtoken"

export const generateAccessToken = (user, duration) => {
    console.log(duration);
    return jwt.sign(
        { id: user.id, email: user.email, provider: user.provider, type: "ACCESS" },
        process.env.JWT_ACCESS_SECREAT,
        { expiresIn: duration }
    );
};

export const generateRefreshToken = (user, duration) => {
    return jwt.sign(
        { id: user.id, email: user.email, provider: user.provider, type: "REFRESH" },
        process.env.JWT_REFRESH_SECREAT,
        { expiresIn: duration }
    );
};

export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_REFRESH_SECREAT);
}

/**
 * 토큰에서 TTL을 추출하는 함수
 * 
 * @param {string} token 
 */
export const getTTLFromToken = (token) => {
    const payload = jwt.decode(token);

    const now = Math.floor(Date.now() / 1000);
    const ttl = payload.exp - now;

    return ttl;
}