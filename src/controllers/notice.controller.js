import { getNoticeDetail, getNotices } from "../services/notice.service.js";

/**
 * @swagger
 * /notices:
 *   get:
 *     summary: 공지사항 목록
 *     description: 활성화된 공지사항 목록을 조회합니다.
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
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           title:
 *                             type: string
 *                           content:
 *                             type: string
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 */
export const handleGetNotices = async (req, res, next) => {
  try {
    const data = await getNotices();
    return res.status(200).json({ resultType: "SUCCESS", error: null, success: data });
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /notices/{noticeId}:
 *   get:
 *     summary: 공지사항 상세 조회
 *     description: 특정 공지사항의 상세 내용을 조회합니다.
 *     tags: [공지/정책]
 *     parameters:
 *       - in: path
 *         name: noticeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 공지사항 ID
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
 *                     id:
 *                       type: integer
 *                     title:
 *                       type: string
 *                     content:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: 잘못된 noticeId
 *       404:
 *         description: 공지사항을 찾을 수 없음
 */
export const handleGetNoticeDetail = async (req, res, next) => {
  try {
    const { noticeId } = req.params;
    const data = await getNoticeDetail(noticeId);
    return res.status(200).json({ resultType: "SUCCESS", error: null, success: data });
  } catch (err) {
    next(err);
  }
};
