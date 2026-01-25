import { z } from "zod";

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
