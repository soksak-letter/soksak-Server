import { groqChatCompletion } from "./ai/groqChat.util.js";

const EMOTIONS = [
  "기쁨",
  "감사",
  "평온",
  "불안",
  "피로",
  "슬픔",
  "분노",
  "당황",
  "혐오",
  "기대",
  "후회",
  "애정",
];

const DEFAULT_MODEL = process.env.GROQ_EMOTION_MODEL ?? "openai/gpt-oss-20b";

/**
 * openai/gpt-oss-* 는 strict: true Structured Outputs 지원(문서 기준) :contentReference[oaicite:7]{index=7}
 */
function canStrictJsonSchema(model) {
  return model === "openai/gpt-oss-20b" || model === "openai/gpt-oss-120b";
}

function fallbackWeeklyDistributionFromKeywords(rows) {
  // 키워드 중 감정명(기쁨/감사/불안...)이 포함되면 그걸로 비율 생성
  const hit = new Map();
  for (const r of rows) {
    const k = String(r.keyword ?? "").trim();
    const c = Number(r.count ?? 0);
    if (!k || !Number.isFinite(c) || c <= 0) continue;
    for (const e of EMOTIONS) {
      if (k.includes(e)) hit.set(e, (hit.get(e) ?? 0) + c);
    }
  }
  if (hit.size === 0) return [{ emotion: "평온", ratio: 1 }];

  const total = Array.from(hit.values()).reduce((a, b) => a + b, 0) || 1;
  const arr = Array.from(hit.entries())
    .map(([emotion, count]) => ({ emotion, ratio: count / total }))
    .sort((a, b) => b.ratio - a.ratio)
    .slice(0, 6);

  // 정규화 + 반올림
  const s = arr.reduce((a, x) => a + x.ratio, 0) || 1;
  return arr.map((x, i) => ({
    emotion: x.emotion,
    ratio: Number((x.ratio / s).toFixed(2)),
  }));
}

function normalizeRows(input) {
  // 허용: [{keyword,count,day?}] 또는 {키워드:count}
  if (!input) return [];

  if (Array.isArray(input)) {
    return input
      .map((r) => ({
        keyword: String(r?.keyword ?? "").trim(),
        count: Number(r?.count ?? 0),
        day: Number.isInteger(r?.day) ? r.day : null,
      }))
      .filter((x) => x.keyword && Number.isFinite(x.count) && x.count > 0);
  }

  if (typeof input === "object") {
    return Object.entries(input)
      .map(([k, v]) => ({
        keyword: String(k).trim(),
        count: Number(v),
        day: null,
      }))
      .filter((x) => x.keyword && Number.isFinite(x.count) && x.count > 0);
  }

  return [];
}

function initOut() {
  const out = {};
  for (let i = 0; i <= 7; i++) out[i] = null;
  return out;
}

function clamp01(x) {
  if (!Number.isFinite(x)) return 0;
  if (x < 0) return 0;
  if (x > 1) return 1;
  return x;
}

function validateAndFix(out, { maxEmotions = 6, minRatio = 0.05 } = {}) {
  const fixed = initOut();

  for (let d = 0; d <= 7; d++) {
    const v = out?.[String(d)] ?? out?.[d];

    // 명시적 null은 그대로
    if (v === null) {
      fixed[d] = null;
      continue;
    }

    // 배열이 아니면 null 처리
    if (!Array.isArray(v)) {
      fixed[d] = null;
      continue;
    }

    // 배열 정리
    let cleaned = v
      .map((x) => ({
        emotion: String(x?.emotion ?? "").trim(),
        ratio: clamp01(Number(x?.ratio)),
      }))
      .filter((x) => EMOTIONS.includes(x.emotion) && x.ratio > 0)
      .sort((a, b) => b.ratio - a.ratio)
      .filter((x) => x.ratio >= minRatio)
      .slice(0, maxEmotions);

    if (cleaned.length === 0) {
      fixed[d] = null;
      continue;
    }

    // 재정규화
    const sum = cleaned.reduce((s, x) => s + x.ratio, 0) || 1;
    cleaned = cleaned.map((x) => ({
      emotion: x.emotion,
      ratio: Number((x.ratio / sum).toFixed(2)),
    }));

    // 합계 보정(마지막 값에 오차 몰아주기)
    const rsum = cleaned.reduce((s, x) => s + x.ratio, 0);
    if (Math.abs(rsum - 1) >= 0.01) {
      cleaned[cleaned.length - 1].ratio = Number(
        (cleaned[cleaned.length - 1].ratio + (1 - rsum)).toFixed(2)
      );
      if (cleaned[cleaned.length - 1].ratio < 0) cleaned[cleaned.length - 1].ratio = 0;
    }

    fixed[d] = cleaned;
  }

  // ✅ 절대 복제하지 않음. “없으면 null” 규칙 준수.
  return fixed;
}


