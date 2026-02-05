import { z } from "zod";

const emailPart = z.email("이메일 형식이 올바르지 않습니다.");
const usernamePart = z.string("아이디는 필수입니다.").min(6, "아이디는 최소 6자 이상입니다.").max(16, "아이디는 최대 6자 이상입니다.");
const passwordPart = z.string("비밀번호는 필수입니다.").regex(/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{8,16}$/, "비밀번호는 최소 8자-16자 제한입니다. (영문, 숫자 포함해 최대 16자리)");
const phoneNumberPart = z.string("전화번호는 필수입니다.").regex(/^01(?:0|1|[6-9])-(?:\d{3}|\d{4})-\d{4}$/, "전화번호 형식이 올바르지 않습니다.");

export const SignUpSchema = z.object({
    body: z.object({
        email: emailPart,
        username: usernamePart,
        name: z.string("이름은 필수 항목입니다."),
        phoneNumber: phoneNumberPart,
        password: passwordPart,
        termsAgreed: z.boolean("이용약관 동의는 필수 항목입니다."),
        privacyAgreed: z.boolean("개인정보 수집 동의는 필수 항목입니다."),
        ageOver14Agreed: z.boolean("만 14세 이상 동의는 필수 항목입니다."),
        marketingPushAgreed: z.boolean("푸시 알림 동의는 true, false값으로 입력되어야 합니다.").optional(),
        marketingEmailAgreed: z.boolean("이메일 동의는 true, false값으로 입력되어야 합니다.").optional()
    })
});

export const loginSchema = z.object({
    body: z.object({
        username: usernamePart,
        password: passwordPart
    })
})

export const emailSchema = z.object({
    body: z.object({
        email: emailPart
    })
})

export const usernameSchema = z.object({
    body: z.object({
        username: usernamePart
    })
})

export const changePasswordSchema = z.object({
    body: z.object({
        password: passwordPart
    })
})

export const resetPasswordSchema = z.object({
    body: z.object({
        oldPassword: passwordPart,
        newPassword: passwordPart
    })
})

export const verificationSendCodeSchema = z.object({
    body: z.object({
        email: emailPart
    }),
    params: z.object({
        type: z.enum(["find-id", "reset-password"], "type은 find-id 또는 reset-password입니다.")
    })
})

export const verificationConfirmCodeSchema = z.object({
    body: z.object({
        email: emailPart,
        code: z.string("코드는 문자열이어야합니다.")
    }),
    params: z.object({
        type: z.enum(["find-id", "reset-password"], "type은 find-id 또는 reset-password입니다.")
    })
})