import { InquiryBadRequestError } from "../errors/inquiry.error.js";
import { insertInquiryAsUser, insertInquiryAsAdmin, selectInquiry } from "../services/inquiry.service.js";

export const handleInsertInquiryAsUser = async(req, res, next) => {
    const userId = req.user.id;
    const title = req.body.title;
    const content = req.body.content;
    console.log("userId 여기입니다!!!!" + userId);
    if(title == null || content == null) throw new InquiryBadRequestError("잘못된 인수 입력입니다.");
    try {
        const result = await insertInquiryAsUser(userId, title, content);
        return res.success({
            message: "문의 입력이 성공적으로 처리되었습니다.",
            result,
        });
    } catch (error) {
        next(error);
    }
}

export const handleInsertInquiryAsAdmin = async(req, res, next) => {
    const inquiryId = req.body.inquiryId;
    const answerContent = req.body.answerContent;
    if(answerContent == null) throw new InquiryBadRequestError("잘못된 인수 입력입니다.");
    try {
        const result = await insertInquiryAsAdmin(inquiryId, answerContent);
        return res.success({
            message: "문의 답변이 성공적으로 처리되었습니다.",
            result,
        });
    } catch (error) {
        next(error);
    }
}

export const handleGetInquiry = async(req, res, next) => {
    const userId = req.user.id;
    try {
        const result = await selectInquiry(userId);
        return res.success({
            message: "문의 조회가 성공적으로 처리되었습니다.",
            result,
        });
    } catch (error) {
        next(error);
    }
}