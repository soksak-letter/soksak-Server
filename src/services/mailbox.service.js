import {
  findReceivedLettersForThreads,
  findReceivedLettersBySender,
  findSelfLetters,
  findUsersNicknameByIds,
} from "../repositories/user.repository.js";
import { MailboxInvalidThreadIdError } from "../errors/mailbox.error.js";
import { LETTER_TYPE_ANON, LETTER_TYPE_SELF, makePreview } from "../utils/user.util.js";
import { findFriendById } from "../repositories/friend.repository.js";
import { NotFriendError } from "../errors/friend.error.js";
import { getFriendLetters, getMyLettersWithFriend } from "../repositories/letter.repository.js";

// ------------------------------
// Mailbox
// ------------------------------

export const getAnonymousThreads = async (userId) => {
  const receivedLetters = await findReceivedLettersForThreads({
    userId,
    letterType: LETTER_TYPE_ANON,
  });

  const latestBySender = new Map(); // senderUserId -> letter
  for (const l of receivedLetters) {
    if (!l.senderUserId) continue;
    if (!latestBySender.has(l.senderUserId)) {
      latestBySender.set(l.senderUserId, l);
    }
  }

  const senderIds = Array.from(latestBySender.keys());
  const nicknameMap = senderIds.length ? await findUsersNicknameByIds(senderIds) : new Map();

  const letters = senderIds.map((senderId) => {
    const l = latestBySender.get(senderId);

    return {
      threadId: senderId, // threadId = senderUserId
      lastLetterId: l.id,
      lastLetterTitle: l.title,
      lastLetterPreview: makePreview(l.content, 30),
      deliveredAt: l.deliveredAt ?? null,
      sender: {
        id: senderId,
        nickname: nicknameMap.get(senderId) ?? null,
      },
      design: l.design
        ? {
            paper: l.design.paper
              ? {
                  id: l.design.paper.id,
                  name: l.design.paper.color, // color를 name으로 매핑
                }
              : null,
            stamp: l.design.stamp
              ? {
                  id: l.design.stamp.id,
                  name: l.design.stamp.name,
                  assetUrl: l.design.stamp.assetUrl,
                }
              : null,
          }
        : { paper: null, stamp: null },
    };
  });

  letters.sort((a, b) => {
    const ta = a.deliveredAt ? new Date(a.deliveredAt).getTime() : 0;
    const tb = b.deliveredAt ? new Date(b.deliveredAt).getTime() : 0;
    return tb - ta;
  });

  return { letters };
};

export const getAnonymousThreadLetters = async (userId, threadIdRaw) => {
  const threadId = Number(threadIdRaw);
  if (!Number.isFinite(threadId) || threadId <= 0) {
    throw new MailboxInvalidThreadIdError("MAILBOX_INVALID_THREAD_ID", "threadId가 올바르지 않습니다.", { threadId: threadIdRaw });
  }

  const letters = await findReceivedLettersBySender({
    userId,
    senderUserId: threadId,
    letterType: LETTER_TYPE_ANON,
  });

  const firstQuestion = letters[0]?.question?.content ?? null;

  const lettersData = letters.map((l) => ({
    id: l.id,
    title: l.title,
    deliveredAt: l.deliveredAt ?? null,
    design: l.design
      ? {
          paper: l.design.paper
            ? {
                id: l.design.paper.id,
                name: l.design.paper.color, // color를 name으로 매핑
              }
            : null,
          stamp: l.design.stamp
            ? {
                id: l.design.stamp.id,
                name: l.design.stamp.name,
                assetUrl: l.design.stamp.assetUrl,
              }
            : null,
        }
      : { paper: null, stamp: null },
  }));

  return {
    firstQuestion,
    letters: lettersData,
  };
};

export const getLetterFromFriend = async ({userId, friendId}) => {
    const friend = await findFriendById(userId, friendId);
    if(!friend) throw new NotFriendError("FRIEND_NOT_FRIEND", "친구가 아닙니다.");

    const {friendLetters, question: friendFirstQuestion} = await getFriendLetters({userId, friendId});
    const myLetters = await getMyLettersWithFriend({userId, friendId});

    const myFirstQuestion = myLetters[0]?.question?.content;

    return {
        friendName: friend.nickname,
        firstQuestion: friendFirstQuestion ?? myFirstQuestion,
        friendLetters: friendLetters,
        userLetters: myLetters
    };
}

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
