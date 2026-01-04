import { checkDuplicatedEmail, checkDuplicatedUsername, signUpUser, loginUser, updateRefreshToken, SendVerifyEmailCode, checkEmailCode, getAccountInfo, resetPassword } from "../services/auth.service.js";

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
    try{
        const { exists } = await checkDuplicatedUsername(email);
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