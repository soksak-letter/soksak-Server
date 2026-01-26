import { groqChatCompletion } from "./groqChat.util.js";

const MODEL_ID = process.env.GROQ_LETTER_MODEL ?? "llama-3.3-70b-versatile";

/**
 * 기존 시그니처 유지: generateTextLocal({ prompt, ... })
 */
export async function generateTextLocal({
  prompt,
  maxNewTokens = 280,
  temperature = 0.42,
  topP = 0.9,
  repetitionPenalty, // 사용 안 함(호환용)
  noRepeatNgramSize, // 사용 안 함(호환용)
}) {
  const messages = [
    {
      role: "system",
      content:
        "You are a careful Korean writing assistant. Follow the user's instructions exactly.",
    },
    { role: "user", content: String(prompt) },
  ];

  // Groq/OpenAI 파라미터명은 max_tokens / top_p / temperature 형태 :contentReference[oaicite:6]{index=6}
  const text = await groqChatCompletion({
    model: MODEL_ID,
    messages,
    temperature,
    top_p: topP,
    max_tokens: maxNewTokens,
  });

  return text;
}
