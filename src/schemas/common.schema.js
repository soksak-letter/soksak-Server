import z from "zod"

export const idPart = z.number("ID는 필수 항목이며 숫자여야 합니다.").int("ID는 정수여야 합니다.").positive("ID는 1부터 유효합니다.");
export const idParamPart = z.coerce.number("ID는 숫자여야 합니다.").int("ID는 정수여야 합니다.").positive("ID는 1부터 유효합니다.");

export const idParamSchema = (key) => z.object({
    params: z.object({
        [key]: idParamPart
    })
})