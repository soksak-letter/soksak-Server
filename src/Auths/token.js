import jwt from "jsonwebtoken"

export const generateAccessToken = (user, duration) => {
    return jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_ACCESS_SECREAT,
        { expiresIn: duration }
    );
};

export const generateRefreshToken = (user, duration) => {
    return jwt.sign(
        { id: user.id, email: user.email},
        process.env.JWT_REFRESH_SECREAT,
        { expiresIn: duration }
    );
};

export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_REFRESH_SECREAT);
}