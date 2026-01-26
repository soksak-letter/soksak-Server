import { readWeeklyReport } from "../services/weeklyReport.service.js";

export const handleGetWeeklyReport = async (req, res, next) => {
  const userId = req.user.id;
  const result = await readWeeklyReport(userId);
  res
    .status(result.status)
    .json({ data: result.data, message: result.message });
  try {
    //최신 weeklyReport get
  } catch (error) {
    next(error);
  }
};
