"use client"

import { useReducer, useState } from "react"
import Link from "next/link"
import { Calendar, Droplets, Loader2, Sparkles, UtensilsCrossed } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { FitnessGoalKey } from "@/lib/fitpal-ai-suggestions"
import { setHydrationGoalMl } from "@/lib/fitpal-hydration"
import { addMealToDay, clearDayNutrition, getMealById } from "@/lib/fitpal-nutrition"
import { addScheduleEntry, clearScheduleForDates, getWeekDayKeys } from "@/lib/fitpal-schedule"
import { formatLocalDay } from "@/lib/fitpal-workouts"
import { cn } from "@/lib/utils"

type PlanKind = "nutrition" | "hydration" | "routine"

type NutritionPreview = {
  kind: "nutrition"
  targetDay: string
  mealIds: string[]
  rationale: string
  model?: string
}

type HydrationPreview = {
  kind: "hydration"
  goalMl: number
  rationale: string
  model?: string
}

type RoutinePreview = {
  kind: "routine"
  /** Same week sent to the API when this preview was built */
  weekDates: string[]
  entries: { date: string; time: string; title: string; workoutId?: string; notes?: string }[]
  rationale: string
  model?: string
}

type Preview = NutritionPreview | HydrationPreview | RoutinePreview

type Props = {
  userId: string
  userName: string
  goalKey: FitnessGoalKey
  groqConfigured: boolean | null
}

