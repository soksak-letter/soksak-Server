export const ALLOWED_GENDERS = new Set(["MALE", "FEMALE", "UNKNOWN"]); // UNKNOWN = 비공개
export const ALLOWED_JOBS = new Set(["WORKER", "STUDENT", "HOUSEWIFE", "FREELANCER", "UNEMPLOYED", "OTHER"]);

export const toIntArray = (arr) => arr.map((v) => Number(v));

export const LETTER_TYPE_ANON = "ANON_SESSION";
export const LETTER_TYPE_SELF = "SELF";

export const makePreview = (text, maxLen = 30) => {
  if (!text) return "";
  const t = String(text);
  if (t.length <= maxLen) return t;
  return `${t.slice(0, maxLen)}...`;
};

export const requiredEnv = (key) => {
  const v = process.env[key];
  if (!v) throw new Error(`환경변수 ${key} 가(이) 필요합니다.`);
  return String(v).trim();
};

export const mimeToExt = (mime) => {
  if (mime === "image/jpeg") return ".jpg";
  if (mime === "image/png") return ".png";
  if (mime === "image/webp") return ".webp";
  return null;
};

export const MAX_PROFILE_IMAGE_SIZE = 5 * 1024 * 1024;
