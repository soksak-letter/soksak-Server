import {
  insertUserReport,
  getUserReportAndReasonByUserId,
  insertUserReportReason,
  getUserReportAndReasonByReportId
} from "../repositories/report.repository.js";
import { selectSenderUserIdByLetterIdAndReceiverUserId } from "../repositories/letter.repository.js";
import { LetterNotFoundError } from "../errors/letter.error.js";
import {
  ReportInternalError,
  UnExpectedReportReasonError,
} from "../errors/report.error.js";
import { findUserById } from "../repositories/user.repository.js";
import { UserNotFoundError } from "../errors/user.error.js";
import {
  BadRequestError,
  NotFoundError,
} from "../errors/base.error.js";

const ALLOWED_REASONS = new Set([
  "욕설/비하",
  "혐오 표현",
  "성적 불쾌감",
  "스팸/광고",
  "도배/반복",
  "폭력/학대표현",
  "불법 행위 유도",
  "사칭/허위정보",
]);

export function validateReasons(reasons) {
  if (!Array.isArray(reasons)) {
    return false;
  }
  const normalized = reasons
    .map((x) => (typeof x === "string" ? x.trim() : x))
    .filter((x) => typeof x === "string" && x.length > 0);

  const invalid = normalized.filter((r) => !ALLOWED_REASONS.has(r));

  if (invalid.length > 0) {
    return true;
  }
  return false;
}

export const createUserReport = async (reporterUserId, letterId, reasons) => {
  const user = await findUserById(reporterUserId);
  if (user == null) throw new UserNotFoundError();
  const senderUserId = await selectSenderUserIdByLetterIdAndReceiverUserId(
    letterId,
    reporterUserId
  );
  console.log(senderUserId);
  if (senderUserId == null) throw new LetterNotFoundError();
  if (validateReasons(reasons)) throw new UnExpectedReportReasonError(undefined, undefined, { reasons });
  try {
    const userReport = await insertUserReport(
      reporterUserId,
      senderUserId,
      letterId
    );
    const userReportReason = await insertUserReportReason(
      userReport.id,
      reasons
    );
    if (!userReportReason || userReportReason.count === 0) throw new ReportInternalError();
    return {
      status: 201,
      message: "신고가 성공적으로 처리되었습니다.",
    };
  } catch (error) {
    if (error instanceof BadRequestError || error instanceof NotFoundError) {
      throw error;
    }
    throw new ReportInternalError();
  }
};

export const selectUserReports = async (userId) => {
  const user = await findUserById(userId);
  if (user == null) throw new UserNotFoundError();
  try {
    const result = await getUserReportAndReasonByUserId(userId);
    return result;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    throw new ReportInternalError();
  }
};

export const selectUserReport = async(userId, reportId) => {
  const user = await findUserById(userId);
  if (user == null) throw new UserNotFoundError();
  try {
    const result = await getUserReportAndReasonByReportId(userId, reportId);
    return result;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    throw new ReportInternalError();
  }
}
