import { addLetterLike, getLetter, getLetterAssets, getPublicLetterFromFriend, getPublicLetterFromOther, getUserLetterStats, removeLetterLike, sendLetterToMe, sendLetterToOther, getLetterByAiKeyword } from "../services/letter.service.js";

export const handleGetLetterByAiKeyword = async (req, res, next) => {
    const userId = req.user.id;
    const aiKeyword = req.params.aiKeyword;
    try {
        const result = await getLetterByAiKeyword({userId, aiKeyword});

        res.status(200).success( result );
    } catch(err) {
        next(err);
    }
}

export const handleGetLetterDetail = async (req, res, next) => {
    const userId = req.user.id;
    const letterId = parseInt(req.params.letterId);

    try{
        const letter = await getLetter({userId, letterId});
        
        res.status(200).success(letter);
    } catch(err) {
        next(err);
    }
}

export const handleSendMyLetter = async (req, res, next) => {
    const userId = req.user.id;
    
    try{
        const result = await sendLetterToMe(userId, req.body);

        res.status(200).success( result );
    } catch(err) {
        next(err);
    }
}

export const handleSendOtherLetter = async (req, res, next) => {
    const userId = req.user.id;

    try{
        const result = await sendLetterToOther(userId, req.body);

        res.status(200).success( result );
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
    const isDetail = req.query.detail;
    const date = req.query.date;

    try{
        const letters = await getPublicLetterFromOther({userId, date, isDetail});

        res.status(200).success( letters );
    } catch(err) {
        next(err);
    }
}

export const handleGetPublicLetterFromFriend = async (req, res, next) => {
    const userId = req.user.id;
    const isDetail = req.query.detail;
    const date = req.query.date;

    try{
        const letters = await getPublicLetterFromFriend({userId, date, isDetail});

        res.status(200).success( letters );
    } catch(err) {
        next(err);
    }
}

export const handleGetUserLetterStats = async (req, res, next) => {
    const userId = req.user.id;
    const date = req.query.date;

    try{
        const data = await getUserLetterStats(userId, date);

        res.status(200).success( data );
    } catch(err) { 
        next(err);
    }
}

export const handleGetLetterAssets = async (req, res, next) => {
    try{
        const assets = await getLetterAssets();

        res.status(200).success( assets );
    } catch(err) {
        next(err);
    }
}