// src/utils/weeklyEmotion.util.js
import { groqChatCompletionJson } from "./ai/groqChat.util.js";

const EMOTIONS = [
  "기쁨", "감사", "평온", "설렘", "자신감",
  "불안", "피로", "슬픔", "외로움", "분노", "스트레스",
  "애정",
];

function clamp01(n) {
  const x = Number(n);
  if (!Number.isFinite(x)) return 0;
  return Math.max(0, Math.min(1, x));
}

function normalizeBucket(arr, fallbackEmotions) {
  const items = Array.isArray(arr) ? arr : [];

  // emotion 필터 + ratio 보정
  const cleaned = items
    .map((x) => ({
      emotion: String(x?.emotion ?? "").trim(),
      ratio: clamp01(x?.ratio),
    }))
    .filter((x) => x.emotion && EMOTIONS.includes(x.emotion) && x.ratio > 0);

  let use = cleaned;
  if (use.length === 0) {
    // fallback: 3개 감정 균등 분배
    const f = fallbackEmotions.length ? fallbackEmotions : ["평온", "감사", "피로"];
    use = f.slice(0, 3).map((e) => ({ emotion: e, ratio: 1 / Math.min(3, f.length || 3) }));
  }

  // 합 1로 정규화
  const sum = use.reduce((a, x) => a + x.ratio, 0) || 1;
  return use.map((x) => ({ ...x, ratio: x.ratio / sum }));
}

function pickFallbackEmotionsFromKeywords(keywordCounts) {
  const keys = Object.keys(keywordCounts ?? {});
  const hits = [];
  for (const e of EMOTIONS) {
    if (keys.some((k) => String(k).includes(e))) hits.push(e);
  }
  // 너무 감정 키워드가 없으면 안정/회복 기본값
  if (hits.length === 0) return ["평온", "감사", "피로"];
  // 중복 제거
  return Array.from(new Set(hits)).slice(0, 3);
}

/**
 * 어떤 형태(JSON object/array/partial)로 와도 최종은
 * { "0":[...], ..., "7":[...] } 8개를 무조건 채워서 반환
 */
function normalizeEmotionResult(raw, fallbackEmotions) {
  const out = {};
  for (let i = 0; i < 8; i++) out[String(i)] = [];

  // 케이스1: raw가 { "0": [...], ... } 형태
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    for (let i = 0; i < 8; i++) {
      const v = raw[String(i)];
      out[String(i)] = normalizeBucket(v, fallbackEmotions);
    }
    return out;
  }

  // 케이스2: raw가 길이 8 배열이고 각 원소가 bucket
  if (Array.isArray(raw)) {
    for (let i = 0; i < 8; i++) {
      out[String(i)] = normalizeBucket(raw[i], fallbackEmotions);
    }
    return out;
  }

  // 케이스3: 이상한 거 오면 전부 fallback
  for (let i = 0; i < 8; i++) out[String(i)] = normalizeBucket([], fallbackEmotions);
  return out;
}

const MODEL_ID = process.env.GROQ_EMOTION_MODEL ?? "openai/gpt-oss-20b";

/**
 * ✅ 무조건 리턴하는 감정 분석:
 * - Groq 실패/JSON 이상/부분 결과여도 normalize로 0..7 채움
 */
export async function analyzeWeeklyReportEmotionByKeywords(keywordCounts) {
  const fallbackEmotions = pickFallbackEmotionsFromKeywords(keywordCounts);

  const prompt = `
너는 감정 분석기다. 아래 keywordCounts를 보고 8개의 버킷(0~7)을 만든다.
각 버킷은 감정 1~3개와 ratio(0~1)로 구성한다. ratio 합은 1이 되게 한다.
반드시 JSON만 출력한다. 설명/문장/코드블록 금지.

출력 형식(반드시 이대로):
<JSON>
{
  "0":[{"emotion":"평온","ratio":0.5},{"emotion":"감사","ratio":0.5}],
  "1":[...],
  ...
  "7":[...]
}
</JSON>

keywordCounts:
${JSON.stringify(keywordCounts ?? {}, null, 2)}
`.trim();

  const messages = [
    { role: "system", content: "Return ONLY JSON wrapped in <JSON>...</JSON>." },
    { role: "user", content: prompt },
  ];

  try {
    const raw = await groqChatCompletionJson({
      model: MODEL_ID,
      messages,
      temperature: 0.1,       // 낮게
      top_p: 0.9,
      max_tokens: 700,
      retries: 2,
    });
    return normalizeEmotionResult(raw, fallbackEmotions);
  } catch (e) {
    // ✅ 여기서 절대 throw하지 말고 fallback 반환
    return normalizeEmotionResult(null, fallbackEmotions);
  }
}
