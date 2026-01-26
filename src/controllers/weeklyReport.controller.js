import { readWeeklyReport } from "../services/weeklyReport.service.js";

export const handleGetWeeklyReport = async (req, res, next) => {
  const userId = req.user.id;
  const result = await readWeeklyReport(userId);
  try {
    res
      .status(200)
      .success({ message: "주간 리포트 조회 성공하였습니다.", result });
  } catch (error) {
    next(error);
  }
};