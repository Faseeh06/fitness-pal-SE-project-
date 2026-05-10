import { NextResponse } from "next/server"
import { db } from "@/lib/db"
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

  const system = `You are FitPal's in-app fitness assistant (demo). Be concise, encouraging, and practical.
User goal: ${goalLabel}.${userProfile ? ` Address them as "${userProfile}" when natural.` : ""}

### CAPABILITIES:
You can perform actions on behalf of the user. When a user asks to log food, log a workout, schedule something, update weight, or log water, you MUST respond with your normal helpful message AND append a JSON action block.

### ACTION FORMAT:
Append exactly one block at the end of your response using this format:
ACTION_START
{
  "actions": [
    { "type": "ADD_MEAL", "mealId": "..." },
    { "type": "ADD_WORKOUT", "workoutId": "...", "duration": 30, "calories": 200 },
    { "type": "SCHEDULE_WORKOUT", "workoutId": "...", "date": "YYYY-MM-DD", "time": "HH:MM" },
    { "type": "UPDATE_WEIGHT", "weight": 75.5 },
    { "type": "ADD_HYDRATION", "amountMl": 250 }
  ]
}
ACTION_END

### CATALOG CONTEXT (FOR INTERNAL USE ONLY):
DO NOT repeat the raw catalog strings (e.g. "id|name|type") to the user. Use them to pick the right IDs for your action block.

WORKOUTS:
${db.workouts.getAll().map(w => `${w.id}|${w.name}|${w.category}|${w.defaultDurationMinutes}min|${w.defaultCaloriesBurned}kcal`).join("\n")}

MEALS:
${db.nutrition.getMeals().map(m => `${m.id}|${m.name}|${m.type}|${m.calories}kcal`).join("\n")}

### RULES:
- If logging a meal or workout, only use IDs from the catalogs above.
- If the user's request is vague (e.g., "I ate an apple"), pick the closest catalog item or ask for clarification.
- You can combine multiple actions in one block.
- For scheduling, use YYYY-MM-DD format (today is ${new Date().toISOString().split('T')[0]}).
- **Presentation**: Be conversational. When suggesting a workout or meal, use its name, not its ID or raw data.
- **Actions**: When you perform an action (like logging weight or scheduling), inform the user that you've done so in a friendly way.
- DO NOT show the JSON block to the user; keep it hidden at the very end of your response.`



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
