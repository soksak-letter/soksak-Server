import z from "zod"

export const idPart = z.number("ID는 필수 항목이며 숫자여야 합니다.").int("ID는 정수여야 합니다.").positive("ID는 1부터 유효합니다.");
export const idParamPart = z.coerce.number("ID는 숫자여야 합니다.").int("ID는 정수여야 합니다.").positive("ID는 1부터 유효합니다.");
export const ISOTimePart = z.iso.datetime({ offset: true, message: "올바른 날짜 형식이 아닙니다. (ISO8601 형식이 필요합니다)"});

export const idParamSchema = (key) => z.object({
    params: z.object({
        [key]: idParamPart
    })
})

export const ISOTimeSchema = z.object({
    query: z.object({
        date: ISOTimePart
    })
})