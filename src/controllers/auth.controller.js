import { checkEmail, updateRefreshToken } from "../services/auth.service.js";

export const handleSignUp = async (req, res, next) => {
    try{
        
        res.status(200).success();
    } catch(err) {
        next(err);
    }
}

export const handleCheckEmail = async (req, res, next) => {
    const { email } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    try{
        if(!emailRegex.test(email)) throw new Error("잘못된 이메일 형식입니다.")
            
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