export const NOTIFICATION_MESSAGES = {
  // 1. 새 편지 도착 (상태별 분기)
  NEW_LETTER: {
    TITLE: (data) => {
      const { status } = data;
      if (status === "FRIENDS") return "베프의 새로운 소식! ✨";
      if (status === "CHATING") return "기다리던 답장이 왔어요 📬";
      return "새로운 인연의 편지! 💌";
    },
    BODY: (data) => {
      const { status, nickname } = data;
      if (status === "FRIENDS") return `${nickname}님이 보낸 따끈따끈한 편지가 도착했습니다.`;
      if (status === "CHATING") return "대화 중인 상대방으로부터 새로운 답장이 도착했습니다.";
      return "누군가 당신에게 정성스러운 첫 편지를 보냈습니다.";
    },
  },

  // 2. 읽음 확인 (친구 여부별 분기)
  READ_CONFIRMATION: {
    TITLE: (data) => data.isFriend ? "친구가 편지를 읽었어요! 🎈" : "내 마음이 닿았어요! ✨",
    BODY: (data) => {
      const { isFriend, nickname } = data;
      return isFriend 
        ? `${nickname}님이 내 편지를 확인하였습니다. 지금 답장을 기다릴지도 몰라요!` 
        : "누군가가 내 편지를 확인하였습니다. 진심이 잘 전달되었기를 바라요.";
    },
  },

  // 3. 장기 미확인 (리마인드)
  LONG_TERM_UNREAD: {
    TITLE: () => "편지가 외로워하고 있어요 📮",
    BODY: () => "아직 확인하지 않은 편지가 편지함에서 당신을 기다리고 있습니다. 지금 확인해보세요!",
  },

  // 4. 공지 사항
  NOTICE: {
    TITLE: () => "속삭편지에서 알려드립니다 📢",
    BODY: () => "서비스의 새로운 소식이 도착했습니다! 어떤 변화가 생겼는지 확인해보세요.",
  },

  // 5. 친구 매칭 성공
  FRIEND_MATCH_SUCCESS: {
    TITLE: () => "마음이 딱 통했어요! ✨",
    BODY: () => "새로운 친구와 연결되었습니다. 먼저 따뜻한 인사를 건네보는 건 어떨까요?",
  },
};