import { NextResponse } from "next/server"

import { FITNESS_GOAL_LABEL, type FitnessGoalKey } from "@/lib/fitpal-ai-suggestions"
import { getGroqApiKey, getGroqModel, groqChat, type GroqMessage } from "@/lib/groq-server"

export const dynamic = "force-dynamic"

const VALID_GOALS: FitnessGoalKey[] = ["weight_loss", "muscle_gain", "maintain"]

function parseGoalKey(raw: unknown): FitnessGoalKey {
  if (typeof raw !== "string") return "maintain"
  return VALID_GOALS.includes(raw as FitnessGoalKey) ? (raw as FitnessGoalKey) : "maintain"
}

type ClientMsg = { role: string; content: unknown }

function buildHistory(body: Record<string, unknown>): GroqMessage[] {
  const raw = body.messages
  if (!Array.isArray(raw) || raw.length === 0) {
    return []
  }

  const out: GroqMessage[] = []
  for (const item of raw.slice(-24)) {
    if (!item || typeof item !== "object") continue
    const m = item as ClientMsg
    const role = m.role
    const content = String(m.content ?? "").trim().slice(0, 8000)
    if (!content) continue
    if (role === "user" || role === "assistant") {
      out.push({ role, content })
    }
  }

  if (out.length === 0) {
    throw new Error("No valid messages")
  }
  if (out[out.length - 1]!.role !== "user") {
    throw new Error("Last message must be from the user")
  }
  return out
}

export async function GET() {
  const key = getGroqApiKey()
  return NextResponse.json({
    configured: Boolean(key),
    model: getGroqModel(),
  })
}

export async function POST(req: Request) {
  if (!getGroqApiKey()) {
    return NextResponse.json(
      {
        error:
          "Groq is not configured. Add GROQ_API_KEY to .env.local (copy from .env.example) and restart `npm run dev`.",
      },
      { status: 503 },
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const b = body as Record<string, unknown>
  const goalKey = parseGoalKey(b.goalKey)
  const goalLabel = FITNESS_GOAL_LABEL[goalKey]

  let history: GroqMessage[]
  try {
    history = buildHistory(b)
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Invalid messages"
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  const userProfile =
    typeof b.userName === "string"
      ? b.userName.trim().slice(0, 80)
      : undefined

  const system = `You are FitPal's in-app fitness assistant (demo). Be concise and practical.
User goal: ${goalLabel}.${userProfile ? ` Address them as "${userProfile}" when natural.` : ""}
Give short paragraphs or bullet lines with "- " when listing. No medical diagnosis or prescriptions.
If asked something off-topic, answer briefly then steer back to fitness, recovery, or nutrition.`

  try {
    const text = await groqChat([{ role: "system", content: system }, ...history])
    return NextResponse.json({
      text,
      model: getGroqModel(),
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : "Groq request failed"
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