export function AiPlanAutomation({ userId, userName, goalKey, groqConfigured }: Props) {
  const [, bump] = useReducer((n: number) => n + 1, 0)
  const weekDates = getWeekDayKeys()

  const [notes, setNotes] = useState("")
  const [nutritionDay, setNutritionDay] = useState(() => formatLocalDay())
  const [replaceNutrition, setReplaceNutrition] = useState(true)
  const [loading, setLoading] = useState<PlanKind | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [preview, setPreview] = useState<Preview | null>(null)
  const [applyMsg, setApplyMsg] = useState<string | null>(null)

  const disabled = groqConfigured === false || groqConfigured === null

  async function generate(kind: PlanKind) {
    setErr(null)
    setApplyMsg(null)
    setLoading(kind)
    try {
      const routineWeek = kind === "routine" ? getWeekDayKeys() : null
      const body: Record<string, unknown> = {
        type: kind,
        goalKey,
        userName,
        notes: notes.trim(),
      }
      if (kind === "nutrition") body.targetDay = nutritionDay
      if (routineWeek) body.weekDates = routineWeek

      const res = await fetch("/api/fitpal-ai/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const data = (await res.json()) as Record<string, unknown>
      if (!res.ok) {
        setErr(typeof data.error === "string" ? data.error : "Plan request failed")
        setPreview(null)
        return
      }
      if (data.kind === "nutrition") {
        setPreview({
          kind: "nutrition",
          targetDay: String(data.targetDay ?? nutritionDay),
          mealIds: Array.isArray(data.mealIds) ? (data.mealIds as string[]) : [],
          rationale: String(data.rationale ?? ""),
          model: typeof data.model === "string" ? data.model : undefined,
        })
      } else if (data.kind === "hydration") {
        setPreview({
          kind: "hydration",
          goalMl: typeof data.goalMl === "number" ? data.goalMl : 2500,
          rationale: String(data.rationale ?? ""),
          model: typeof data.model === "string" ? data.model : undefined,
        })
      } else if (data.kind === "routine" && routineWeek) {
        const entries = Array.isArray(data.entries) ? data.entries : []
        setPreview({
          kind: "routine",
          weekDates: routineWeek,
          entries: entries.filter(
            (e): e is RoutinePreview["entries"][number] =>
              !!e &&
              typeof e === "object" &&
              typeof (e as { date?: string }).date === "string" &&
              typeof (e as { time?: string }).time === "string" &&
              typeof (e as { title?: string }).title === "string",
          ),
          rationale: String(data.rationale ?? ""),
          model: typeof data.model === "string" ? data.model : undefined,
        })
      } else {
        setErr("Unexpected response")
        setPreview(null)
      }
    } catch {
      setErr("Network error")
      setPreview(null)
    } finally {
      setLoading(null)
    }
  }

  function applyPreview() {
    if (!preview) return
    setErr(null)
    setApplyMsg(null)
    try {
      if (preview.kind === "nutrition") {
        if (replaceNutrition) clearDayNutrition(userId, preview.targetDay)
        for (const id of preview.mealIds) {
          addMealToDay(userId, preview.targetDay, id)
        }
        setApplyMsg(`Logged ${preview.mealIds.length} meal(s) for ${preview.targetDay}.`)
      } else if (preview.kind === "hydration") {
        setHydrationGoalMl(userId, preview.goalMl)
        setApplyMsg(`Daily goal set to ${preview.goalMl} ml.`)
      } else {
        clearScheduleForDates(userId, preview.weekDates)
        for (const e of preview.entries) {
          addScheduleEntry(userId, {
            date: e.date,
            time: e.time,
            title: e.title,
            notes: e.notes,
            workoutId: e.workoutId,
          })
        }
        setApplyMsg(`Schedule updated with ${preview.entries.length} session(s) this week.`)
      }
      bump()
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Apply failed")
    }
  }

  return (
    <section id="ai-automations" className="scroll-mt-24 space-y-6 mb-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between border-b border-border pb-5">
        <div className="flex items-start gap-3">
          <Sparkles className="h-5 w-5 shrink-0 text-foreground/35 mt-0.5" strokeWidth={1.5} aria-hidden />
          <div>
            <p className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground mb-1">Automations</p>
            <h2 className="text-lg font-light tracking-tight">Generate plans you can apply</h2>
            <p className="text-[12px] text-muted-foreground mt-1 max-w-xl">
              Groq returns structured JSON from your goal and optional notes. Preview first, then apply to Nutrition,
              Hydration, or this week&apos;s Schedule.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 max-w-xl">
        <Label htmlFor="ai-plan-notes" className="text-[11px] uppercase tracking-wide text-muted-foreground">
          Optional context
        </Label>
        <Textarea
          id="ai-plan-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. vegetarian, train evenings only, 3 gym days…"
          disabled={disabled}
          className="rounded-none min-h-[72px] text-[13px]"
          maxLength={500}
        />
      </div>

      {groqConfigured === null ? (
        <p className="text-sm text-muted-foreground">Checking Groq configuration…</p>
      ) : groqConfigured === false ? (
        <p className="text-sm text-destructive">
          Add <span className="font-mono text-xs">GROQ_API_KEY</span> to use automations.
        </p>
      ) : null}

      <div className="grid gap-5 md:grid-cols-3">
        <Card className="rounded-none border-border">
          <CardHeader className="border-b border-border/70 pb-3">
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="h-4 w-4 text-foreground/40" strokeWidth={1.5} />
              <CardTitle className="text-sm font-light tracking-tight">Nutrition</CardTitle>
            </div>
            <CardDescription className="text-xs">Day log from catalog meals.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase text-muted-foreground">Day</Label>
              <Input
                type="date"
                value={nutritionDay}
                onChange={(e) => setNutritionDay(e.target.value)}
                disabled={disabled}
                className="rounded-none"
              />
            </div>
            <label className="flex items-center gap-2 text-[12px] text-muted-foreground cursor-pointer">
              <Checkbox
                checked={replaceNutrition}
                onCheckedChange={(v) => setReplaceNutrition(v === true)}
                disabled={disabled}
              />
              Replace existing meals that day
            </label>
            <Button
              type="button"
              variant="outline"
              className="rounded-none w-full gap-2"
              disabled={disabled || !!loading}
              onClick={() => void generate("nutrition")}
            >
              {loading === "nutrition" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Generate
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-none border-border">
          <CardHeader className="border-b border-border/70 pb-3">
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-foreground/40" strokeWidth={1.5} />
              <CardTitle className="text-sm font-light tracking-tight">Hydration</CardTitle>
            </div>
            <CardDescription className="text-xs">Daily goal in ml.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <Button
              type="button"
              variant="outline"
              className="rounded-none w-full gap-2"
              disabled={disabled || !!loading}
              onClick={() => void generate("hydration")}
            >
              {loading === "hydration" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Generate
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-none border-border">
          <CardHeader className="border-b border-border/70 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-foreground/40" strokeWidth={1.5} />
              <CardTitle className="text-sm font-light tracking-tight">Routine</CardTitle>
            </div>
            <CardDescription className="text-xs">
              This calendar week ({weekDates[0]} → {weekDates[6]}). Replaces entries on those dates.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <Button
              type="button"
              variant="outline"
              className="rounded-none w-full gap-2"
              disabled={disabled || !!loading}
              onClick={() => void generate("routine")}
            >
              {loading === "routine" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Generate
            </Button>
          </CardContent>
        </Card>
      </div>

      {preview ? (
        <Card className="rounded-none border-border border-foreground/15">
          <CardHeader className="border-b border-border/70 pb-3">
            <CardTitle className="text-sm font-light tracking-tight">Preview</CardTitle>
            {preview.model ? (
              <CardDescription className="text-[10px] font-mono">model: {preview.model}</CardDescription>
            ) : null}
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <p className="text-[13px] text-muted-foreground leading-relaxed whitespace-pre-wrap">{preview.rationale}</p>

            {preview.kind === "nutrition" ? (
              <ul className="border border-border divide-y divide-border text-[13px]">
                {preview.mealIds.map((id) => {
                  const m = getMealById(id)
                  return (
                    <li key={id} className="px-3 py-2 flex justify-between gap-3">
                      <span>{m?.name ?? id}</span>
                      <span className="text-muted-foreground tabular-nums shrink-0">{m?.calories ?? "—"} kcal</span>
                    </li>
                  )
                })}
              </ul>
            ) : null}

            {preview.kind === "hydration" ? (
              <p className="text-2xl font-extralight tabular-nums">
                {preview.goalMl} <span className="text-sm text-muted-foreground">ml / day</span>
              </p>
            ) : null}

            {preview.kind === "routine" ? (
              <ul className="border border-border divide-y divide-border text-[12px] max-h-[280px] overflow-y-auto">
                {preview.entries.map((e, i) => (
                  <li key={`${e.date}-${e.time}-${i}`} className="px-3 py-2 space-y-0.5">
                    <div className="flex justify-between gap-2">
                      <span className="font-medium text-foreground">{e.title}</span>
                      <span className="text-muted-foreground shrink-0 tabular-nums">
                        {e.date} {e.time}
                      </span>
                    </div>
                    {e.workoutId ? (
                      <p className="text-muted-foreground font-mono text-[10px]">workout: {e.workoutId}</p>
                    ) : null}
                    {e.notes ? <p className="text-muted-foreground">{e.notes}</p> : null}
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="flex flex-wrap gap-2">
              <Button type="button" className="rounded-none gap-2" onClick={() => applyPreview()}>
                Apply to FitPal
              </Button>
              <Button type="button" variant="ghost" className="rounded-none" onClick={() => setPreview(null)}>
                Dismiss
              </Button>
            </div>
            {preview.kind === "routine" ? (
              <p className="text-[11px] text-muted-foreground">
                Applying clears all schedule rows on {preview.weekDates.length} days of this week, then adds the
                sessions above.
              </p>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      {err ? (
        <p className="text-sm text-destructive" role="alert">
          {err}
        </p>
      ) : null}
      {applyMsg ? <p className="text-sm text-emerald-800 dark:text-emerald-400">{applyMsg}</p> : null}
    </section>
  )
}

/** Inline CTA used on module pages — links to AI automations. */
export function AiAutomationCta({ label = "Open AI automations" }: { label?: string }) {
  return (
    <p className="text-[12px] text-muted-foreground">
      <Link href="/dashboard/ai#ai-automations" className={cn("underline underline-offset-4 hover:text-foreground")}>
        {label}
      </Link>
    </p>
  )
}
