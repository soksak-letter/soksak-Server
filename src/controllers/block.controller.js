import { createBlockUser } from "../services/block.service.js";

export const handlePostBlock = async(req, res, next) => {
    const userId = req.user.id;
    const { targetUserId } = req.params;
    try {
        const result = await createBlockUser(userId, targetUserId);
        res.status(201)
        .success({message: "유저 차단에 성공하였습니다.", result})
    } catch (error) {
        next(error);
    }
}