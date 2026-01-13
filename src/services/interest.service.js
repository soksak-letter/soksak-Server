import {
    findActiveInterests,
    findMyActiveInterests,
    findActiveInterestsByIds,
    replaceUserInterests,
  } from "../repositories/interest.repository.js";
  
  const toIntArray = (arr) => arr.map((v) => Number(v));
  
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
      throw new Error(`유효하지 않은 관심사 id가 포함되어 있습니다: ${invalid.join(", ")}`);
    }
  
    await replaceUserInterests({ userId, interestIds: uniqueIds });
  
    return { updated: true };
  };
  