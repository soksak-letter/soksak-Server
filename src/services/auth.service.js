import bcrypt from "bcrypt"
import { prisma } from "../configs/db.config.js";
import { findUserByEmail, createUserAndAuth, createUserAgreement, findUserByUsername, softDeleteUser } from "../repositories/user.repository.js";
import { generateAccessToken, generateRefreshToken, verifyToken } from "../Auths/token.js";
import { checkEmailRateLimit, createEmailVerifiedKey, getEmailVerifiedKey, getEmailVerifyCode, getHashedPassword, getRefreshToken, revokeToken, saveEmailVerifyCode, saveRefreshToken, updatePassword } from "../repositories/auth.repository.js";
import { createRandomNumber } from "../utils/random.util.js";
import { transporter } from "../configs/mailer.config.js";
import { UserNotFoundError } from "../errors/user.error.js";
import { DuplicatedValueError, InternalServerError } from "../errors/base.error.js";
import { AuthError, InvalidGrantCodeError, InvalidVerificationCodeError, NotRefreshTokenError, RequiredTermAgreementError, UnprocessableProviderError, VerificationRateLimitError } from "../errors/auth.error.js";
import { ALLOWED_PROVIDERS, authConfigs } from "../constants/auth.constant.js";
import axios from "axios";

/**
 * 유저가 서비스에 가입했는지 확인하고 JWT를 반환하는 함수
 * 이미 가입한 경우: DB에 있던 id, email 반환
 * 새로 가입한 경우: user 생성 및 로그인 정보 auth에 저장
 * 
 * 생성된 refresh token은 redis에 저장
 */
export const verifySocialAccount = async ({email, provider, providerUserId}) => {
    if(!email) {
        throw new UserNotFoundError("USER_NOT_FOUND", "존재하지 않는 이메일입니다.");
    }

    let user = await findUserByEmail(email);

    if(user && user.provider !== provider) {
        throw new DuplicatedValueError("USER_EMAIL_DUPLICATED", `이미 ${user.provider}에서 가입한 이메일입니다`, "email");
    }

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

    const payload = { id: user.id, email: user.email, provider: user.provider };
    const jwtAccessToken = generateAccessToken(payload, process.env.JWT_ACCESS_EXPIRED_TIME);
    const jwtRefreshToken = generateRefreshToken(payload, process.env.JWT_REFRESH_EXPIRED_TIME);

    await saveRefreshToken({id: user.id, jwtRefreshToken});
    
    return {
        userId: payload.id,
        tokens: {
            jwtAccessToken,
            jwtRefreshToken
        }
    };
};

export const updateRefreshToken = async (token) => {
    const payload = verifyToken(token);
    const savedRefreshToken = await getRefreshToken(payload.id);

    if(savedRefreshToken !== token) throw new NotRefreshTokenError("AUTH_INVALID_TOKEN", "리프레시 토큰이 아니거나 유효하지 않습니다.");
    const jwtAccessToken = generateAccessToken(payload, process.env.JWT_ACCESS_EXPIRED_TIME);
    return jwtAccessToken;
}

export const signUpUser = async (data) => {
    const passwordHash = await bcrypt.hash(data.password, 10);

    if(!data.termsAgreed || !data.privacyAgreed || !data.ageOver14Agreed) throw new RequiredTermAgreementError("TERM_BAD_REQUEST", "필수 약관에 모두 동의해주세요.");

    const newUser = await prisma.$transaction(async (tx) => {
        const user = await createUserAndAuth({
            user: {
                email: data.email,
                name: data.name,
                phoneNumber: data.phoneNumber
            },
            auth: {
                username: data.username,
                provider: "soksak",                
                passwordHash: passwordHash
            }
        }, tx);
        
        await createUserAgreement({
            userId: user.id,
            termsAgreed: data.termsAgreed,
            privacyAgreed: data.privacyAgreed,
            ageOver14Agreed: data.ageOver14Agreed,
            marketingPushAgreed: data.marketingPushAgreed || false,
            marketingEmailAgreed: data.marketingEmailAgreed || false
        }, tx);

        return user;
    }) 
    const payload = { id: newUser.id, email: newUser.email, provider: newUser.provider};
    const jwtAccessToken = generateAccessToken(payload, process.env.JWT_ACCESS_EXPIRED_TIME);
    const jwtRefreshToken = generateRefreshToken(payload, process.env.JWT_REFRESH_EXPIRED_TIME);

    await saveRefreshToken({id: newUser.id, jwtRefreshToken});

    return { 
        id: payload.id,
        email: payload.email,
        name: newUser.name,
        tokens: {
            jwtAccessToken,
            jwtRefreshToken
        }
    };
}

export const socialLoginUser = (provider) => {
    if(!ALLOWED_PROVIDERS.includes(provider)) {
        throw new UnprocessableProviderError("AUTH_UNPROCESSABLE_PROVIDER", "지원하지 않는 소셜입니다.", provider);
    }
    const config = authConfigs[provider];
    
    const params = new URLSearchParams({
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        response_type: 'code'
    })

    if (config.scope) params.append('scope', config.scope);
    if (config.state) params.append('state', config.state);

    const url = `${config.url}?${params.toString()}`;
    
    return url; 
}

