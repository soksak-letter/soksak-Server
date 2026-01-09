import { findLetterAssets } from "../repositories/asset.repository.js";

export const getLetterAssets = async () => {
    const assets = await findLetterAssets();

    return assets;
}