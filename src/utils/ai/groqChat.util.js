import { groq } from "./groq.client.js";

const DEFAULT_TIMEOUT_MS = Number(process.env.GROQ_TIMEOUT_MS ?? 20000);

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function withTimeout(promise, ms = DEFAULT_TIMEOUT_MS) {
  let t;
  const timeout = new Promise((_, rej) => {
    t = setTimeout(() => rej(new Error(`Groq timeout after ${ms}ms`)), ms);
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    clearTimeout(t);
  }
}

/**
 * Groq Chat Completion wrapper (retry + timeout)
 * @returns {Promise<string>} message.content
 */
export async function groqChatCompletion({
  model,
  messages,
  temperature = 0.4,
  max_tokens = 512,
  top_p = 0.9,
  response_format, // optional
  retries = 2,
}) {
  let lastErr;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const req = groq.chat.completions.create({
        model,
        messages,
        temperature,
        max_tokens,
        top_p,
        ...(response_format ? { response_format } : {}),
      });

      const res = await withTimeout(req);
      const content = res?.choices?.[0]?.message?.content;

      if (typeof content !== "string" || !content.trim()) {
        throw new Error("Groq returned empty content");
      }
      return content;
    } catch (e) {
      lastErr = e;
      // 지수 백오프 비스무리하게
      await sleep(200 * (attempt + 1) ** 2);
    }
  }

  throw lastErr ?? new Error("Groq completion failed");
}
