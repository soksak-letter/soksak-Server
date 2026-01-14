import { getLetterAssets } from "../services/asset.service.js";

export const handleGetLetterAssets = async (req, res, next) => {
    try{
        const assets = await getLetterAssets();

        res.status(200).success( assets );
    } catch(err) {
        next(err);
    }
}