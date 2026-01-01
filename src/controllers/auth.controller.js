import { refreshToken } from "../services/auth.service.js";

export const handleRefreshToken = (req, res, next) => {
    try{
        const authHeader = req.get("authorization");

        if(!authHeader || !authHeader.startsWith('Bearer ')) throw new Error();

        const token = authHeader.split(" ")[1];

        const jwtAccessToken = refreshToken(token);

        res.status(200).success({jwtAccessToken});
    } catch(err) {
        next(err);
    }
}