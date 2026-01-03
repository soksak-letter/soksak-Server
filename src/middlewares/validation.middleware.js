import validator from "validator"

export const validateEmail = (req, res, next) => {
    const { email } = req.body

    try{
        if(!email || !validator.isEmail(email)) throw new Error("잘못된 이메일 형식입니다.");
    } catch(err) {
        next(err);
    }

    next();
}

export const validatePassword = (req, res, next) => {
    const { password } = req.body

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{6,16}$/;
    
    try{
        if(!password || !passwordRegex.test(password)) throw new Error("비밀번호는 영문, 숫자 조합의 최소 6자리, 최대 16자리여야 합니다.");
    } catch(err) {
        next(err);
    }

    next();
}