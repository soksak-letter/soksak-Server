// src/utils/ai/emotionNormalize.util.js
export function normalizeEmotionMap(obj) {
  const out = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] };
  if (!obj || typeof obj !== "object") return out;

  for (let i = 0; i < 8; i++) {
    const v =
      (Array.isArray(obj[i]) && obj[i]) ||
      (Array.isArray(obj[String(i)]) && obj[String(i)]) ||
      null;

    if (v) out[i] = v;
  }
  return out;
}

export function safeJsonParse(s) {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}
