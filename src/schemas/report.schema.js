// src/schemas/report.schema.js
import { z } from "zod";

export const insertUserReportSchema = z.object({
  body: z
    .object({
      letterId: z.coerce.number("숫자여야 합니다.").int("정수여야 합니다.").positive("양수여야 합니다."),
      reasons: z
        .array(z.string().min(1))
        .min(1, "reasons는 최소 1개 이상이어야 합니다."),
    })
    .strict(), // ✅ body에 예상 못한 키 들어오면 ZodError

  query: z.object({}).strict(),  // ✅ 쿼리 받지 않음 (들어오면 에러)
  params: z.object({}).strict(), // ✅ params 받지 않음 (들어오면 에러)
});