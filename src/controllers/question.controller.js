// src/controllers/question.controller.js
import { getTodayQuestion } from "../services/question.service.js";

export const handleGetTodayQuestion = async (req, res, next) => {
    try{
        const question = await getTodayQuestion();
        res.status(200).success( question );
    } catch(err) {
        next(err);
    }
}