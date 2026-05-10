import { NextResponse } from "next/server"

import { FITNESS_GOAL_LABEL, type FitnessGoalKey } from "@/lib/fitpal-ai-suggestions"
import { getGroqApiKey, getGroqModel, groqChat } from "@/lib/groq-server"
import { db } from "@/lib/db"


export const dynamic = "force-dynamic"

const VALID_GOALS: FitnessGoalKey[] = ["weight_loss", "muscle_gain", "maintain"]

function parseGoalKey(raw: unknown): FitnessGoalKey {
  if (typeof raw !== "string") return "maintain"
  return VALID_GOALS.includes(raw as FitnessGoalKey) ? (raw as FitnessGoalKey) : "maintain"
}

function parseJsonFromModel(text: string): unknown {
  let t = text.trim()
  const fence = /^```(?:json)?\s*([\s\S]*?)\s*```$/m.exec(t)
  if (fence) t = fence[1]!.trim()
  return JSON.parse(t) as unknown
}

function mealCatalogLines() {
  return db.nutrition.getMeals().map((m) => `${m.id}|${m.type}|${m.name}|${m.calories}kcal`).join("\n")
}


function workoutCatalogLines() {
  return db.workouts.getAll().map((w) => `${w.id}|${w.category}|${w.name}`).join("\n")
}


