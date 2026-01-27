import { getUserLetterStats } from "../services/letter.service.js";
import { getTodayQuestion } from "../services/question.service.js";
import { countUserSession } from "../services/session.service.js";

export const HandleGetHomeDashboard = async (req, res, next) => {
    const userId = req.user.id;

    try{
        const todayQuestion = await getTodayQuestion();
        const letterStats = await getUserLetterStats(userId);
        const sessionCount = await countUserSession(userId);

        res.status(200).success({
            todayQuestion, 
            letterStats,
            sessionCount
        })
    } catch(err) {
        next(err);
    }
}