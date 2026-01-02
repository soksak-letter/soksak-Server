import { Strategy as KakaoStrategy } from "passport-kakao";
import { verifySocialAccount } from "../../services/auth.service.js";
import { createSocialUserDTO } from "../../dtos/auth.dto.js";

export const kakaoStrategy = new KakaoStrategy(
    {
        clientID: process.env.PASSPORT_KAKAO_CLIENT_ID,
        clientSecret: process.env.PASSPORT_KAKAO_CLIENT_SECREAT, 
        callbackURL: "/auth/callback/kakao", 
        scope: ["account_email"]
    },

    async (accessToken, refreshToken, profile, cb) => {
        try{
            const {user, jwtAccessToken, jwtRefreshToken} = await verifySocialAccount(createSocialUserDTO(profile));

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