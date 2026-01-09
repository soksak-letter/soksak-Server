import { getLetter } from "../services/letter.service.js";

export const handleGetLetterDetail = async (req, res, next) => {
    try{
        const letter = await getLetter(parseInt(req.params.letterId));
        
        res.status(200).success(letter);
    } catch(err) {
        next(err);
    }
}