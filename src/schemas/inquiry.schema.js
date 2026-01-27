// src/schema/inquiry.schema.js
import { z } from "zod";

export const insertInquiryAsUserSchema = z.object({
    body: z.object({
        title: z.string({ required_error: "제목은 필수입니다." }).min(1, "제목은 필수입니다."),
        content: z.string({ required_error: "본문은 필수입니다." }).min(1, "본문은 필수입니다."),

    }).strict(),
    params: z.object({}).strict().optional().default({}),
    query: z.object({}).strict().optional().default({}),
})

export const insertInquiryAsAdminSchema = z.object({
    body: z.object({
        inquiryId: z.coerce.number("숫자여야 합니다.").int("정수여야 합니다.").positive(),
        answerContent: z.string("본문은 필수입니다."),
    }).strict(),
    query: z.object({}).strict().optional().default({}),
    params: z.object({}).strict().optional().default({}),
})