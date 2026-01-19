import { Strategy as NaverStrategy } from "passport-naver-v2";
import { verifySocialAccount } from "../../services/auth.service.js";
import { createSocialUserDTO } from "../../dtos/auth.dto.js";

export const naverStrategy = new NaverStrategy(
    {
        clientID: process.env.PASSPORT_NAVER_CLIENT_ID,
        clientSecret: process.env.PASSPORT_NAVER_CLIENT_SECREAT,
        callbackURL: "/auth/callback/naver",
        scope: ["email", "profile"]
    },

    async (accessToken, refreshToken, profile, cb) => {
        try{
            const {tokens} = await verifySocialAccount(createSocialUserDTO(profile));

            return cb(null, {
                jwtAccessToken: tokens.jwtAccessToken,
                jwtRefreshToken: tokens.jwtRefreshToken
            });
        } catch (err) {
            return cb(err);
        } 
    }
) 