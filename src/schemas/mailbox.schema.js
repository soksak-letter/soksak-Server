import { z } from "zod";

// ========== Mailbox Schema ==========
export const sessionIdParamSchema = z.object({
  params: z.object({
    sessionId: z.coerce.number("sessionId는 숫자여야 합니다.").int("sessionId는 정수여야 합니다.").positive("sessionId는 1부터 유효합니다.")
  })
});
