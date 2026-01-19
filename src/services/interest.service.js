import {
  findActiveInterests,
  findMyActiveInterests,
  findActiveInterestsByIds,
  replaceUserInterests,
  updateUserPoolByUserId,
} from "../repositories/interest.repository.js";

const toIntArray = (arr) => arr.map((v) => Number(v));

const decideUserPoolIdByInterestIds = (interestIds) => {
  // id -> pool 매핑 (하드코딩)
  const ID_TO_POOL = new Map([
    // Pool 1: 성취/커리어
    [1, 1], // 공부
    [4, 1], // 돈
    [9, 1], // 직장
    [10, 1], // 취업
    [11, 1], // 학교

    // Pool 2: 정서/관계
    [5, 2], // 사랑
    [6, 2], // 인간관계
    [13, 2], // 감정
    [16, 2], // 가족

    // Pool 3: 건강/외형
    [7, 3], // 건강
    [12, 3], // 다이어트
    [17, 3], // 미용

    // Pool 4: 문화/취향
    [2, 4], // 음악
    [3, 4], // 영화
    [8, 4], // 독서
    [14, 4], // 취미
    [15, 4], // 여행
  ]);

  const counts = { 1: 0, 2: 0, 3: 0, 4: 0 };

  for (const id of interestIds) {
    const pool = ID_TO_POOL.get(id);
    if (pool) counts[pool] += 1;
  }

  // 최다 카운트 찾기
  let max = -1;
  let winners = [];

  for (const poolId of [1, 2, 3, 4]) {
    const c = counts[poolId];
    if (c > max) {
      max = c;
      winners = [poolId];
    } else if (c === max) {
      winners.push(poolId);
    }
  }

  // 전부 0이거나(이론상 없음: id 검증 통과하면), 동률이면 혼합형 5
  if (max <= 0) return 5;
  if (winners.length !== 1) return 5;

  return winners[0];
};

// 전체 활성 관심사 태그 목록
export const getAllInterests = async () => {
  const items = await findActiveInterests();
  return { items };
};

// 내가 선택한 관심사 목록
export const getMyInterests = async ({ userId }) => {
  const items = await findMyActiveInterests(userId);
  return { items };
};

// 온보딩 관심사 저장 (최소 3개)
export const updateMyOnboardingInterests = async ({ userId, interestIds }) => {
  if (!Array.isArray(interestIds)) {
    throw new Error("interestIds는 배열이어야 합니다.");
  }

  const parsed = toIntArray(interestIds);

  if (parsed.some((n) => !Number.isInteger(n) || n <= 0)) {
    throw new Error("interestIds는 양의 정수 배열이어야 합니다.");
  }

  const uniqueIds = [...new Set(parsed)];

  // 최소 3개
  if (uniqueIds.length < 3) {
    throw new Error("관심사는 최소 3개 선택해야 합니다.");
  }

  const found = await findActiveInterestsByIds(uniqueIds);
  if (found.length !== uniqueIds.length) {
    const foundSet = new Set(found.map((x) => x.id));
    const invalid = uniqueIds.filter((id) => !foundSet.has(id));
    throw new Error(
      `유효하지 않은 관심사 id가 포함되어 있습니다: ${invalid.join(", ")}`
    );
  }

  await replaceUserInterests({ userId, interestIds: uniqueIds });
  const userPoolId = decideUserPoolIdByInterestIds(uniqueIds);
  await updateUserPoolByUserId({ userId, userPoolId });

  return { updated: true };
};
