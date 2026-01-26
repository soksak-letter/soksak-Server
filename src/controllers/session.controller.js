import { createMatchingSession, updateSessionDiscarded, updateSessionFriends, createSessionReview } from "../services/session.service.js";

export const handlePostMatchingSession = async(req, res, next) => {
    const userId = req.user.id;
    const {targetUserId} = req.body;
    const {questionId} = req.params;
    try{
        const result = await createMatchingSession(userId, targetUserId, questionId);
        res.status(201).success({ data: result.data, message: "세션 매칭이 성공하였습니다." });
    } catch(error) {
        next(error);
    }
} // 세션 생성

export const handlePatchMatchingSessionStatusFriends = async(req, res, next) => {
    const userId = req.user.id;
    const { sessionId } = req.params;
    try{
        const result = await updateSessionFriends(userId, sessionId);
        res.status(200).success({ data: result.data, message: "세션 상태가 FRIENDS로 변경되었습니다." });
    } catch (error) {
        next(error);
    }
} // 세션 상태 친구됨으로 변경

export const handlePatchMatchingSessionStatusDiscarded = async(req, res, next) => {
    const userId = req.user.id;
    const { sessionId } = req.params;
    try{
        const result = await updateSessionDiscarded(userId, sessionId);
        res.status(200).success({ data: result.data, message: "세션 상태가 DISCRADED로 변경되었습니다." });
    } catch (error) {
        next(error);
    }
} // 세션 상태 끝난걸로 변경

export const handlePostSessionReview = async(req, res, next) => {
    const userId = req.user.id;
    const { sessionId } = re.params;
    const { temperatureScore } = req.body;
    const { reviewTag } = req.body;    
    try{
        const result = await createSessionReview(sessionId, userId, temperatureScore, reviewTag);
        res.status(201).success({ data: result.data, message: "세션 리뷰 작성에 성공하였습니다." });
    }catch(error){
        next(error);
    }
} // 세션 후기 작성
