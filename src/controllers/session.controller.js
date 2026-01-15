/* 
matching session 테이블에서 작업되는 내용들
1. 세션 생성
2. 세션 상태 변경 (친구됨 or 파토남)
3. 후기 작성 (편지 후기, 편지 온도)

고려사항
1. 세션 생성 시 id
*/
import { UnExpectArgumentsError } from "../errors/session.error.js";
import { createMatchingSession, updateSessionDiscarded, updateSessionFriends, createSessionReview } from "../services/session.service.js";

export const handlePostMatchingSession = async(req, res, next) => {
    const userId = Number(req.user.id);
    const targetUserId = Number(req.body.targetUserId);
    const questionId = Number(req.params.questionId);
    if(questionId == null || targetUserId == null) throw new UnExpectArgumentsError;
    try{
        const result = await createMatchingSession(userId, targetUserId, questionId);
        res.status(result.status).json({ data: result.data, message: result.message });
    } catch(error) {
        next(error);
    }
} // 세션 생성

export const handlePatchMatchingSessionStatusFriends = async(req, res, next) => {
    const userId = Number(req.user.id);
    const sessionId = Number(req.params.sessionId);
    if(sessionId == null) throw new UnExpectArgumentsError;
    try{
        const result = await updateSessionFriends(userId, sessionId);
        res.status(result.status).json({ data: result.data, message: result.message });
    } catch (error) {
        next(error);
    }
} // 세션 상태 친구됨으로 변경

export const handlePatchMatchingSessionStatusDiscarded = async(req, res, next) => {
    const userId = Number(req.user.id);
    const sessionId = Number(req.params.sessionId);
    if(sessionId == null) throw new UnExpectArgumentsError;
    try{
        const result = await updateSessionDiscarded(userId, sessionId);
        res.status(result.status).json({ data: result.data, message: result.message });
    } catch (error) {
        next(error);
    }
} // 세션 상태 끝난걸로 변경

export const handlePostSessionReview = async(req, res, next) => {
    const sessionId = Number(req.params.sessionId);
    const userId = Number(req.user.id);
    const temperatureScore = Number(req.body.temperatureScore);
    const reviewTag = req.body.reviewTag;
    if(sessionId == null || userId == null || temperatureScore == null || reviewTag == null) throw new UnExpectArgumentsError;
    try{
        const result = await createSessionReview(sessionId, userId, temperatureScore, reviewTag);
        res.status(result.status).json({ data: result.data, message: result.message });
    }catch(error){
        next(error);
    }
} // 세션 후기 작성