import crypto from "crypto";

/**
 * 난수 숫자 생성 함수
 * 
 * @param {number} length - 생성할 숫자 길이
 * @return {string} - 생성된 숫자 문자열 
 */
export const createRandomNumber = (length) => {
    const min = 10 ** (length - 1);
    const max = 10 ** length - 1;
    return crypto.randomInt(min, max).toString();
}