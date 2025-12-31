import dotenv from "dotenv";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { prisma } from "./db.config.js";

dotenv.config();
const secret = process.env.JWT_SECREAT;

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret
}

/**
 * jwt가 유효한지 판단하는 객체
 * jwt가 유효하더라도 삭제된 유저라면 인가 X
 */
export const jwtStrategy = new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
        const user = await prisma.user.findFirst({ where: { id: payload.id, isDeleted: false }});
        
        if(user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (err) {
        return done(err, false);
    }
});