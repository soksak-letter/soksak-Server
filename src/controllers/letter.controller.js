import { addLetterLike, getLetter, getLetterFromFriend, getPublicLetterFromOther, removeLetterLike } from "../services/letter.service.js";
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

export const handleGetLetterFromFriend = async (req, res, next) => {
    const friendId = parseInt(req.params.friendId);
    const userId = req.user.id;
    
    try{
        const letters = await getLetterFromFriend({userId, friendId});

        res.status(200).success( letters );
    } catch(err) {
        next(err);
    }
}

export const handleAddLetterLike = async (req, res, next) => {
    const letterId = parseInt(req.params.letterId);
    const userId = req.user.id;

    try{
        const data = await addLetterLike({userId, letterId});

        res.status(200).success( data );
    } catch(err) {
        next(err);
    }
}

export const handleRemoveLetterLike = async (req, res, next) => {
    const letterId = parseInt(req.params.letterId);
    const userId = req.user.id;

    try{
        const data = await removeLetterLike({userId, letterId});

        res.status(200).success( data );
    } catch(err) {
        next(err);
    }
}

export const handleGetPublicLetterFromOther = async (req, res, next) => {
    const userId = req.user.id;
    const isDetail = req.query.detail === "true";
    try{
        const letters = await getPublicLetterFromOther(userId, isDetail);

        res.status(200).success( letters );
    } catch(err) {
        next(err);
    }
}