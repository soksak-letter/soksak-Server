import { createUserAgreements, updateOnboardingStep1 } from "../services/user.service.js";

/**
 * @swagger
 * /users/me/onboarding:
 *   patch:
 *     summary: 기본정보 저장
 *     description: 사용자의 성별과 직업 정보를 저장합니다.
 *     tags: [온보딩]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - gender
 *               - job
 *             properties:
 *               gender:
 *                 type: string
 *                 enum: [MALE, FEMALE, UNKNOWN]
 *                 description: 성별 (UNKNOWN = 비공개)
 *               job:
 *                 type: string
 *                 enum: [WORKER, STUDENT, HOUSEWIFE, FREELANCER, UNEMPLOYED, OTHER]
 *                 description: 직업
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
 *                     updated:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: 잘못된 요청 (gender 또는 job 값이 올바르지 않음)
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 유저를 찾을 수 없음
 *       409:
 *         description: 이미 온보딩이 완료된 사용자
 */
export const handlePatchOnboardingStep1 = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).error({ errorCode: "AUTH_401", reason: "Unauthorized" });
    }

    // 화면/기획 기준: gender, job만 받음 (ageRange는 받지 않음)
    const { gender, job } = req.body;

    const result = await updateOnboardingStep1({ userId, gender, job });

    return res.status(200).success(result);
  } catch (err) {
    next(err);
  }
};

export const handleCreateUserAgreements = async (req, res, next) => {
  const userId = req.user.id;
  
  try{
    await createUserAgreements({userId, body: req.body});

    res.status(200).success({ message: "약관 동의가 완료되었습니다." });
  } catch(err) {
    next(err);
  }
}