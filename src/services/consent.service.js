import { findUserAgreementByUserId, upsertUserAgreement } from "../repositories/consent.repository.js";
import { CONSENT_ERRORS } from "../errors/consent.error.js";

const isBooleanOrUndefined = (v) => typeof v === "boolean" || typeof v === "undefined";

export const getMyConsents = async ({ userId }) => {
  if (!userId) throw CONSENT_ERRORS.UNAUTHORIZED;

  const agreement = await findUserAgreementByUserId(userId);


  const safe = agreement ?? (await upsertUserAgreement({ userId, data: {} }));

  
  return {
    termsAgreed: safe.termsAgreed,
    privacyAgreed: safe.privacyAgreed,
  };
};

export const patchMyConsents = async ({ userId, payload }) => {
  if (!userId) throw CONSENT_ERRORS.UNAUTHORIZED;

  const { termsAgreed, privacyAgreed, marketingAgreed, ageOver14Agreed } = payload ?? {};

  if (
    !isBooleanOrUndefined(termsAgreed) ||
    !isBooleanOrUndefined(privacyAgreed) ||
    !isBooleanOrUndefined(marketingAgreed) ||
    !isBooleanOrUndefined(ageOver14Agreed)
  ) {
    throw CONSENT_ERRORS.INVALID_BODY;
  }

  const updateData = {};
  if (typeof termsAgreed === "boolean") updateData.termsAgreed = termsAgreed;
  if (typeof privacyAgreed === "boolean") updateData.privacyAgreed = privacyAgreed;
  if (typeof marketingAgreed === "boolean") updateData.marketingAgreed = marketingAgreed;
  if (typeof ageOver14Agreed === "boolean") updateData.ageOver14Agreed = ageOver14Agreed;

  await upsertUserAgreement({ userId, data: updateData });

  return { updated: true };
};
