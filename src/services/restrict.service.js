import { findRestrictById } from "../repositories/restrict.repository.js";
import { RestrictInternalError } from "../errors/restrict.error.js";

export const getRestrictByUserId = async(userId) => {
    try{
        const result = await findRestrictById(userId);
        return result;
    } catch(error) {
        throw new RestrictInternalError();
    }
}