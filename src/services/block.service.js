import { insertUserBlock } from "../repositories/block.repository.js";
import { findUserById } from "../repositories/user.repository.js";
import { InvalidUserError } from "../errors/user.error.js";
import { BlockInternalServerError } from "../errors/block.error.js";

export const createBlockUser = async(userId, targetUserId) => {
    const user = await findUserById(userId);
    const target = await findUserById(targetUserId);
    if(user==null) {
        throw new InvalidUserError(undefined, undefined, userId);
    } else if(target==null) {
        throw new InvalidUserError(undefined, undefined, targetUserId);
    }
    try {
        const result = await insertUserBlock(userId, targetUserId);
        return result;
    } catch (error) {
        throw new BlockInternalServerError();
    }
}