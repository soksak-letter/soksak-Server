export const createSocialUserDTO = (socialData) => {
    switch(socialData.provider) {
        case "google" :
            return {
                email: socialData.profile.data.email,
                provider: socialData.provider,
                providerUserId: socialData.profile.data.id
            }
        case "kakao" : 
            return {
                email: socialData.profile.data.kakao_account.email,
                provider: socialData.provider,
                providerUserId: socialData.profile.data.id.toString()
            }
        case "naver" : 
            return {
                email: socialData.profile.data.response.email,
                provider: socialData.provider,
                providerUserId: socialData.profile.data.response.id
            }
        default:
            throw new Error(`지원하지 않는 소셜입니다: ${socialData.provider}`);
    }
}