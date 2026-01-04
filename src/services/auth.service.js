import bcrypt from "bcrypt"
import { prisma } from "../configs/db.config.js";
import { findUserByEmail, createUserAndAuth, createUserAgreement, findUserByUsername } from "../repositories/user.repository.js";
import { generateAccessToken, generateRefreshToken, verifyToken } from "../Auths/token.js";
import { checkEmailRateLimit, createEmailVerifiedKey, getEmailVerifiedKey, getEmailVerifyCode, getHashedPassword, getRefreshToken, saveEmailVerifyCode, saveRefreshToken, updatePassword } from "../repositories/auth.repository.js";
import { createRandomNumber } from "../utils/random.util.js";
import { transporter } from "../configs/mailer.config.js";

/**
 * 유저가 서비스에 가입했는지 확인하고 JWT를 반환하는 함수
 * 이미 가입한 경우: DB에 있던 id, email 반환
 * 새로 가입한 경우: user 생성 및 로그인 정보 auth에 저장
 * 
 * 생성된 refresh token은 redis에 저장
 */
export const verifySocialAccount = async ({email, provider, providerUserId}) => {
    if(!email) {
        throw new Error(`이메일이 존재하지 않습니다: ${email}`);
    }

    let user = await findUserByEmail(email);

    if(user && user.provider !== provider) {
        throw new Error(`이미 ${user.provider}에서 가입한 이메일입니다`);
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
    const payload = { id: user.id, email: user.email };
    const jwtAccessToken = generateAccessToken(user, "1h");
    const jwtRefreshToken = generateRefreshToken(user, "14d");

    await saveRefreshToken({id: user.id, jwtRefreshToken});
    
    return {
        user: payload,
        jwtAccessToken,
        jwtRefreshToken
    };
};

/**
 * 
 * 
 * @param {string} token 
 * @returns {string} token
 */
export const updateRefreshToken = async (token) => {
    const payload = verifyToken(token);
    const savedRefreshToken = await getRefreshToken(payload.id);

    if(savedRefreshToken !== token) throw new Error("유효하지 않은 토큰입니다.");
    const jwtAccessToken = generateAccessToken(payload, "1h");

    return jwtAccessToken;
}

export const signUpUser = async (data) => {
    const passwordHash = await bcrypt.hash(data.password, 10);

    if(!data.termsAgreed || !data.privacyAgreed || !data.ageOver14Agreed) throw new Error("필수 약관에 모두 동의해주세요.");

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
            marketingAgreed: data.marketingAgreed
        }, tx);

        return user;
    }) 

    return { newUser };
}

export const loginUser = async ({username, password}) => {
    const user = await findUserByUsername(username);
    if(!user) throw new Error("아이디 또는 비밀번호가 일치하지 않습니다.");

    const passwordHash = await getHashedPassword(username);
    if(!passwordHash) throw new Error("아이디 또는 비밀번호가 일치하지 않습니다.");

    const isValidPassword = await bcrypt.compare(password, passwordHash);
    if(!isValidPassword) throw new Error("아이디 또는 비밀번호가 일치하지 않습니다.");

    const payload = { id: user.id, username: user.username };
    const jwtAccessToken = generateAccessToken(user, "1h");
    const jwtRefreshToken = generateRefreshToken(user, "14d");

    await saveRefreshToken({id: user.id, jwtRefreshToken});

    return {
        user: payload,
        jwtAccessToken,
        jwtRefreshToken
    };
}

export const checkDuplicatedEmail = async (email) => {
    const user = await findUserByEmail(email);
    
    if(user) {
        throw new Error(`이미 ${user.provider}에서 가입한 이메일입니다`);
    }

    return { exists: false }
}

export const checkDuplicatedUsername = async (username) => {
    const user = await findUserByUsername(username);

    if(user) {
        throw new Error(`이미 존재하는 아이디입니다.`);
    }
    
    return { exists: false }
}

export const SendVerifyEmailCode = async ({email, type}) => {
    const user = await findUserByEmail(email);
    if(!user) throw new Error("해당 정보로 가입된 계정을 찾을 수 없습니다.");

    const isLocked = await checkEmailRateLimit(email, type);
    if(!isLocked) throw new Error("5분 후 다시 시도해주세요.");

    const authCode = createRandomNumber(6);
    await saveEmailVerifyCode({email, authCode, type});

    const info = await transporter.sendMail({
        from: `"속삭편지" <${process.env.MAILER_USER}>`,
        to: email,
        subject: "[속삭] 회원가입 인증번호",
        html: `<h1>인증번호는 ${authCode} 입니다.</h1>`
    })

    return info;
}

export const checkEmailCode = async ({email, code, type}) => {
    const storedCode = await getEmailVerifyCode(email, type);
    if(storedCode !== code) throw new Error("인증번호가 일치하지 않습니다.");

    const result = { verified: true };

    switch (type) {
        case "find-id":
            await createEmailVerifiedKey(email, type);
            break;

        case "reset-password":
            const user = await findUserByEmail(email);
            if(!user) throw new Error("해당 이메일의 가입정보가 없습니다");
            
            result.jwtAccessToken = generateAccessToken(user, "10m");
            break;
            
        default:
            break;
    }

    return result
}

export const getAccountInfo = async (email) => {
    const isValid = await getEmailVerifiedKey(email, "find-id");
    if(!isValid) throw new Error("인증되지 않은 이메일입니다.");

    const user = await findUserByEmail(email);

    if(!user) throw new Error("해당 이메일의 가입정보가 없습니다");

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