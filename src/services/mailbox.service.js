import {
  findReceivedLettersForThreads,
  findReceivedLettersBySender,
  findSelfLetters,
  findUsersNicknameByIds,
} from "../repositories/user.repository.js";
import { MailboxInvalidThreadIdError } from "../errors/mailbox.error.js";
import { LETTER_TYPE_ANON, LETTER_TYPE_SELF, makePreview } from "../utils/user.util.js";

// ------------------------------
// Mailbox
// ------------------------------

export const getAnonymousThreads = async (userId) => {
  const letters = await findReceivedLettersForThreads({
    userId,
    letterType: LETTER_TYPE_ANON,
  });

  const latestBySender = new Map(); // senderUserId -> letter
  for (const l of letters) {
    if (!l.senderUserId) continue;
    if (!latestBySender.has(l.senderUserId)) {
      latestBySender.set(l.senderUserId, l);
    }
  }

  const senderIds = Array.from(latestBySender.keys());
  const nicknameMap = senderIds.length ? await findUsersNicknameByIds(senderIds) : new Map();

  const items = senderIds.map((senderId) => {
    const l = latestBySender.get(senderId);
    const updatedAt = l.deliveredAt ?? l.createdAt ?? null;

    return {
      threadId: senderId, // threadId = senderUserId
      lastLetterId: l.id,
      lastLetterTitle: l.title,
      lastLetterPreview: makePreview(l.content, 30),
      updatedAt,

      sender: {
        id: senderId,
        nickname: nicknameMap.get(senderId) ?? null,
      },

      paperId: l.design?.paperId ?? null,
    };
  });

  items.sort((a, b) => {
    const ta = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    const tb = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
    return tb - ta;
  });

  return { items };
};

export const getAnonymousThreadLetters = async (userId, threadIdRaw) => {
  const threadId = Number(threadIdRaw);
  if (!Number.isFinite(threadId) || threadId <= 0) {
    throw new MailboxInvalidThreadIdError("MAILBOX_400_01", "threadId가 올바르지 않습니다.", { threadId: threadIdRaw });
  }

  const letters = await findReceivedLettersBySender({
    userId,
    senderUserId: threadId,
    letterType: LETTER_TYPE_ANON,
  });

  const items = letters.map((l) => ({
    id: l.id,
    title: l.title,
    content: l.content,
    deliveredAt: l.deliveredAt ?? null,
    createdAt: l.createdAt ?? null,
    design: l.design
      ? {
          paperId: l.design.paperId ?? null,
          stampId: l.design.stampId ?? null,
          fontId: l.design.fontId ?? null,
        }
      : { paperId: null, stampId: null, fontId: null },
  }));

  return { items };
};

export const getSelfMailbox = async (userId) => {
  const letters = await findSelfLetters({
    userId,
    letterType: LETTER_TYPE_SELF,
  });

  const items = letters.map((l) => ({
    id: l.id,
    title: l.title,
    createdAt: l.createdAt ?? null,
    paperId: l.design?.paperId ?? null,
  }));

  return { items };
};
