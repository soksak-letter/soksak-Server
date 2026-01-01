import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import { verifySocialAccount } from "../../services/auth.service.js";

/**
 * 구글 로그인 전략 객체
 * 
 */

console.log("hello");
export const googleStrategy = new GoogleStrategy(
    {
        clientID: process.env.PASSPORT_GOOGLE_CLIENT_ID,
        clientSecret: process.env.PASSPORT_GOOGLE_CLIENT_SECREAT,
        callbackURL: "/auth/callback/google", 
        scope: ["email", "profile"]
    },

    async (accessToken, refreshToken, profile, cb) => {
        try{
            const {user, jwtAccessToken, jwtRefreshToken} = await verifySocialAccount(profile);

            return cb(null, {
                id: user.id,
                jwtAccessToken,
                jwtRefreshToken
            });
        } catch (err) {
            return cb(err);
        } 
    } 
) 