export const socialLoginCertification = async ({provider, code}) => {
    if(!ALLOWED_PROVIDERS.includes(provider)) {
        throw new UnprocessableProviderError("AUTH_UNPROCESSABLE_PROVIDER", "지원하지 않는 소셜입니다.", provider);
    }

    const config = authConfigs[provider];
    const decodedCode = decodeURIComponent(code);

    const params = new URLSearchParams({
        grant_type: config.grantType,
        code: decodedCode,
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uri: config.redirectUri,
    })

    let profile;

    try{
        const tokens = await axios.post(config.tokenUrl, params);

        profile = await axios.get(config.profileUrl, {
            headers: {
                Authorization: `Bearer ${tokens.data.access_token}`
            }
        });
    } catch(err) {
        if (err.response.data.error == "invalid_grant") {
            throw new InvalidGrantCodeError("AUTH_INVALID_GRANT", "유효하지 않은 인가코드입니다.");
        }
        throw err
    }

    return profile;
}

export const loginUser = async ({username, password}) => {
    const user = await findUserByUsername(username);
    if(!user) throw new AuthError("AUTH_BAD_REQUEST", "아이디 또는 비밀번호가 일치하지 않습니다.");

    const passwordHash = await getHashedPassword(username);
    if(!passwordHash) throw new AuthError("AUTH_BAD_REQUEST", "아이디 또는 비밀번호가 일치하지 않습니다.");

    const isValidPassword = await bcrypt.compare(password, passwordHash);
    if(!isValidPassword) throw new AuthError("AUTH_BAD_REQUEST", "아이디 또는 비밀번호가 일치하지 않습니다.");

    const payload = { id: user.id, email: user.email, provider: user.provider};
    const jwtAccessToken = generateAccessToken(payload, process.env.JWT_ACCESS_EXPIRED_TIME);
    const jwtRefreshToken = generateRefreshToken(payload, process.env.JWT_REFRESH_EXPIRED_TIME);

    await saveRefreshToken({id: user.id, jwtRefreshToken});

    return {
        jwtAccessToken,
        jwtRefreshToken
    };
}

export const logoutUser = async ({id, token, ttl}) => {
    const isLogout = await revokeToken(id, token, ttl);
    if(!isLogout) throw new InternalServerError("INTERNAL_SERVER_ERROR", "로그아웃에 실패했습니다. 다시 시도해주세요.");

    return { status: "Logged Out"};
}

export const withdrawUser = async ({provider, id}) => {
    await softDeleteUser(id);

    return { status: "Deleted" };
}

export const checkDuplicatedEmail = async (email) => {
    const user = await findUserByEmail(email);
    
    if(user) {
        throw new DuplicatedValueError("USER_EMAIL_DUPLICATED", `이미 ${user.provider}에서 가입한 이메일입니다`, "email");
    }

    return { exists: false }
}

export const checkDuplicatedUsername = async (username) => {
    const user = await findUserByUsername(username);

    if(user) {
        throw new DuplicatedValueError("USER_USERNAME_DUPLICATED", `이미 존재하는 아이디입니다.`, "username");
    }
    
    return { exists: false }
}

export const SendVerifyEmailCode = async ({email, type}) => {
    const user = await findUserByEmail(email);
    if(!user) throw new UserNotFoundError("USER_NOT_FOUND", "해당 정보로 가입된 계정을 찾을 수 없습니다.", "email");

    const isLocked = await checkEmailRateLimit(email, type);
    if(!isLocked) throw new VerificationRateLimitError("EMAIL_TOO_MANY_REQUEST", "5분 후 다시 시도해주세요.");

    const authCode = createRandomNumber(6);
    await saveEmailVerifyCode({email, authCode, type});

    const expiredAt = new Date(Date.now() + 10 * 60 * 1000);

    const info = await transporter.sendMail({
        from: `"속삭편지" <${process.env.MAILER_USER}>`,
        to: email,
        subject: "[속삭] 회원가입 인증번호",
        html: `<h1>인증번호는 ${authCode} 입니다.</h1>`
    })

    return {
        expiredAt,
        expiredInSeconds: 6 * 100
    };
}

export const checkEmailCode = async ({email, code, type}) => {
    const storedCode = await getEmailVerifyCode(email, type);
    if(storedCode !== code) throw new InvalidVerificationCodeError("EMAIL_INVALID_CODE", "인증번호가 일치하지 않습니다.");

    const result = { verified: true };

    switch (type) {
        case "find-id":
            await createEmailVerifiedKey(email, type);
            break;

        case "reset-password":
            const user = await findUserByEmail(email);
            if(!user) throw new UserNotFoundError("USER_NOT_FOUND", "해당 정보로 가입된 계정을 찾을 수 없습니다.", "email");
            
            result.jwtAccessToken = generateAccessToken(user, "10m");
            break;
            
        default:
            break;
    }

    return result
}

export const getAccountInfo = async (email) => {
    const isValid = await getEmailVerifiedKey(email, "find-id");
    if(!isValid) throw new AuthError("EMAIL_UNAUTHORIZED", "인증되지 않은 이메일입니다.");

    const user = await findUserByEmail(email);
    if(!user) throw new UserNotFoundError("USER_NOT_FOUND", "해당 정보로 가입된 계정을 찾을 수 없습니다.", "email");

    return {
        username: user.username,
        createdAt: user.createdAt
    }
}

export const resetPassword = async ({userId, password}) => {
    const passwordHash = await bcrypt.hash(password, 10);
    await updatePassword({userId, newPassword: passwordHash});

    return { message: "비밀번호 재설정이 완료되었습니다." };
}