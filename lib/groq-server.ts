/**
 * Server-only Groq helpers. Import only from Route Handlers or Server Actions.
 * Default model: Llama 3.1 8B Instant (cheap / fast on Groq).
 */

export const DEFAULT_GROQ_MODEL = "llama-3.1-8b-instant"

const GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions"

function normalizeApiKey(raw: string | undefined): string | null {
  if (raw == null) return null
  let k = raw.trim()
  if ((k.startsWith('"') && k.endsWith('"')) || (k.startsWith("'") && k.endsWith("'"))) {
    k = k.slice(1, -1).trim()
  }
  return k || null
}

export function getGroqApiKey(): string | null {
  return normalizeApiKey(process.env.GROQ_API_KEY)
}

export function getGroqModel(): string {
  const m = process.env.GROQ_MODEL?.trim()
  return m || DEFAULT_GROQ_MODEL
}

export type GroqMessage = { role: "system" | "user" | "assistant"; content: string }

export async function groqChat(
  messages: GroqMessage[],
  options?: { jsonObject?: boolean; temperature?: number; maxTokens?: number },
): Promise<string> {
  const key = getGroqApiKey()
  if (!key) {
    throw new Error("GROQ_API_KEY is not set")
  }
  const model = getGroqModel()

  const payload: Record<string, unknown> = {
    model,
    messages,
    max_tokens: options?.maxTokens ?? 1024,
    temperature: options?.temperature ?? 0.55,
  }
  if (options?.jsonObject) {
    payload.response_format = { type: "json_object" }
  }

  const res = await fetch(GROQ_CHAT_URL, {
    method: "POST",
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  const raw = await res.text()
  let data: {
    choices?: { message?: { content?: string | null } }[]
    error?: { message?: string }
  }

  try {
    data = JSON.parse(raw) as typeof data
  } catch {
    throw new Error(
      res.ok
        ? "Invalid JSON from Groq"
        : `Groq HTTP ${res.status}: ${raw.slice(0, 280)}`,
    )
  }

  if (!res.ok) {
    const msg = data?.error?.message ?? `Groq error ${res.status}: ${raw.slice(0, 200)}`
    throw new Error(msg)
  }

  const text = data.choices?.[0]?.message?.content?.trim()
  if (!text) {
    throw new Error("Empty response from Groq")
  }
  return text
}
