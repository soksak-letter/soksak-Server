import axios from "axios";
import { getTTLFromToken } from "../Auths/token.js";
import { checkDuplicatedEmail, checkDuplicatedUsername, signUpUser, loginUser, updateRefreshToken, SendVerifyEmailCode, checkEmailCode, getAccountInfo, resetPassword, logoutUser, withdrawUser, verifySocialAccount, socialLoginUser, socialLoginCertification } from "../services/auth.service.js";
import { createSocialUserDTO } from "../dtos/auth.dto.js";

export const handleSignUp = async (req, res, next) => {
    const { email, username } = req.body;
    try{
        await checkDuplicatedEmail(email);
        await checkDuplicatedUsername(username);
        const result = await signUpUser(req.body);

        res.status(200).success({ result });
    } catch(err) {
        next(err);
    }
}

export const handleLogin = async (req, res, next) => {
    try{
        const result = await loginUser(req.body);

        res.status(200).success({ result });
    } catch(err) {
        next(err);
    }
}

export const handleSocialLogin = async (req, res, next) => {
    const { provider } = req.params;
    
    try{
        const url = socialLoginUser(provider);
        
        res.redirect(url);
    } catch(err) {
        next(err);
    }
}

export const handleSocialLoginCertification = async (req, res, next) => {
    try{
        const { provider } = req.params;
        const { code } = req.body;

        const profile = await socialLoginCertification({provider, code});
        const tokens = await verifySocialAccount(createSocialUserDTO({provider, profile}))

        res.status(200).success(tokens);
    } catch(err) {
        next(err);
    }
}

export const handleSocialLoginCallback = (req, res) => {
    const { id, jwtAccessToken, jwtRefreshToken } = req.user;
    const { provider } = req.params;

    res.cookie('accessToken', jwtAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',      // CSRF 보호 및 교차 사이트 요청 허용 설정
      maxAge: 3600000       // 한 시간
    });

    res.cookie('refreshToken', jwtRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 14 * 24 * 3600000 // 14일
    });
    
    const frontendUrl = `${process.env.FRONTEND_CALLBACK_URL}?userId=${id}&provider=${provider}`;

    res.redirect(frontendUrl);
}

export const handleLogout = async (req, res, next) => {
    const {id, provider, token} = req.user;
    const ttl = getTTLFromToken(token);

    try{
        const result = await logoutUser({id, provider, token, ttl});

        res.status(200).success({ result });
    } catch(err) {
        next(err);
    }
}

export const handleWithdrawUser = async (req, res, next) => {
    const {id, provider, token} = req.user;
    const ttl = getTTLFromToken(token);

    try{
        const result = await withdrawUser({provider, id});
        await logoutUser({id, provider, token, ttl});

        res.status(200).success({ result });
    } catch(err) {
        next(err);
    }
}

export const handleCheckDuplicatedEmail = async (req, res, next) => {
    const { email } = req.body;
    try{
        const { exists } = await checkDuplicatedEmail(email); 
        res.status(200).success({ exists });
    } catch(err) {
        next(err);
    }
}

export const handleCheckDuplicatedUsername = async (req, res, next) => {
    const { username } = req.body;
    try{
        const { exists } = await checkDuplicatedUsername(username);
        res.status(200).success({ exists });
    } catch(err) {
        next(err);
    }
}

export const handleRefreshToken = async (req, res, next) => {
    try{
        const authHeader = req.get("authorization");

        if(!authHeader || !authHeader.startsWith('Bearer ')) throw new Error();

        const token = authHeader.split(" ")[1];

        const jwtAccessToken = await updateRefreshToken(token);

        res.status(200).success({jwtAccessToken});
    } catch(err) {
        next(err);
    }
}

export const handleSendVerifyEmailCode = async (req, res, next) => {
    const {type} = req.params;
    const {email} = req.body;

    try{
        const result = await SendVerifyEmailCode({email, type});

        res.status(200).success(result);
    } catch(err) {
        next(err);
    }
}

export const handleCheckEmailCode = async (req, res, next) => {
    const {type} = req.params;
    const {email, code} = req.body;
    try{
        const result = await checkEmailCode({email, code, type});

        res.status(200).success(result);
    } catch(err) {
        next(err);
    }
}

export const handleGetAccountInfo = async (req, res, next) => {
    const {email} = req.body;
    try{
        const result = await getAccountInfo(email);

        res.status(200).success(result);
    } catch(err) {
        next(err);
    }
}

export const handleResetPassword = async (req, res, next) => {
    const userId = req.user.id;
    const {password} = req.body;
    try{
        const result = await resetPassword({userId, password});

        res.status(200).success(result);
    } catch(err) {
        next(err);
    }
}