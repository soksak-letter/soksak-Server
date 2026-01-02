import bcrypt from "bcrypt"
import { findUserByEmail, createUserAndAuth } from "../repositories/user.repository.js";
import { generateAccessToken, generateRefreshToken, verifyToken } from "../Auths/token.js";
import { getRefreshToken, saveRefreshToken } from "../repositories/auth.repository.js";

/**
 * 유저가 서비스에 가입했는지 확인하고 JWT를 반환하는 함수
 * 이미 가입한 경우: DB에 있던 id, email 반환
 * 새로 가입한 경우: user 생성 및 로그인 정보 auth에 저장
 * 
 * 생성된 refresh token은 redis에 저장
 */
export const verifySocialAccount = async ({email, provider, providerUserId}) => {
    if(!email) {
        throw new Error(`이메일이 존재하지 않습니다: ${email}`);
    }

    let user = await findUserByEmail(email);

    if(user && user.provider !== provider) {
        throw new Error(`이미 ${user.provider}에서 가입한 이메일입니다`);
    }

    if(!user) {
        user = await createUserAndAuth({
            user: {
                email
            },
            auth: {
                provider: provider,
                providerUserId: providerUserId
            }
        });
    }
    const payload = { id: user.id, email: user.email };
    const jwtAccessToken = generateAccessToken(user);
    const jwtRefreshToken = generateRefreshToken(user);

    saveRefreshToken({id: user.id, jwtRefreshToken});
    
    return {
        user: payload,
        jwtAccessToken,
        jwtRefreshToken
    };
};

export const updateRefreshToken = async (token) => {
    const payload = verifyToken(token);
    const savedRefreshToken = await getRefreshToken(payload.id);

    if(savedRefreshToken !== token) throw new Error("유효하지 않은 토큰입니다.");
    const jwtAccessToken = generateAccessToken(payload);

    return jwtAccessToken;
}

export const createUser = async (data) => {
    const hashedPassword = await saveHashedPassword();

    user = await createUserAndAuth({
        user: {
            email: data.email,
            name: data.name,
            phoneNumber: data.phoneNumber
        },
        auth: {
            provider: "soksak",
            hashedPassword: hashedPassword
        }
    });
}

export const checkEmail = async (email) => {
    const user = await findUserByEmail(email);
    
    if(user) {
        throw new Error(`이미 ${user.provider}에서 가입한 이메일입니다`);
    }

    return { exists: false }
}