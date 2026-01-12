import {
    getAllInterests,
    getMyInterests,
    updateMyOnboardingInterests,
  } from "../services/interest.service.js";
  
  // 전체 관심사(로그인 불필요)
  export const handleGetAllInterests = async (req, res, next) => {
    try {
      const result = await getAllInterests();
      return res.status(200).success(result);
    } catch (err) {
      next(err);
    }
  };
  
  // 내 관심사(로그인 필요)
  export const handleGetMyInterests = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const result = await getMyInterests({ userId });
      return res.status(200).success(result);
    } catch (err) {
      next(err);
    }
  };
  
  // 내 관심사 저장(로그인 필요)
  export const handleUpdateMyOnboardingInterests = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { interestIds } = req.body;
      const result = await updateMyOnboardingInterests({ userId, interestIds });
      return res.status(200).success(result);
    } catch (err) {
      next(err);
    }
  };
  