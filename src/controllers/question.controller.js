// src/controllers/question.controller.js
import { getTodayQuestion } from "../services/question.service.js";

export const handleGetTodayQuestion = async (req, res, next) => {
    const date = req.query.date;

    try{
        const question = await getTodayQuestion(date);
        res.status(200).success( question );
    } catch(err) {
        next(err);
    }
}