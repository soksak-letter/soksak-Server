import { insertBlockedUser } from "../repositories/block.repository.js";
import { findUserById } from "../repositories/user.repository.js";
import { InvalidUserError } from "../errors/user.error.js";
import { BlockInternalError } from "../errors/block.error.js";

export async function postUserBlock(blockerId, blockedId) {
    const blockerUser = await findUserById(blockerId);
    const blockedUser = await findUserById(blockedId);

    if (blockerUser.isNull || blockedUser.isNull) {
        throw new InvalidUserError(); 
    } else if (blockedUser.isNull) {
        throw new InvalidUserError(); 
    }
    try {
        await insertBlockedUser(blockerId, blockedId);
        return {
            status: 200,
            message: "유저 차단이 성공적으로 처리되었습니다.",
        };
    } catch (error) {
        throw new BlockInternalError(error.message);
    }
}