// src/utils/ai/groqChat.util.js
import { groq } from "./groq.client.js";

const DEFAULT_TIMEOUT_MS = Number(process.env.GROQ_TIMEOUT_MS ?? 20000);
const MAX_GROQ_CONCURRENCY = Number(process.env.GROQ_CONCURRENCY ?? 4);

/** 간단 세마포어(추가 deps 없이 전역 동시성 제한) */
class Semaphore {
  constructor(max) {
    this.max = max;
    this.cur = 0;
    this.q = [];
  }
  async acquire() {
    if (this.cur < this.max) {
      this.cur++;
      return;
    }
    await new Promise((r) => this.q.push(r));
    this.cur++;
  }
  release() {
    this.cur--;
    const next = this.q.shift();
    if (next) next();
  }
  async run(fn) {
    await this.acquire();
    try {
      return await fn();
    } finally {
      this.release();
    }
  }
}

const groqSem = new Semaphore(MAX_GROQ_CONCURRENCY);

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function jitter(ms) {
  const j = Math.floor(Math.random() * 0.25 * ms);
  return ms + j;
}

function isRetryable(e) {
  const status = e?.status ?? e?.response?.status;
  if (!status) return true; // 네트워크/타임아웃 등
  if (status === 408) return true;
  if (status === 429) return true;
  if (status >= 500 && status <= 599) return true;
  return false;
}

function isJsonSchemaFail(e) {
  const msg = String(e?.message ?? "");
  return msg.includes("json_validate_failed") || msg.includes("Failed to validate JSON");
}

async function withTimeout(fn, ms = DEFAULT_TIMEOUT_MS) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(new Error(`Groq timeout after ${ms}ms`)), ms);

  try {
    return await fn(ac.signal);
  } finally {
    clearTimeout(t);
  }
}

function extractJsonBlock(text) {
  const s1 = String(text).indexOf("<JSON>");
  const e1 = String(text).indexOf("</JSON>");
  if (s1 !== -1 && e1 !== -1 && e1 > s1) {
    return String(text).slice(s1 + 6, e1).trim();
  }

  // 태그 없으면, 첫 { ~ 마지막 } 혹은 첫 [ ~ 마지막 ]
  const t = String(text);
  const objStart = t.indexOf("{");
  const objEnd = t.lastIndexOf("}");
  if (objStart !== -1 && objEnd !== -1 && objEnd > objStart) return t.slice(objStart, objEnd + 1);

  const arrStart = t.indexOf("[");
  const arrEnd = t.lastIndexOf("]");
  if (arrStart !== -1 && arrEnd !== -1 && arrEnd > arrStart) return t.slice(arrStart, arrEnd + 1);

  return t.trim();
}

function safeJsonParse(s) {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

function repairJsonLoose(s) {
  // “가벼운 수선”만: trailing comma 제거, 스마트쿼트 제거 등
  let t = String(s).trim();
  t = t.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
  t = t.replace(/,\s*([}\]])/g, "$1"); // trailing comma
  return t;
}

/**
 * 기본 텍스트 completion (강제 스키마 response_format은 여기서 웬만하면 쓰지 말 것)
 */
export async function groqChatCompletionText({
  model,
  messages,
  temperature = 0.4,
  max_tokens = 512,
  top_p = 0.9,
  // response_format, // <- 웬만하면 쓰지 말자(특히 json_schema)
  retries = 2,
}) {
  let lastErr;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await groqSem.run(() =>
        withTimeout((signal) =>
          groq.chat.completions.create(
            { model, messages, temperature, max_tokens, top_p },
            { signal }
          )
        )
      );

      const content = res?.choices?.[0]?.message?.content;
      if (typeof content !== "string" || !content.trim()) {
        throw new Error("Groq returned empty content");
      }
      return content;
    } catch (e) {
      lastErr = e;

      // 스키마 실패는 “재시도해도 또 실패”가 많아서 attempt를 소모만 시킴.
      // 그래도 여기선 호출자가 전략을 바꿀 수 있게 throw로 넘기는 게 낫다.
      if (!isRetryable(e)) break;

      const backoff = jitter(250 * (attempt + 1) ** 2);
      await sleep(backoff);
    }
  }

  throw lastErr ?? new Error("Groq completion failed");
}

/**
 * JSON 반환(클라에서 파싱/보정). 절대 json_schema 강제에 기대지 않음.
 */
export async function groqChatCompletionJson({
  model,
  messages,
  temperature = 0.2,
  max_tokens = 512,
  top_p = 0.9,
  retries = 2,
}) {
  const raw = await groqChatCompletionText({
    model,
    messages,
    temperature,
    max_tokens,
    top_p,
    retries,
  });

  const extracted = extractJsonBlock(raw);
  const parsed1 = safeJsonParse(extracted);
  if (parsed1) return parsed1;

  const repaired = repairJsonLoose(extracted);
  const parsed2 = safeJsonParse(repaired);
  if (parsed2) return parsed2;

  // 마지막: 원문에서 다시 시도(혹시 block 추출이 망했을 수 있음)
  const parsed3 = safeJsonParse(repairJsonLoose(raw));
  if (parsed3) return parsed3;

  throw new Error("Failed to parse JSON from Groq response");
}

export { isJsonSchemaFail };
