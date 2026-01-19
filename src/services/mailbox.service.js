import {
    findReceivedLettersForThreads,
    findReceivedLettersBySender,
    findSelfLetters,
    findUsersNicknameByIds,
  } from "../repositories/mailbox.repository.js";
  import { MAILBOX_ERROR, throwMailboxError } from "../errors/mailbox.error.js";
  

  const LETTER_TYPE_ANON = "ANON_SESSION";
  const LETTER_TYPE_SELF = "SELF";
  
  const makePreview = (text, maxLen = 30) => {
    if (!text) return "";
    const t = String(text);
    if (t.length <= maxLen) return t;
    return `${t.slice(0, maxLen)}...`;
  };
  
  /**
   * 익명 탭 목록 조회
   * - senderUserId별 최신 편지 1개씩 -> thread 카드
   * - 편지통 색상: 최신 편지의 design.paperId 사용
   */
  export const getAnonymousThreads = async (userId) => {
    const letters = await findReceivedLettersForThreads({
      userId,
      letterType: LETTER_TYPE_ANON,
    });
  
    // senderUserId별 최신 편지 1개 유지
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
      
          //  닉네임 항상 노출
          sender: {
            id: senderId,
            nickname: nicknameMap.get(senderId) ?? null,
          },
      
          //  편지통 색상(=paperId)
          paperId: l.design?.paperId ?? null,
        };
      });
      
  
    // 최신순 정렬
    items.sort((a, b) => {
      const ta = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const tb = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return tb - ta;
    });
  
    return { items };
  };
  
  /**
   * 특정 익명 스레드의 편지 목록 조회
   * - 그 senderUserId가 보낸 익명 편지들 목록
   * - 편지통 색상 = 각 편지의 design.paperId
   */
  export const getAnonymousThreadLetters = async (userId, threadIdRaw) => {
    const threadId = Number(threadIdRaw);
    if (!Number.isFinite(threadId) || threadId <= 0) {
      throwMailboxError(MAILBOX_ERROR.INVALID_THREAD_ID, { threadId: threadIdRaw });
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
  
  /**
   * 나에게(SELF) 편지함 목록 조회
   * - senderUserId = me AND letterType = SELF
   */
  export const getSelfMailbox = async (userId) => {
    const letters = await findSelfLetters({
      userId,
      letterType: LETTER_TYPE_SELF,
    });
  
    const items = letters.map((l) => ({
      id: l.id,
      title: l.title,
      createdAt: l.createdAt ?? null,
      paperId: l.design?.paperId ?? null, // 편지통 색상
    }));
  
    return { items };
  };
  