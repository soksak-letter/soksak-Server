export const authConfigs = {
    google: {
        url: "https://accounts.google.com/o/oauth2/v2/auth",
        tokenUrl: "https://oauth2.googleapis.com/token",
        profileUrl: "https://www.googleapis.com/oauth2/v2/userinfo",
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECREAT,
        redirectUri: process.env.GOOGLE_REDIRECT_URI,
        scope: "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
        grantType: 'authorization_code'
    },
    kakao: {
        url: "https://kauth.kakao.com/oauth/authorize",
        tokenUrl: "https://kauth.kakao.com/oauth/token",
        profileUrl: "https://kapi.kakao.com/v2/user/me",
        clientId: process.env.KAKAO_CLIENT_ID,
        clientSecret: process.env.KAKAO_CLIENT_SECREAT,
        redirectUri: process.env.KAKAO_REDIRECT_URI,
        scope: "account_email",
        grantType: 'authorization_code'
    },
    naver: {
        url: "https://nid.naver.com/oauth2.0/authorize",
        tokenUrl: "https://nid.naver.com/oauth2.0/token",
        profileUrl: "https://openapi.naver.com/v1/nid/me",
        clientId: process.env.NAVER_CLIENT_ID,
        clientSecret: process.env.NAVER_CLIENT_SECREAT,
        redirectUri: process.env.NAVER_REDIRECT_URI,
        scope: "email profile",
        state: "random_state_string",
        grantType: 'authorization_code'
    }
};

export const ALLOWED_PROVIDERS = ["google", "kakao", "naver"];