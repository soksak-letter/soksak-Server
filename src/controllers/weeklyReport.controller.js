import { UnExpectArgumentsError } from "../errors/weeklyReport.error.js";
import { readWeeklyReport } from "../services/weeklyReport.service.js";

export const handleGetWeeklyReport = async (req, res, next) => {
  const userId = req.user.id;
  const year = Number(req.params.year);
  const week = Number(req.params.week);
  if (userId == null || year == null || week == null)
    throw new UnExpectArgumentsError();
  const result = await readWeeklyReport(userId, year, week);
  res
    .status(result.status)
    .json({ data: result.data, message: result.message });
  try {
    //최신 weeklyReport get
  } catch (error) {
    next(error);
  }
};
