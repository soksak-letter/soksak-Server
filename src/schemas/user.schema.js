import { z } from "zod";
import { idPart } from "./common.schema.js";

// ========== PushSubscription Schema ==========
export const pushSubscriptionSchema = z.object({
  body: z.object({
    endpoint: z.string("endpoint는 필수입니다.").min(1, "endpoint는 비어있을 수 없습니다."),
    keys: z.object({
      p256dh: z.string("keys.p256dh는 필수입니다.").min(1, "keys.p256dh는 비어있을 수 없습니다."),
      auth: z.string("keys.auth는 필수입니다.").min(1, "keys.auth는 비어있을 수 없습니다.")
    }, "keys 객체는 필수입니다.")
  })
});

// ========== Onboarding Schema ==========
export const onboardingStep1Schema = z.object({
  body: z.object({
    gender: z.enum(["MALE", "FEMALE", "UNKNOWN"], "gender는 MALE, FEMALE, UNKNOWN 중 하나여야 합니다."),
    job: z.enum(["WORKER", "STUDENT", "HOUSEWIFE", "FREELANCER", "UNEMPLOYED", "OTHER"], "job은 WORKER, STUDENT, HOUSEWIFE, FREELANCER, UNEMPLOYED, OTHER 중 하나여야 합니다.")
  })
});

export const updateInterestsSchema = z.object({
  body: z.object({
    interestIds: z.array(idPart, "interestIds는 배열이어야 합니다.")
      .min(3, "관심사는 최소 3개 선택해야 합니다.")
  })
});

// ========== Profile Schema ==========
const nicknamePart = z.string("닉네임은 필수입니다.")
  .min(2, "닉네임은 최소 2자 이상입니다.")
  .max(20, "닉네임은 최대 20자까지입니다.");

export const updateProfileSchema = z.object({
  body: z.object({
    nickname: nicknamePart.optional()
  })
});

// ========== Notification Settings Schema ==========
export const updateNotificationSettingsSchema = z.object({
  body: z.object({
    letter: z.boolean("letter는 boolean이어야 합니다.").optional(),
    marketing: z.boolean("marketing은 boolean이어야 합니다.").optional()
  }).refine(
    (data) => typeof data.letter === "boolean" || typeof data.marketing === "boolean",
    "letter 또는 marketing 중 하나 이상이 boolean으로 필요합니다."
  )
});

// ========== Consent Schema ==========
export const updateConsentsSchema = z.object({
  body: z.object({
    termsAgreed: z.boolean("이용약관 동의는 필수 항목입니다."),
    privacyAgreed: z.boolean("개인정보 수집 동의는 필수 항목입니다."),
    ageOver14Agreed: z.boolean("만 14세 이상 동의는 필수 항목입니다."),
    marketingPushAgreed: z.boolean("푸시 알림 동의는 true, false값으로 입력되어야 합니다.").optional(),
    marketingEmailAgreed: z.boolean("이메일 동의는 true, false값으로 입력되어야 합니다.").optional()
  })
});

// ========== Activity Schema ==========
export const updateActivitySchema = z.object({
  body: z.object({}).passthrough().refine(
    (data) => Object.keys(data).length === 0,
    "body는 비어있어야 합니다."
  )
});

