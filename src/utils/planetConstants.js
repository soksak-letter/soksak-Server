export const PLANET_STAGES = [
  {
    level: 0,
    count: 0,
    name: "",
    cheer: "첫 편지부터 여행이 시작돼요!",
    action: ""
  },
  {
    level: 1,
    count: 10,
    name: "달",
    cheer: "첫 걸음을 내딛어 달에 도착했어요!",
    action: "향할 수 있어요"
  },
  {
    level: 2,
    count: 30,
    name: "수성",
    cheer: "가장 가까운 별, 수성에 도착했어요!",
    action: "닿을 수 있어요"
  },
  {
    level: 3,
    count: 50,
    name: "금성",
    cheer: "새벽별처럼 빛나는 금성에 도착했어요!",
    action: "닿을 수 있어요"
  },
  {
    level: 4,
    count: 70,
    name: "지구",
    cheer: "따뜻한 이야기들이 모여 지구에 도착했어요!",
    action: "떠날 수 있어요"
  },
  {
    level: 5,
    count: 100,
    name: "화성",
    cheer: "붉은 열정의 화성에 도착했어요!",
    action: "닿을 수 있어요"
  },
  {
    level: 6,
    count: 150,
    name: "목성",
    cheer: "거대한 마음들이 모여 목성에 도착했어요!",
    action: "갈 수 있어요"
  },
  {
    level: 7,
    count: 200,
    name: "토성",
    cheer: "고리처럼 쌓인 이야기들 덕분에 토성에 도착했어요!",
    action: "닿을 수 있어요"
  },
  {
    level: 8,
    count: 300,
    name: "천왕성",
    cheer: "깊은 푸른빛의 천왕성에 도착했어요!",
    action: "다가갈 수 있어요"
  },
  {
    level: 9,
    count: 400,
    name: "해왕성",
    cheer: "마지막 신비의 행성, 해왕성에 도달했습니다!",
    action: "완주할 수 있어요"
  }
];

export const getLevelInfo = (totalCount) => {
    const currentStage = [...PLANET_STAGES].reverse().find(stage => totalCount >= stage.count) || PLANET_STAGES[0];
    const nextStage = PLANET_STAGES.find(stage => totalCount < stage.count);
    const remainingCount = nextStage ? nextStage.count - totalCount : 0;

    const description = nextStage 
    ? `${currentStage.cheer} ${remainingCount}통의 마음을 더 보내면 ${nextStage.name}으로 ${nextStage.action}.`
    : `${currentStage.cheer} 모든 행성을 정복하셨습니다!`;

    return {
        currentPlanet: currentStage.name,
        nextPlanet: nextStage ? nextStage.name : null,
        remainingCount: remainingCount,
        cheerMessage: currentStage.cheer,
        fullMessage: description, // 완성된 전체 문장
        level: currentStage.level,
        progress: nextStage 
        ? Math.floor(((totalCount - currentStage.count) / (nextStage.count - currentStage.count)) * 100)
        : 100
  };
}