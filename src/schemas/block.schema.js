// src/schema/block.schema.js
import { z } from "zod";

export const postBlockUserSchema = z.object({
    params: z
        .object({
            targetUserId: z.coerce.number("숫자여야 합니다.").int("정수여야 합니다.").positive("양수여야 합니다."),
        })
        .strict(),
    query: z.object({}).strict().optional().default({}),
    body: z.object({}).strict().optional().default({}),
})