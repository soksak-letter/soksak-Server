/** 신고 관련
 * 신고 관련 db table은 UserReport, UserReportReason (+UserReportReasonReason(enum)) 3개
 * 신고는 UserReport 테이블에 추가
 * 신고 사유는 UserReportReason 테이블에 추가
 *
 * 기능 리스트
 * 1. 신고 작성(한 유저에 대해서는 진행 중 신고가 있을 경우 중복 신고 불가)
 * 2. 내가 신고한 유저 목록 조회
 *
 * 추가 생각해야 할 것
 * 1. 제제는 신고를 통해서만 관리? -> 그렇다면 제제 관련 api 불필요, 신고로 api로 관리
 *      1-2. 라이브러리로 발견되는 욕설 및 비하 발언에 대해서는 제제가 들어가지 않는가?
 *          (그렇다면 제제는 신고로만 관리될 확률이 높아짐)
 * 2. 관리자의 통제는 어떻게 이루어지는가 -> 발생된 신고 사항에 대해서 처리는?
 *
 * ++ 추가 고려 사항
 *  - restriction, inquiry, userReport 테이블이 모두 존재.
 */
import { createUserReport, selectUserReport } from "../services/report.service.js";
import { ReportUnexpectedArgumentError } from "../errors/report.error.js";

export const handleInsertUserReport = async (req, res, next) => {
  const reporterUserId = req.user.id; //나
  //const targetUserId = req.body.targetUserId; //남 <- letter 기준으로 찾으면 되니까 받을 필요 없음
  const letterId = Number(req.body.letterId); //기본으로 들어와야됨
  //const status = req.body.status; // 아마 제재 관련해서 제재되었냐 안 되었냐 구분하는 것인 듯, 받을 필요 없음
  const reasons = req.body.reasons; //service에서 욕설/비하, 혐오표현 등등 검사하기

  if (
    reporterUserId == null || letterId == null || reasons.isNull
  ) {
    throw new ReportUnexpectedArgumentError();
  }

  try {
    const result = await createUserReport(reporterUserId, letterId, reasons);
    res
      .status(result.status)
      .json({ message: result.message });
  } catch (error) {
    next(error);
  }
};

export const handleGetUserReports = async (req, res, next) => {
  //createdAt, status, reasons
  const userId = req.user.id;
  try{ 
    const result = await selectUserReport(userId);
    res
      .status(result.status)
      .json({ data: result.data, message: result.message });
  } catch (error) {
    next(error);
  }
};
