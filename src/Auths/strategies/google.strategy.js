import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import { verifySocialAccount } from "../../services/auth.service.js";
import { createSocialUserDTO } from "../../dtos/auth.dto.js";

/**
 * 구글 로그인 전략 객체 
 */

export const googleStrategy = new GoogleStrategy(
    {
        clientID: process.env.PASSPORT_GOOGLE_CLIENT_ID,
        clientSecret: process.env.PASSPORT_GOOGLE_CLIENT_SECREAT,
        callbackURL: "/auth/callback/google", 
        scope: ["email", "profile"]
    },

    async (accessToken, refreshToken, profile, cb) => {
        try{
            const {userId, tokens} = await verifySocialAccount(createSocialUserDTO(profile));

            return cb(null, {
                id: userId,
                jwtAccessToken: tokens.jwtAccessToken,
                jwtRefreshToken: tokens.jwtRefreshToken
            });
        } catch (err) {
            return cb(err);
        } 
    } 
) 