import { getRestrictByUserId } from "../services/restrict.service.js";

export const handleGetRestrict = async(req, res, next) => {
    const userId = req.user.id;
    try{
        const result = await getRestrictByUserId(userId);
        res.status(200)
            .success({message: "제재 목록 출력에 성공하였습니다.", result});
    } catch (error) {
        next(error);
    }
}