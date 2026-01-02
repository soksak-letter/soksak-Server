import jwt from "jsonwebtoken"

export const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_ACCESS_SECREAT,
        { expiresIn: '1h' }
    );
};

export const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email},
        process.env.JWT_REFRESH_SECREAT,
        { expiresIn: '14d'}
    );
};

export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_REFRESH_SECREAT);
}