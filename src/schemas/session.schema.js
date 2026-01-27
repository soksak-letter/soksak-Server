// src/schema/session.schema.js
import { z } from "zod";

export const postMatchingSessionSchema = z.object({
    body: z
    .object({
        targetUserId: z.coerce.number("숫자여야 합니다.").int("정수여야 합니다.").positive("양수여야 합니다."),
    }) .strict(),
    params: z.object({
        questionId: z.coerce.number("숫자여야 합니다.").int("정수여야 합니다.").positive("양수여야 합니다."),
    }) .strict(),
    query: z.object({}).strict(),
})

export const patchMatchingSessionStatusSchema = z.object({
    params: z.object({
        sessionId: z.coerce.number("숫자여야 합니다.").int("정수여야 합니다.").positive("양수여야 합니다."),
    }) .strict(),
    body: z.object({}).strict(),
    query: z.object({}).strict()
})

export const postSessionReviewSchema = z.object({
    params: z.object({
        sessionId: z.coerce.number("숫자여야 합니다.").int("정수여야 합니다.").positive("양수여야 합니다."),
    }) .strict(),
    body: z.object({
        temperatureScore: z.coerce.number("숫자여야 합니다.").positive("양수여야 합니다."),
        reviewTag: z.string()
    }) .strict(),
    query: z.object({}).strict(),
})