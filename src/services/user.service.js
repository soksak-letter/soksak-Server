import { findUserByEmail, createUser } from "../repositories/user.repository.js";
import { generateAccessToken, generateRefreshToken } from "../Auths/token.js";

/**
 * 유저가 서비스에 가입했는지 확인하는 함수
 * 이미 가입한 경우: DB에 있던 id, email 반환
 * 새로 가입한 경우: user 생성 및 로그인 정보 auth에 저장
 */
export const verifyGoogleAccount = async (profile) => {
    const email = profile.emails?.[0].value;
    if(!email) {
        throw new Error(`profile.email was not found: ${profile}`);
    }
    
    const user = await findUserByEmail(email);
    if(!user) {
        user = await createUser(email);    
    }
    
    const payload = { id: user.id, email: user.email };
    const jwtAccessToken = generateAccessToken(user);
    const jwtRefreshToken = generateRefreshToken(user);

    return {
        user: payload,
        jwtAccessToken,
        jwtRefreshToken
    };
};