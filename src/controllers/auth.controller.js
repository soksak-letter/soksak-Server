import { checkEmail, signUpUser, loginUser, updateRefreshToken, verifyEmail } from "../services/auth.service.js";

export const handleSignUp = async (req, res, next) => {
    const { email } = req.body;
    try{
        await checkEmail(email);
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

export const handleCheckEmail = async (req, res, next) => {
    const { email } = req.body;
    try{
        const { exists } = await checkEmail(email); 
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

export const handleVerifyEmail = async (req, res, next) => {
    try{
        const result = await verifyEmail(req.body);

        res.status(200).success(result);
    } catch(err) {
        next(err);
    }
}