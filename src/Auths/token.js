import jwt from "jsonwebtoken"

const secret = process.env.JWT_SECREAT;

export const generateAccessToken = (user) => {
    console.log(user.id + " " + user.email);
    return jwt.sign(
        { id: user.id, email: user.email },
        secret,
        { expiresIn: '1h' }
    );
};

export const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email},
        secret,
        { expiresIn: '14d'}
    );
};

export const verifyToken = (token) => {
    return jwt.verify(token, secret);
}