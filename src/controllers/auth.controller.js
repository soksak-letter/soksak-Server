import { token } from "morgan";
import { getTTLFromToken } from "../Auths/token.js";
import { checkDuplicatedEmail, checkDuplicatedUsername, signUpUser, loginUser, updateRefreshToken, SendVerifyEmailCode, checkEmailCode, getAccountInfo, resetPassword, logoutUser, withdrawUser } from "../services/auth.service.js";

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: 회원가입
 *     description: 새 사용자를 등록합니다.
 *     tags: [로그인 (임시)]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - username
 *               - name
 *               - phoneNumber
 *               - password
 *               - termsAgreed
 *               - privacyAgreed
 *               - ageOver14Agreed
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: 이메일 주소
 *               username:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 16
 *                 description: 아이디 (6-16자)
 *               name:
 *                 type: string
 *                 description: 이름
 *               phoneNumber:
 *                 type: string
 *                 pattern: '^01(?:0|1|[6-9])-(?:\d{3}|\d{4})-\d{4}$'
 *                 example: "010-1234-5678"
 *                 description: 전화번호 (01X-XXXX-XXXX 형식)
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 maxLength: 16
 *                 pattern: '^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{8,16}$'
 *                 description: 비밀번호 (8-16자, 영문+숫자 포함)
 *               termsAgreed:
 *                 type: boolean
 *                 description: 이용약관 동의 (필수)
 *               privacyAgreed:
 *                 type: boolean
 *                 description: 개인정보 수집 동의 (필수)
 *               ageOver14Agreed:
 *                 type: boolean
 *                 description: 만 14세 이상 동의 (필수)
 *               marketingAgreed:
 *                 type: boolean
 *                 description: 마케팅 정보 수신 동의 (선택)
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultType:
 *                   type: string
 *                   example: SUCCESS
 *                 error:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 success:
 *                   type: object
 *                   properties:
 *                     result:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         email:
 *                           type: string
 *                         name:
 *                           type: string
 *                         tokens:
 *                           type: object
 *                           properties:
 *                             jwtAccessToken:
 *                               type: string
 *                             jwtRefreshToken:
 *                               type: string
 *       400:
 *         description: 잘못된 요청 (필수 항목 누락, 형식 오류, 약관 동의 누락)
 *       409:
 *         description: 중복된 이메일 또는 아이디
 */
export const handleSignUp = async (req, res, next) => {
    const { email, username } = req.body;
    try{
        await checkDuplicatedEmail(email);
        await checkDuplicatedUsername(username);
        const result = await signUpUser(req.body);

        res.status(200).success({ result });
    } catch(err) {
        next(err);
    }
}

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: 로그인
 *     description: 사용자 로그인을 처리하고 JWT 토큰을 발급합니다.
 *     tags: [로그인 (임시)]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 16
 *                 description: 아이디 (6-16자)
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 maxLength: 16
 *                 pattern: '^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{8,16}$'
 *                 description: 비밀번호 (8-16자, 영문+숫자 포함)
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultType:
 *                   type: string
 *                   example: SUCCESS
 *                 error:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 success:
 *                   type: object
 *                   properties:
 *                     result:
 *                       type: object
 *                       properties:
 *                         jwtAccessToken:
 *                           type: string
 *                           description: JWT 액세스 토큰 (1시간 유효)
 *                         jwtRefreshToken:
 *                           type: string
 *                           description: JWT 리프레시 토큰 (14일 유효)
 *       401:
 *         description: 인증 실패 (아이디 또는 비밀번호 불일치)
 */
export const handleLogin = async (req, res, next) => {
    try{
        const result = await loginUser(req.body);

        res.status(200).success({ result });
    } catch(err) {
        next(err);
    }
}

export const handleLogout = async (req, res, next) => {
    const {id, provider, token} = req.user;
    const ttl = getTTLFromToken(token);

    try{
        const result = await logoutUser({id, provider, token, ttl});

        res.status(200).success({ result });
    } catch(err) {
        next(err);
    }
}

export const handleWithdrawUser = async (req, res, next) => {
    const {id, provider, token} = req.user;
    const ttl = getTTLFromToken(token);
    console.log(id + " " + provider + " " + token + " " + ttl);
    try{
        const result = await withdrawUser({provider, id});
        await logoutUser({id, provider, token, ttl});

        res.status(200).success({ result });
    } catch(err) {
        next(err);
    }
}

export const handleCheckDuplicatedEmail = async (req, res, next) => {
    const { email } = req.body;
    try{
        const { exists } = await checkDuplicatedEmail(email); 
        res.status(200).success({ exists });
    } catch(err) {
        next(err);
    }
}

export const handleCheckDuplicatedUsername = async (req, res, next) => {
    try{
        const { exists } = await checkDuplicatedUsername(email);
        res.status(200).success({ exists });
    } catch(err) {
        next(err);
    }
}

/**
 * @swagger
 * /auth/refresh:
 *   get:
 *     summary: 액세스 토큰 재발급
 *     description: 리프레시 토큰을 사용하여 새로운 액세스 토큰을 발급받습니다.
 *     tags: [로그인 (임시)]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultType:
 *                   type: string
 *                   example: SUCCESS
 *                 error:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 success:
 *                   type: object
 *                   properties:
 *                     jwtAccessToken:
 *                       type: string
 *                       description: 새로운 JWT 액세스 토큰 (1시간 유효)
 *       401:
 *         description: 인증 실패 (유효하지 않은 리프레시 토큰)
 */
export const handleRefreshToken = async (req, res, next) => {
    try{
        const authHeader = req.get("authorization");

        if(!authHeader || !authHeader.startsWith('Bearer ')) throw new Error();

        const token = authHeader.split(" ")[1];

        const jwtAccessToken = await updateRefreshToken(token);

        res.status(200).success({jwtAccessToken});
    } catch(err) {
        next(err);
    }
}

export const handleSendVerifyEmailCode = async (req, res, next) => {
    const {type} = req.params;
    const {email} = req.body;

    try{
        const result = await SendVerifyEmailCode({email, type});

        res.status(200).success(result);
    } catch(err) {
        next(err);
    }
}

export const handleCheckEmailCode = async (req, res, next) => {
    const {type} = req.params;
    const {email, code} = req.body;
    try{
        const result = await checkEmailCode({email, code, type});

        res.status(200).success(result);
    } catch(err) {
        next(err);
    }
}

export const handleGetAccountInfo = async (req, res, next) => {
    const {email} = req.body;
    try{
        const result = await getAccountInfo(email);

        res.status(200).success(result);
    } catch(err) {
        next(err);
    }
}

export const handleResetPassword = async (req, res, next) => {
    const userId = req.user.id;
    const {password} = req.body;
    try{
        const result = await resetPassword({userId, password});

        res.status(200).success(result);
    } catch(err) {
        next(err);
    }
}