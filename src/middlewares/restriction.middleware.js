import { prisma } from "../configs/db.config.js";
import { RestrictedUserError } from "../errors/user.error.js";

export const isRestricted = async (req, res, next) => {
  try {
    const userId = req.user.id;
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
      new RestrictedUserError(`${restriction.reason} 을(를) 이유로 하여 제재되었습니다.`)
    );
  } catch (err) {
    return next(err);
  }
};
