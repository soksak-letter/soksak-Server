import { createUserReport, selectUserReport } from "../services/report.service.js";

export const handleInsertUserReport = async (req, res, next) => {
  const reporterUserId = req.user.id; 
  const { letterId, reasons } = req.body;

  try {
    const result = await createUserReport(reporterUserId, letterId, reasons);
    res
      .status(201)
      .success({ message: "신고가 성공적으로 처리되었습니다." });
  } catch (error) {
    next(error);
  }
};

export const handleGetUserReports = async (req, res, next) => {
  const userId = req.user.id;
  try{ 
    const result = await selectUserReport(userId);
    res
      .status(200)
      .success({ data: result, message: "신고 출력이 성공적으로 처리되었습니다." });
  } catch (error) {
    next(error);
  }
};
