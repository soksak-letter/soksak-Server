// src/utils/ai/localTextGen.ai.js
import { groqChatCompletionText } from "./groqChat.util.js";

const MODEL_ID = process.env.GROQ_LETTER_MODEL ?? "llama-3.3-70b-versatile";

export async function generateTextLocal({
  prompt,
  maxNewTokens = 280,
  temperature = 0.42,
  topP = 0.9,
}) {
  const messages = [
    { role: "system", content: "You are a careful Korean writing assistant." },
    { role: "user", content: String(prompt) },
  ];

  const text = await groqChatCompletionText({
    model: MODEL_ID,
    messages,
    temperature,
    top_p: topP,
    max_tokens: maxNewTokens,
    safe: true,
    retries: 10,
  });

  if (!text) throw new Error("Letter generation failed (null)");
  return text;
}
