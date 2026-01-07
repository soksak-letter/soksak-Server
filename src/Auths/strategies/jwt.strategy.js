import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { findUserById } from "../../repositories/user.repository.js";

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_ACCESS_SECREAT
}

/**
 * jwt가 유효한지 판단하는 객체
 * jwt가 유효하더라도 삭제된 유저라면 인가 X
 */
export const jwtStrategy = new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
        const user = await findUserById(payload.id);
        
        if(user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (err) {
        return done(err, false);
    }
});