import { z } from "zod";

// ========== Mailbox Schema ==========
export const threadIdParamSchema = z.object({
  params: z.object({
    threadId: z.coerce.number("threadId는 숫자여야 합니다.").int("threadId는 정수여야 합니다.").positive("threadId는 1부터 유효합니다.")
  })
});