/**
 * @param {Array|object} rowsOrMap - 기존 코드에서 keywordRows(findMany) 또는 keywordCountMap 둘 다 받게 설계
 * @returns {{0:Array<{emotion,ratio}>,1:...,7:...}}
 */
export async function analyzeWeeklyReportEmotionByKeywords(rowsOrMap, options = {}) {
  const maxEmotions = options.maxEmotions ?? 6;
  const minRatio = options.minRatio ?? 0.05;

  const rows = normalizeRows(rowsOrMap);
if (rows.length === 0) return initOut();


  // 토큰 줄이려고 상위 N개만
  const topN = options.topN ?? 20;
  rows.sort((a, b) => b.count - a.count);
  const top = rows.slice(0, topN).map(({ keyword, count, day }) => ({
    keyword,
    count: Math.floor(count),
    ...(Number.isInteger(day) ? { day } : {}),
  }));

  const system = [
  "너는 '주간 감정 분포'를 만드는 분석기다.",
  "출력은 JSON만. 설명/문장 금지.",
  `감정은 반드시 다음 중에서만 선택한다: ${EMOTIONS.join(", ")}`,
  "반드시 0부터 7까지 모든 키를 포함하라.",
  "해당 키에 대한 데이터가 없으면 그 값은 반드시 null로 하라. 빈 배열 금지.",
  "배열을 출력하는 경우 ratio 합은 1.00이 되게 하라.",
].join("\n");


  // Structured Outputs(JSON Schema) 또는 JSON mode 사용 :contentReference[oaicite:8]{index=8}
  const schema = {
  name: "weekly_emotion_distribution",
  strict: canStrictJsonSchema(DEFAULT_MODEL),
  schema: {
    type: "object",
    properties: Object.fromEntries(
      Array.from({ length: 8 }, (_, i) => [
        String(i),
        {
          anyOf: [
            { type: "null" },
            {
              type: "array",
              items: {
                type: "object",
                properties: {
                  emotion: { type: "string", enum: EMOTIONS },
                  ratio: { type: "number", minimum: 0, maximum: 1 },
                },
                required: ["emotion", "ratio"],
                additionalProperties: false,
              },
            },
          ],
        },
      ])
    ),
    required: ["0", "1", "2", "3", "4", "5", "6", "7"], // ✅ 키는 무조건
    additionalProperties: false,
  },
};


  const response_format = canStrictJsonSchema(DEFAULT_MODEL)
    ? { type: "json_schema", json_schema: schema }
    : { type: "json_object" };

  const content = await groqChatCompletion({
    model: DEFAULT_MODEL,
    messages: [
      { role: "system", content: system },
      { role: "user", content: JSON.stringify({ keywords: top }) },
    ],
    temperature: options.temperature ?? 0.2,
    max_tokens: 700,
    response_format,
  });

  let parsed;
try {
  parsed = JSON.parse(content);
} catch {
  return initOut();
}

const fixed = validateAndFix(parsed, { maxEmotions, minRatio });

// ✅ 키워드가 있는데도 0이 null이면: 폴백 분포를 만들어 넣는다
if (rows.length > 0 && (fixed[0] === null || fixed[0]?.length === 0)) {
  fixed[0] = fallbackWeeklyDistributionFromKeywords(rows);
}

return fixed;
}
