import { ToMeValidator } from "../middlewares/letter.validation.js";
import { sendLetterToMe } from "../services/letter.service.js";

export const handleSendMyLetter = async (req, res, next) => {
    const userId = req.user.id
    
    try{
        const {errors, ...data} = new ToMeValidator(req.body);
        const result = await sendLetterToMe(userId, data);

        res.status(200).success( result );
    } catch(err) {
        next(err);
    }
}