// src/utils/ai/letterFromKeywords.ai.js
import { generateTextLocal } from "./localTextGen.ai.js";

/** @typedef {Record<string, number>} KeywordCountMap */

function normalizeKeywordCounts(keywordCounts) {
  if (!keywordCounts || typeof keywordCounts !== "object") return {};
  const out = {};
  for (const [k, v] of Object.entries(keywordCounts)) {
    const n = Number(v);
    if (!k || !Number.isFinite(n) || n <= 0) continue;
    out[String(k)] = Math.floor(n);
  }
  return out;
}

function summarizeKeywords(keywordCounts, topN = 8) {
  const norm = normalizeKeywordCounts(keywordCounts);
  const entries = Object.entries(norm).sort((a, b) => b[1] - a[1]);
  if (entries.length === 0) return { total: 0, top: [] };

  const total = entries.reduce((acc, [, c]) => acc + c, 0);
  const top = entries.slice(0, topN).map(([keyword, count]) => ({
    keyword,
    count,
    ratio: total > 0 ? count / total : 0,
  }));
  return { total, top };
}

function pickEmotionHintsFromKeywords(keywordCounts) {
  // 키워드 중 감정 단어가 섞여있으면 “힌트”로만 사용
  const emotionSet = [
    "기쁨", "감사", "평온", "설렘", "자신감",
    "불안", "피로", "슬픔", "외로움", "분노", "스트레스",
  ];
  const keys = Object.keys(normalizeKeywordCounts(keywordCounts));
  const hits = [];
  for (const e of emotionSet) {
    if (keys.some((k) => k.includes(e))) hits.push(e);
  }
  return hits.slice(0, 3);
}

function pickTopicHint(keywordCounts) {
  const keys = Object.keys(normalizeKeywordCounts(keywordCounts));
  const topics = [
    { key: ["공부", "학교", "과제", "시험", "취업", "면접"], label: "해야 할 일" },
    { key: ["운동", "헬스", "식단", "다이어트", "건강"], label: "몸을 챙기는 일" },
    { key: ["직장", "업무", "프로젝트", "운영", "개발"], label: "일" },
    { key: ["가족", "사랑", "인간관계", "친구"], label: "사람" },
    { key: ["돈", "경제", "저축"], label: "현실" },
  ];
  for (const t of topics) {
    if (t.key.some((x) => keys.some((k) => k.includes(x)))) return t.label;
  }
  return "하루";
}

/**
 * “템플릿 채우기 모드”를 유발하는 단어/형식을 최대한 쓰지 않는 프롬프트.
 * - 규칙 나열 대신: (문체 + 금지사항 최소화 + 샘플 1개)로 유도
 * - 출력은 <LETTER>...</LETTER> 사이만 강제
 */
