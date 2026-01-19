import { findPolicyDocumentByKey } from "../repositories/policy.repository.js";
import { PolicyNotFoundError } from "../errors/policy.error.js";

const POLICY_KEYS = {
  COMMUNITY_GUIDELINES: "COMMUNITY_GUIDELINES",
  TERMS: "TERMS",
  PRIVACY: "PRIVACY",
};

export const getCommunityGuidelines = async () => {
  const doc = await findPolicyDocumentByKey(POLICY_KEYS.COMMUNITY_GUIDELINES);
  if (!doc) throw new PolicyNotFoundError(POLICY_KEYS.COMMUNITY_GUIDELINES);

  return {
    title: "커뮤니티 가이드라인",
    content: doc.content,
  };
};

export const getTerms = async () => {
  const doc = await findPolicyDocumentByKey(POLICY_KEYS.TERMS);
  if (!doc) throw new PolicyNotFoundError(POLICY_KEYS.TERMS);

  return {
    title: "서비스 이용약관",
    content: doc.content,
  };
};

export const getPrivacy = async () => {
  const doc = await findPolicyDocumentByKey(POLICY_KEYS.PRIVACY);
  if (!doc) throw new PolicyNotFoundError(POLICY_KEYS.PRIVACY);

  return {
    title: "개인정보 처리방침",
    content: doc.content,
  };
};
