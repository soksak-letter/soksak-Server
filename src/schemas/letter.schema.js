import { z } from "zod";
import { idPart } from "./common.schema.js";

const titlePart = z.string("제목은 필수입니다.").min(3, "제목은 최소 3자 이상입니다.").max(20, "제목은 최대 20자까지입니다.");
const contentPart = z.string("본문은 필수입니다.").max(500, "본문은 최대 500자까지입니다.");
const scheduledAtPart = z.iso
    .datetime("올바른 날짜 형식이 아닙니다. (ISO8601 형식이 필요합니다)")
    .refine((val) => new Date(val) > new Date(), "예약 시간은 현재 시간보다 미래여야 합니다.");
const isPublicPart = z.boolean("공개 여부는 필수 항목입니다. (true/false)");

export const letterToMeSchema = z.object({
    body: z.object({
        questionId: idPart,
        title: titlePart,
        content: contentPart,
        isPublic: isPublicPart,
        paperId: idPart,
        stampId: idPart,
        fontId: idPart,
        scheduledAt: scheduledAtPart
    })
});

export const letterToOtherSchema = z.object({
    body: z.object({
        questionId: idPart,
        title: titlePart,
        content: contentPart,
        isPublic: isPublicPart,
        paperId: idPart,
        stampId: idPart,
        fontId: idPart,
        receiverUserId: idPart
    })
});