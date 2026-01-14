import { getLetter } from "../services/letter.service.js";
import { LetterToMeValidator, LetterToOtherValidator } from "../validators/letter.validation.js";
import { sendLetterToMe, sendLetterToOther } from "../services/letter.service.js";

export const handleGetLetterDetail = async (req, res, next) => {
    try{
        const letter = await getLetter(parseInt(req.params.letterId));
        
        res.status(200).success(letter);
    } catch(err) {
        next(err);
    }
}

export const handleSendMyLetter = async (req, res, next) => {
    const userId = req.user.id;
    
    try{
        const {errors, ...data} = new LetterToMeValidator(req.body);
        const result = await sendLetterToMe(userId, data);

        res.status(200).success( result );
    } catch(err) {
        next(err);
    }
}

export const handleSendOtherLetter = async (req, res, next) => {
    const userId = req.user.id;

    try{
        const {errors, ...data} = new LetterToOtherValidator(req.body);
        const result = await sendLetterToOther(userId, data);

        res.status(200).success( result );
    } catch(err) {
        next(err);
    }
}