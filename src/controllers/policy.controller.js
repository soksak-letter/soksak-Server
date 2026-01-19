import { getCommunityGuidelines, getPrivacy, getTerms } from "../services/policy.service.js";

/**
 * @swagger
 * /policies/community-guidelines:
 *   get:
 *     summary: 커뮤니티 가이드라인 조회
 *     description: 커뮤니티 가이드라인 문서를 조회합니다.
 *     tags: [공지/정책]
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultType:
 *                   type: string
 *                   example: SUCCESS
 *                 error:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 success:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                       example: 커뮤니티 가이드라인
 *                     content:
 *                       type: string
 *                       description: 가이드라인 내용
 *       404:
 *         description: 문서를 찾을 수 없음
 */
export const handleGetCommunityGuidelines = async (req, res, next) => {
  try {
    const data = await getCommunityGuidelines();
    return res.status(200).json({ resultType: "SUCCESS", error: null, success: data });
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /policies/terms:
 *   get:
 *     summary: 서비스 이용약관 조회
 *     description: 서비스 이용약관 문서를 조회합니다.
 *     tags: [공지/정책]
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultType:
 *                   type: string
 *                   example: SUCCESS
 *                 error:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 success:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                       example: 서비스 이용약관
 *                     content:
 *                       type: string
 *                       description: 이용약관 내용
 *       404:
 *         description: 문서를 찾을 수 없음
 */
export const handleGetTerms = async (req, res, next) => {
  try {
    const data = await getTerms();
    return res.status(200).json({ resultType: "SUCCESS", error: null, success: data });
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /policies/privacy:
 *   get:
 *     summary: 개인정보 처리방침 조회
 *     description: 개인정보 처리방침 문서를 조회합니다.
 *     tags: [공지/정책]
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultType:
 *                   type: string
 *                   example: SUCCESS
 *                 error:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 success:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                       example: 개인정보 처리방침
 *                     content:
 *                       type: string
 *                       description: 개인정보 처리방침 내용
 *       404:
 *         description: 문서를 찾을 수 없음
 */
export const handleGetPrivacy = async (req, res, next) => {
  try {
    const data = await getPrivacy();
    return res.status(200).json({ resultType: "SUCCESS", error: null, success: data });
  } catch (err) {
    next(err);
  }
};
