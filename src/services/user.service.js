import { RequiredTermAgreementError } from "../errors/auth.error.js";
import { getUserForOnboarding, updateUserOnboardingStep1 } from "../repositories/onboarding.repository.js";
import { createUserAgreement, findUserById } from "../repositories/user.repository.js";

const ALLOWED_GENDERS = new Set(["MALE", "FEMALE", "UNKNOWN"]); // UNKNOWN = 비공개
const ALLOWED_JOBS = new Set(["WORKER", "STUDENT", "HOUSEWIFE", "FREELANCER", "UNEMPLOYED", "OTHER"]);

export const updateOnboardingStep1 = async ({ userId, gender, job }) => {
  // validation (요구사항 기준: 둘 다 선택)
  if (!gender || !ALLOWED_GENDERS.has(gender)) {
    const e = new Error("gender 값이 올바르지 않습니다.");
    e.status = 400;
    e.errorCode = "USER_400";
    throw e;
  }
  if (!job || !ALLOWED_JOBS.has(job)) {
    const e = new Error("job 값이 올바르지 않습니다.");
    e.status = 400;
    e.errorCode = "USER_400";
    throw e;
  }

  const user = await getUserForOnboarding(userId);
  if (!user) {
    const e = new Error("유저를 찾을 수 없습니다.");
    e.status = 404;
    e.errorCode = "USER_404";
    throw e;
  }

  // 온보딩 1회 정책 (스키마 추가 없이)
  // gender/job이 이미 채워져 있으면 완료로 간주하고 막음
  if (user.gender != null && user.job != null) {
    const e = new Error("이미 온보딩 1이 완료된 사용자입니다.");
    e.status = 409;
    e.errorCode = "USER_409";
    throw e;
  }

  await updateUserOnboardingStep1({ userId, gender, job });

  return { updated: true };
};

export const createUserAgreements = async (data) => {
  const user = await findUserById(data.userId);
  if(!user) throw new Error("존재하지 않는 사용자입니다.");

  if(!data?.body?.termsAgreed || !data?.body?.privacyAgreed || !data?.body?.ageOver14Agreed) throw new RequiredTermAgreementError("TERM_400_01", "필수 약관에 모두 동의해주세요.");

  await createUserAgreement({
      userId: data.userId,
      termsAgreed: data.body.termsAgreed,
      privacyAgreed: data.body.privacyAgreed,
      ageOver14Agreed: data.body.ageOver14Agreed,
      marketingAgreed: data.body.marketingAgreed || false
  });
}