import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import { generateAccessToken, generateRefreshToken } from "../token.js";
import { prisma } from "../../configs/db.config.js"

/**
 * 유저가 서비스에 가입했는지 확인하는 함수
 * 이미 가입한 경우: DB에 있던 id, email 반환
 * 새로 가입한 경우: user 생성 및 로그인 정보 auth에 저장
 */
const googleVerify = async (profile) => {
    const email = profile.emails?.[0].value;
    if(!email) {
        throw new Error(`profile.email was not found: ${profile}`);
    }

    const user = await prisma.user.findFirst({ where: { email: email } });
    if(user !== null) {
        return { id: user.id, email: user.email };
    }

    const newUser = await prisma.user.create({ data: { email: email } });
    
    return { id: newUser.id, email: newUser.email};
}

/**
 * 구글 로그인 전략 객체
 * 
 */
export const googleStrategy = new GoogleStrategy(
    {
        clientID: process.env.PASSPORT_GOOGLE_CLIENT_ID,
        clientSecret: process.env.PASSPORT_GOOGLE_CLIENT_SECREAT,
        callbackURL: "/oauth2/callback/google", 
        scope: ["email", "profile"]
    },

    async (accessToken, refreshToken, profile, cb) => {
        try{
            const user = await googleVerify(profile);

            const jwtAccessToken = generateAccessToken(user);
            const jwtRefreshToken = generateRefreshToken(user);

            return cb(null, {
                accessToken: jwtAccessToken,
                refreshToken: jwtRefreshToken
            });
        } catch (err){
            return cb(err);
        } 
    } 
) 