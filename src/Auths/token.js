import dotenv from "dotenv"
import jwt from "jsonwebtoken"

dotenv.config();
const secret = process.env.JWT_SECREAT;

export const generateAccessToken = (user) => {
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