import { AuthError, ExpiredAccessTokenError, NotAccessTokenError } from "../errors/auth.error.js";
import passport from "passport";

export const isLogin = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if(err) return next(err);

    if (!user) {
      if (info?.name === "TokenExpiredError") {
        return next(new AuthError("토큰이 만료되었습니다."));
      }

      if (info?.name === "JsonWebTokenError") {
        return next(new NotAccessTokenError("액세스 토큰이 아니거나 유효하지 않습니다."));
      }

      if (info?.reason === "NOT_ACCESS_TOKEN") {
        return next(new NotAccessTokenError("액세스 토큰이 아닙니다."));
      }

      if (info?.reason === "TOKEN_BLACKLISTED") {
        return next(new ExpiredAccessTokenError("이미 로그아웃된 토큰입니다."));
      }

      return next(new AuthError("인증 토큰이 없습니다."));
    }

    req.user = user;
    return next();
  })(req, res, next);
}