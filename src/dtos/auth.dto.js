export const createSocialUserDTO = (profile) => {

    switch(profile.provider) {
        case "google" :
            return {
                email: profile.emails?.[0]?.value,
                provider: profile.provider,
                providerUserId: profile.id
            }
        case "kakao" : 
            return {
                email: profile._json?.kakao_account?.email,
                provider: profile.provider,
                providerUserId: profile.id.toString()
            }
        case "naver" : 
            return {
                email: profile.email,
                provider: profile.provider,
                providerUserId: profile.id
            }
        default:
            throw new Error(`지원하지 않는 소셜입니다: ${profile.provider}`);
    }
}