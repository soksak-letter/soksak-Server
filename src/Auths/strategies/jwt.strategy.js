import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { findUserById } from "../../repositories/user.repository.js";
import { getBlackListToken } from "../../repositories/auth.repository.js";

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_ACCESS_SECREAT,
    passReqToCallback: true
}

/**
 * jwt가 유효한지 판단하는 객체
 * jwt가 유효하더라도 삭제된 유저라면 인가 X
 */
export const jwtStrategy = new JwtStrategy(jwtOptions, async (req, payload, done) => {
    try {
        const user = await findUserById(payload.id);
        const token = req.headers.authorization?.split(' ')[1];
        
        const isBlackListed = await getBlackListToken(token);
        if(isBlackListed) return done(null, false, { message: "로그아웃된 토큰입니다." });

        user.token = token;
        
        if(user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (err) {
        return done(err, false);
    }
});