export async function POST(req: Request) {
  if (!getGroqApiKey()) {
    return NextResponse.json(
      {
        error:
          "Groq is not configured. Add GROQ_API_KEY to .env.local and restart the dev server.",
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
  const type = typeof b.type === "string" ? b.type : ""
  const goalKey = parseGoalKey(b.goalKey)
  const goalLabel = FITNESS_GOAL_LABEL[goalKey]
  const notes = typeof b.notes === "string" ? b.notes.trim().slice(0, 500) : ""
  const userName = typeof b.userName === "string" ? b.userName.trim().slice(0, 80) : ""

  try {
    if (type === "nutrition") {
      const targetDay =
        typeof b.targetDay === "string" && /^\d{4}-\d{2}-\d{2}$/.test(b.targetDay)
          ? b.targetDay
          : null
      if (!targetDay) {
        return NextResponse.json({ error: "targetDay (YYYY-MM-DD) is required" }, { status: 400 })
      }

      const system = `You output ONLY a single JSON object (no markdown, no prose).
Schema: {"mealIds": string[], "rationale": string}
Rules:
- Pick 4 to 7 meal IDs from the catalog below only. Never invent IDs.
- Include at least one breakfast-type meal.
- Align with user goal: weight_loss = slightly lower total calories where possible; muscle_gain = favor protein-dense meals; maintain = balanced spread.
- mealIds order roughly follows breakfast → lunch → dinner → snacks.
Catalog lines are id|type|name|calories:
${mealCatalogLines()}`

      const user = `Goal: ${goalLabel}.${userName ? ` User: ${userName}.` : ""}${notes ? ` Notes: ${notes}` : ""}
Target calendar day for this plan (context only): ${targetDay}`

      const raw = await groqChat(
        [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        { jsonObject: true, temperature: 0.35, maxTokens: 700 },
      )

      const parsed = parseJsonFromModel(raw) as { mealIds?: unknown; rationale?: unknown }
      const mealIds = Array.isArray(parsed.mealIds)
        ? parsed.mealIds.filter((x): x is string => typeof x === "string")
        : []
      const allowed = new Set(db.nutrition.getMeals().map((m) => m.id))
      const filtered = mealIds.filter((id) => allowed.has(id)).slice(0, 10)

      if (filtered.length === 0) {
        return NextResponse.json({ error: "Model returned no valid meal IDs" }, { status: 502 })
      }
      const rationale =
        typeof parsed.rationale === "string" ? parsed.rationale.slice(0, 600) : "Planned meals from catalog."

      return NextResponse.json({
        kind: "nutrition" as const,
        targetDay,
        mealIds: filtered,
        rationale,
        model: getGroqModel(),
      })
    }

    if (type === "hydration") {
      const system = `You output ONLY a single JSON object (no markdown, no prose).
Schema: {"goalMl": number, "rationale": string}
Rules:
- goalMl must be an integer between 2000 and 4500 (typical daily water targets in ml).
- weight_loss: lean toward 2200–2800 unless notes say very active.
- muscle_gain / heavy training: 2800–3800.
- maintain: 2400–3200.
- Use notes and goal to pick one number.`

      const user = `Goal: ${goalLabel}.${userName ? ` User: ${userName}.` : ""}${notes ? ` Notes: ${notes}` : ""}`

      const raw = await groqChat(
        [{ role: "system", content: system }, { role: "user", content: user }],
        { jsonObject: true, temperature: 0.25, maxTokens: 400 },
      )

      const parsed = parseJsonFromModel(raw) as { goalMl?: unknown; rationale?: unknown }
      let goalMl = typeof parsed.goalMl === "number" ? Math.round(parsed.goalMl) : 2500
      goalMl = Math.max(2000, Math.min(4500, goalMl))
      const rationale =
        typeof parsed.rationale === "string" ? parsed.rationale.slice(0, 600) : "Daily hydration target."

      return NextResponse.json({
        kind: "hydration" as const,
        goalMl,
        rationale,
        model: getGroqModel(),
      })
    }

    if (type === "routine") {
      const weekDates = Array.isArray(b.weekDates)
        ? b.weekDates.filter((x): x is string => typeof x === "string" && /^\d{4}-\d{2}-\d{2}$/.test(x))
        : []
      if (weekDates.length < 5) {
        return NextResponse.json(
          { error: "weekDates must be an array of at least 5 YYYY-MM-DD strings (send the current week from the client)." },
          { status: 400 },
        )
      }

      const system = `You output ONLY a single JSON object (no markdown, no prose).
Schema: {"entries": Array<{"date": string, "time": string, "title": string, "workoutId"?: string | null, "notes"?: string}>, "rationale": string}
Rules:
- 6 to 14 entries total, spread across the allowed dates only.
- "date" must be one of the allowed ISO dates exactly.
- "time" must be "HH:MM" 24h (zero-padded hour optional but prefer 07:30 style).
- "title" short training label in English.
- "workoutId" optional: if set, must be one of the workout catalog ids below; otherwise omit or null.
- Mix cardio and strength across the week unless notes say otherwise.
Allowed dates (use only these):
${weekDates.join(", ")}
Workout catalog (id|category|name):
${workoutCatalogLines()}`

      const user = `Goal: ${goalLabel}.${userName ? ` User: ${userName}.` : ""}${notes ? ` Notes: ${notes}` : ""}
Build a simple weekly training outline (not medical advice).`

      const raw = await groqChat(
        [{ role: "system", content: system }, { role: "user", content: user }],
        { jsonObject: true, temperature: 0.4, maxTokens: 1200 },
      )

      const parsed = parseJsonFromModel(raw) as {
        entries?: unknown
        rationale?: unknown
      }
      const allowedDates = new Set(weekDates)
      const allowedWorkouts = new Set(db.workouts.getAll().map((w) => w.id))

      const rawEntries = Array.isArray(parsed.entries) ? parsed.entries : []
      const entries: {
        date: string
        time: string
        title: string
        workoutId?: string
        notes?: string
      }[] = []

      for (const item of rawEntries) {
        if (!item || typeof item !== "object") continue
        const e = item as Record<string, unknown>
        const date = typeof e.date === "string" ? e.date : ""
        const time = typeof e.time === "string" ? e.time : ""
        const title = typeof e.title === "string" ? e.title.trim() : ""
        if (!allowedDates.has(date) || !title) continue
        const workoutId =
          typeof e.workoutId === "string" && allowedWorkouts.has(e.workoutId) ? e.workoutId : undefined
        const notes = typeof e.notes === "string" ? e.notes.trim().slice(0, 200) : undefined
        entries.push({
          date,
          time: time || "09:00",
          title: title.slice(0, 120),
          workoutId,
          notes: notes || undefined,
        })
        if (entries.length >= 16) break
      }

      if (entries.length === 0) {
        return NextResponse.json({ error: "Model returned no valid schedule entries" }, { status: 502 })
      }

      const rationale =
        typeof parsed.rationale === "string" ? parsed.rationale.slice(0, 700) : "Weekly outline from catalog."

      return NextResponse.json({
        kind: "routine" as const,
        entries,
        rationale,
        model: getGroqModel(),
      })
    }

    return NextResponse.json(
      { error: "Unknown type. Use nutrition, hydration, or routine." },
      { status: 400 },
    )
  } catch (e) {
    const message = e instanceof Error ? e.message : "Plan generation failed"
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
