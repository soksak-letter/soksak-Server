import { AuthError, ExpiredAccessTokenError, NotAccessTokenError } from "../errors/auth.error.js";
import passport from "passport";

export const isLogin = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if(err) return next(err);

    if (!user) {
      if (info?.name === "TokenExpiredError") {
        return next(new AuthError("AUTH_401_01", "토큰이 만료되었습니다."));
      }

      if (info?.name === "JsonWebTokenError") {
        return next(new NotAccessTokenError("AUTH_401_02", "액세스 토큰이 아니거나 유효하지 않습니다."));
      }

      if (info?.reason === "NOT_ACCESS_TOKEN") {
        return next(new NotAccessTokenError("AUTH_401_03", "액세스 토큰이 아닙니다."));
      }

      if (info?.reason === "TOKEN_BLACKLISTED") {
        return next(new ExpiredAccessTokenError("AUTH_401_04", "이미 로그아웃된 토큰입니다."));
      }

      if (info?.reason === "USER_NOT_FOUND") {
        return next(new AuthError("AUTH_401_05", "액세스 토큰이 유효하지 않습니다."));
      }
      
      return next(new AuthError("AUTH_404_06", "인증 토큰이 없습니다."));
    }

    req.user = user;
    return next();
  })(req, res, next);
}