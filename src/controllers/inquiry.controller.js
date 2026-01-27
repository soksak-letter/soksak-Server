// src/controllers/inquiry.controller.js
import { insertInquiryAsUser, insertInquiryAsAdmin, selectInquiry, selectInquiryDetail } from "../services/inquiry.service.js";
import { requiredEnv } from "../utils/user.util.js";

export const handleInsertInquiryAsUser = async(req, res, next) => {
    const userId = req.user.id;
    const { title, content } = req.body;
    try {
        const result = await insertInquiryAsUser(userId, title, content);
        return res.status(201).success({
            message: "문의 입력이 성공적으로 처리되었습니다.",
            result,
        });
    } catch (error) {
        next(error);
    }
}

export const handleInsertInquiryAsAdmin = async(req, res, next) => {
    const inquiryId = req.body.inquiryId;
    const {answerContent} = req.body;
   try {
        const result = await insertInquiryAsAdmin(inquiryId, answerContent);
        return res.status(201).success({
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
        return res.status(201).success({
            message: "문의 조회가 성공적으로 처리되었습니다.",
            result,
        });
    } catch (error) {
        next(error);
    }
}

export const handleGetInquiryDetail = async(req, res, next) => {
    const userId = req.user.id;
    const { inquiryId } = req.params;
    try {
        const result = await selectInquiryDetail(userId, inquiryId);
        return res.status(200).success({
            message: "문의 상세 조회가 성공적으로 처리되었습니다.",
            result,
        })
    } catch (error) {
        next(error);
    }
}