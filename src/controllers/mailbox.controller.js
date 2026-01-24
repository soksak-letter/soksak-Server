import { getAnonymousThreads, getAnonymousThreadLetters, getSelfMailbox, getLetterFromFriend } from "../services/mailbox.service.js";
import { MailboxUnauthorizedError } from "../errors/mailbox.error.js";

// ========== Mailbox Controllers ==========
const getAuthUserId = (req) => req.user?.id ?? req.userId ?? req.user?.userId ?? null;

export const handleGetAnonymousThreads = async (req, res, next) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) throw new MailboxUnauthorizedError();

    const result = await getAnonymousThreads(userId);
    return res.status(200).json({
      resultType: "SUCCESS",
      error: null,
      success: result,
    });
  } catch (err) {
    next(err);
  }
};

export const handleGetAnonymousThreadLetters = async (req, res, next) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) throw new MailboxUnauthorizedError();

    const { threadId } = req.params;
    const result = await getAnonymousThreadLetters(userId, threadId);

    return res.status(200).json({
      resultType: "SUCCESS",
      error: null,
      success: result,
    });
  } catch (err) {
    next(err);
  }
};

export const handleGetLetterFromFriend = async (req, res, next) => {
    const friendId = parseInt(req.params.friendId);
    const userId = req.user.id;
    
    try{
        const letters = await getLetterFromFriend({userId, friendId});

        res.status(200).success( letters );
    } catch(err) {
        next(err);
    }
}

export const handleGetSelfMailbox = async (req, res, next) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) throw new MailboxUnauthorizedError();

    const result = await getSelfMailbox(userId);
    return res.status(200).json({
      resultType: "SUCCESS",
      error: null,
      success: result,
    });
  } catch (err) {
    next(err);
  }
};

