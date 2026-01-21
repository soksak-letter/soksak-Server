import { prisma } from "../configs/db.config.js";
import { RestrictedUserError } from "../errors/user.error.js";

export const isRestriced = async (req, res, next) => {
  try {
    const userId = req.user.id;
    console.log("여기야!!!!!!!!!!!!!!!!!!!!!!!!!" + userId);
    const now = new Date();

    const restriction = await prisma.restriction.findFirst({
      where: {
        userId,
        startsAt: { lte: now },
        endsAt: { gte: now },
      },
      select: { reason: true },
    });

    if (!restriction) return next();

    return next(
      new RestrictedUserError(`${restriction.reason}라는 이유로 인해 제재되었습니다.`)
    );
  } catch (err) {
    return next(err);
  }
};