export function buildKoreanLetterPromptPlain({
  basePrompt,
  keywordCounts,
  context = {},
  topN = 8,
  lengthHint = "300~500자",
}) {
  const { total } = summarizeKeywords(keywordCounts, topN);

  const {
    receiverName = "상대",
    relationship = "친구",
    mood = "따뜻하고 담백하게",
    occasion = "이번 주를 돌아보며",
  } = context;

  const emotionHints = pickEmotionHintsFromKeywords(keywordCounts); // ["기쁨","불안"] 같은 것
  const topicHint = pickTopicHint(keywordCounts);

  // NOTE: 콜론(:), 대괄호([]) 같은 “양식 신호”를 프롬프트에서 최대한 피함
  return `
${(basePrompt ?? "").trim()}

받는 사람은 ${receiverName} 이고 관계는 ${relationship} 이다.
이번 글의 분위기는 ${mood} 이고 맥락은 ${occasion} 이다.
이번 주에는 ${topicHint}와 관련된 생각이 많았던 것으로 보인다.
가능하면 ${emotionHints.length ? emotionHints.join(" 그리고 ") : "여러 감정"}의 결을 부드럽게 녹여라.
키워드는 절대로 그대로 나열하지 말고 자연스러운 의미로만 반영하라.
전체 길이는 ${lengthHint} 정도의 한국어 존댓말 한 단락이다.
줄바꿈을 만들지 말고, 기호를 남발하지 말고, 문서 양식처럼 보이게 쓰지 말라.
첫 글자부터 바로 편지 문장으로 시작하라.

아래는 문체 참고용 샘플이다. 샘플을 베끼지 말고 문체만 따라라.
<LETTER>
이번 주도 참 수고 많으셨어요. 마음이 복잡한 순간이 있었더라도 그 안에서 할 일을 해내고, 필요한 걸 챙겨온 것만으로도 충분히 잘하고 계신 거예요. 가끔은 속도를 조금 늦춰도 괜찮아요. 작은 성취를 스스로 인정해 주는 것이 생각보다 큰 힘이 되더라고요. 다음 주에는 하루에 한 번만이라도 숨을 길게 내쉬며 내 컨디션을 확인해 보세요. 스스로에게 따뜻한 위로의 편지를 보내보세요.
</LETTER>

이제 같은 문체로 새 편지를 작성하라.
반드시 아래 태그 사이에만 출력하라.
<LETTER>
</LETTER>
`.trim();
}

function extractBetweenTags(text, start = "<LETTER>", end = "</LETTER>") {
  const s = String(text).indexOf(start);
  const e = String(text).indexOf(end);
  if (s !== -1 && e !== -1 && e > s) {
    return String(text).slice(s + start.length, e).trim();
  }
  return String(text).trim();
}

