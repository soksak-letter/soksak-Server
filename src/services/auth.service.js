import { findUserByEmail, createUserAndAuth } from "../repositories/user.repository.js";
import { generateAccessToken, generateRefreshToken } from "../Auths/token.js";

/**
 * 유저가 서비스에 가입했는지 확인하고 JWT를 반환하는 함수
 * 이미 가입한 경우: DB에 있던 id, email 반환
 * 새로 가입한 경우: user 생성 및 로그인 정보 auth에 저장
 */
export const verifySocialAccount = async ({email, provider, providerUserId}) => {
    if(!email) {
        throw new Error(`이메일이 존재하지 않습니다: ${email}`);
    }

    const user = await findUserByEmail(email);

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
    console.log("hello");
    return {
        user: payload,
        jwtAccessToken,
        jwtRefreshToken
    };
};