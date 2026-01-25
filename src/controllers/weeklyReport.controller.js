import { UnExpectArgumentsError } from "../errors/weeklyReport.error.js";
import { readWeeklyReport } from "../services/weeklyReport.service.js";

export const handleGetWeeklyReport = async (req, res, next) => {
  const userId = req.user.id;
  if (userId == null)
    throw new UnExpectArgumentsError();
  const result = await readWeeklyReport(userId);
  res
    .status(200)
    .success({ message: "주간 리포트 조회에 성공하였습니다.", result });
  try {
    //최신 weeklyReport get
  } catch (error) {
    next(error);
  }
};