function sanitizeOneLine(text) {
  let t = String(text);

  // 코드블록/마크다운 제거
  t = t.replace(/```[\s\S]*?```/g, " ");
  t = t.replace(/[*#_`]/g, " ");

  // 줄바꿈 제거
  t = t.replace(/\r?\n+/g, " ");

  // 대괄호/중괄호 제거 (템플릿 채우기 방지)
  t = t.replace(/[\[\]\{\}]/g, " ");

  // 콜론/세미콜론 제거 (양식 느낌 방지)
  t = t.replace(/[:;：；]/g, " ");

  // 빈칸 템플릿 제거
  t = t.replace(/_{2,}/g, " ");

  // 하이픈 제거
  t = t.replace(/-/g, " ");

  // 공백 정리
  t = t.replace(/\s+/g, " ").trim();

  return t;
}

function looksLikeTemplateLoop(text) {
  const t = String(text);

  // [제목] [본문] 같은 패턴
  if (/\[[^\]]+\]/.test(t)) return true;

  // "제목 본문 참조" 류 반복 루프
  const badWords = ["제목", "본문", "참조"];
  if (badWords.some((w) => t.includes(w))) return true;

  // 같은 구간 반복이 심하면 루프
  const repeats = (t.match(/(제목|본문|참조)/g) || []).length;
  if (repeats >= 2) return true;

  return false;
}

function tooRepetitive(text) {
  const t = String(text).trim();
  if (!t) return true;

  const words = t.split(/\s+/).filter(Boolean);
  if (words.length < 40) return true;

  const freq = new Map();
  for (const w of words) freq.set(w, (freq.get(w) ?? 0) + 1);

  let max = 0;
  for (const v of freq.values()) max = Math.max(max, v);

  // 최빈 단어가 너무 많으면(루프/찬송가 모드) 컷
  return max / words.length > 0.18;
}

function isBadLetter(text) {
  const t = String(text).trim();
  if (t.length < 220) return true;
  if (t.length > 1200) return true;

  // 템플릿/양식 루프
  if (looksLikeTemplateLoop(t)) return true;

  // 질문 과다
  const qCount = (t.match(/[?？]/g) || []).length;
  if (qCount >= 3) return true;

  // 영어 과다
  const eng = (t.match(/[A-Za-z]/g) || []).length;
  if (eng > 20) return true;

  if (tooRepetitive(t)) return true;

  return false;
}

function ensureEnding(text) {
  const endSentence = "스스로에게 따뜻한 위로의 편지를 보내보세요.";
  let t = String(text).trim();

  if (!t.endsWith(endSentence)) {
    t = t.replace(/[.。]+$/g, "").trim();
    t = `${t} ${endSentence}`.trim();
  }
  return t;
}

function buildDeterministicFallback({ receiverName = "당신", keywordCounts }) {
  const topic = pickTopicHint(keywordCounts);
  const emotions = pickEmotionHintsFromKeywords(keywordCounts);

  const emotionLine =
    emotions.length >= 2
      ? `${emotions[0]}과 ${emotions[1]}이 함께 스쳤을 수도 있겠어요.`
      : emotions.length === 1
      ? `${emotions[0]}의 결이 꽤 남아 있었을 수도 있겠어요.`
      : "여러 감정이 오가던 한 주였을 수도 있겠어요.";

  const t =
    `이번 주도 정말 수고 많았어요. ${receiverName}님이 ${topic}를 챙기면서 하루를 버텨낸 게 느껴져요. ` +
    `${emotionLine} 그래도 그 안에서 할 수 있는 걸 해낸 것만으로도 충분히 잘하고 계신 거예요. ` +
    `다음 주에는 하루에 한 번만이라도 숨을 길게 내쉬고, 지금 내 컨디션을 한 문장으로 적어보는 걸 추천해요. ` +
    `스스로에게 따뜻한 위로의 편지를 보내보세요.`;

  return t;
}

/**
 * 최종: 키워드맵 → 한국어 편지 생성
 * - 템플릿 루프 감지하면 재시도
 * - 끝까지 실패하면 deterministic fallback 반환(절대 쓰레기 출력 안 나오게)
 */
export async function generateKoreanLetterFromKeywords({
  keywordCounts,
  basePrompt,
  context,
  topN = 8,
  lengthHint,
  temperature = 0.42,
  maxNewTokens = 280,
}) {
  const prompt = buildKoreanLetterPromptPlain({
    basePrompt,
    keywordCounts,
    context,
    topN,
    lengthHint,
  });

  const attempts = [
    // 1차: 기본
    { temperature, repetitionPenalty: 1.25, topP: 0.9, noRepeatNgramSize: 4 },
    // 2차: 더 단단하게(루프 끊기)
    { temperature: Math.max(0.30, temperature - 0.08), repetitionPenalty: 1.35, topP: 0.88, noRepeatNgramSize: 5 },
    // 3차: 너무 경직되면 약간 풀기
    { temperature: Math.min(0.55, temperature + 0.08), repetitionPenalty: 1.28, topP: 0.9, noRepeatNgramSize: 4 },
  ];

  let last = "";
  for (let i = 0; i < attempts.length; i++) {
    const a = attempts[i];

    const raw = await generateTextLocal({
      prompt,
      temperature: a.temperature,
      maxNewTokens,
      topP: a.topP,
      repetitionPenalty: a.repetitionPenalty,
      // generateTextLocal이 지원하면 적용됨(지원 안 해도 무해)
      noRepeatNgramSize: a.noRepeatNgramSize,
    });

    let cleaned = extractBetweenTags(raw);
    cleaned = sanitizeOneLine(cleaned);
    cleaned = ensureEnding(cleaned);

    last = cleaned;
    if (!isBadLetter(cleaned)) return cleaned;
  }

  // 여기까지 오면 모델이 계속 폭주한 것. 하드 fallback으로 “무조건 편지” 보장
  const fallback = buildDeterministicFallback({
    receiverName: context?.receiverName ?? "당신",
    keywordCounts,
  });
  return ensureEnding(sanitizeOneLine(fallback));
}
