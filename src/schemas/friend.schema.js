// src/schema/friend.schema.js
import { z } from "zod";

export const postTargetUserIdAndSIdSchema = z.object({
    body: z
        .object({
            targetUserId: z.coerce.number("숫자여야 합니다.").int("정수여야 합니다.").positive("양수여야 합니다."),
            sessionId: z.coerce.number("숫자여야 합니다.").int("정수여야 합니다.").positive("양수여야 합니다."),
        })
        .strict(),
    query: z.object({}).strict(),
    params: z.object({}).strict(),
})

export const requesterUserIdSchema = z.object({
    body: z
        .object({
            requesterUserId: z.coerce.number("숫자여야 합니다.").int("정수여야 합니다.").positive("양수여야 합니다."),
        })
        .strict(),
    query: z.object({}).strict(),
    params: z.object({}).strict(),
})

export const targetUserIdSchema = z.object({
    params: z
        .object({
            targetUserId: z.coerce.number("숫자여야 합니다.").int("정수여야 합니다.").positive("양수여야 합니다."),
        })
        .strict(),
    object: z.object({}).strict(),
    query: z.object({}).strict(),
})