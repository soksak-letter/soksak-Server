import { UnExpectArgumentsError } from "../errors/weeklyReport.error.js";
import { readWeeklyReport } from "../services/weeklyReport.service.js";

export const handleGetWeeklyReport = async (req, res, next) => {
  const userId = req.user.id;
  const year = Number(req.params.year);
  const week = Number(req.params.week);
  if (userId == null || year == null || week == null)
    throw new UnExpectArgumentsError();
  try{
  const result = await readWeeklyReport(userId, year, week);
  res
    .status(200)
    .success({ message: "주간 리포트 조회 성공하였습니다.", result });
  } catch (error) {
    next(error);
  }
};