"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { CheckCircle2, Flame, ListChecks, Timer } from "lucide-react"

import { useDashboardUser } from "@/components/dashboard/dashboard-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { dashboardBleedX } from "@/lib/dashboard-layout"
import { addWorkoutSession, getWorkoutById } from "@/lib/fitpal-workouts"
import { cn } from "@/lib/utils"

const focusBullets: Record<string, string[]> = {
  "run-easy": [
    "Ease into pace — nasal breathing if you can.",
    "Finish feeling like you could add five more minutes.",
    "Note perceived effort for future comparisons.",
  ],
  "hiit-core": [
    "Warm joints before the first hard interval.",
    "Keep transitions crisp — walk-down recoveries are fine.",
    "Stop early if form slips; quality beats volume.",
  ],
  "row-steady": [
    "Legs drive first, arms finish quietly.",
    "Hold a steady stroke rate you can repeat.",
    "Track split drift across the middle third.",
  ],
  "upper-push": [
    "Brace midline before each press.",
    "Control the lowering phase for two to three counts.",
    "Stop two reps shy of failure on working sets.",
  ],
  "lower-compound": [
    "Root feet — knees track over toes.",
    "Maintain spine neutrality on hinges.",
    "Rest enough between heavy compound sets.",
  ],
  "full-body": [
    "Alternate push and pull so local fatigue stays manageable.",
    "Use one compound \"anchor\" lift first.",
    "Keep transitions under ninety seconds unless noted.",
  ],
}

export default function WorkoutDetailPage() {
  const params = useParams()
  const router = useRouter()
  const user = useDashboardUser()
  const id = typeof params.id === "string" ? params.id : params.id?.[0] ?? ""

  const workout = useMemo(() => getWorkoutById(id), [id])
  const [duration, setDuration] = useState(30)
  const [calories, setCalories] = useState(200)
  const [started, setStarted] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!workout) return
    setDuration(workout.defaultDurationMinutes)
    setCalories(workout.defaultCaloriesBurned)
    setStarted(false)
    setSaved(false)
  }, [workout])

  if (!user) return null

  if (!workout) {
    return (
      <div>
        <h1 className="text-2xl font-light tracking-tight mb-4">Workout not found</h1>
        <Button asChild variant="outline" className="rounded-none">
          <Link href="/dashboard/workouts">Back to workouts</Link>
        </Button>
      </div>
    )
  }

  function handleStart() {
    setStarted(true)
    setSaved(false)
  }

  function handleComplete(e: React.FormEvent) {
    e.preventDefault()
    addWorkoutSession(user.id, {
      workoutId: workout.id,
      durationMinutes: duration,
      caloriesBurned: calories,
    })
    setSaved(true)
    router.refresh()
  }

  const bullets = focusBullets[workout.id] ?? [
    "Warm up for five to eight minutes.",
    "Stay hydrated — sip between rounds.",
    "Finish with a short cooldown walk or easy spin.",
  ]

  return (
    <div>
      <section
        className={cn(
          "relative overflow-hidden border border-border bg-muted/20 mb-10 md:mb-12",
          dashboardBleedX,
        )}
      >
        <div className="relative aspect-[21/10] md:aspect-[24/9] max-h-[380px] min-h-[220px]">
          <img
            src={workout.imageUrl}
            alt=""
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/88 to-background/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
          <div className="relative z-10 flex h-full flex-col justify-end p-8 md:p-12 max-w-3xl">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge
                variant="outline"
                className="rounded-none text-[10px] uppercase tracking-[0.2em] bg-background/80 backdrop-blur-sm"
              >
                {workout.category}
              </Badge>
              <span className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
                Session blueprint
              </span>
            </div>
            <h1 className="text-3xl md:text-[2.85rem] font-extralight tracking-tight text-balance">
              {workout.name}
            </h1>
            <p className="text-sm md:text-base text-muted-foreground mt-4 leading-relaxed max-w-2xl">
              {workout.description}
            </p>
            <div className="flex flex-wrap gap-6 mt-8 text-sm">
              <span className="inline-flex items-center gap-2 text-foreground/90">
                <Timer className="h-4 w-4 opacity-70" />
                <span className="tabular-nums">{workout.defaultDurationMinutes} min target</span>
              </span>
              <span className="inline-flex items-center gap-2 text-foreground/90">
                <Flame className="h-4 w-4 opacity-70" />
                <span className="tabular-nums">~{workout.defaultCaloriesBurned} kcal guide</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="grid gap-10">
          <div className="grid md:grid-cols-2 gap-5">
            <div className="relative overflow-hidden border border-border min-h-[200px]">
              <img
                src={workout.imageUrl}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-[0.35] grayscale"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-background via-background/92 to-background/70" />
              <div className="relative z-10 p-7 md:p-8 flex flex-col justify-between min-h-[200px]">
                <div>
                  <p className="text-[11px] tracking-[0.25em] uppercase text-muted-foreground mb-3">
                    Focus
                  </p>
                  <p className="text-lg font-light tracking-tight leading-snug">
                    Technical checkpoints for this template — adjust to how you feel today.
                  </p>
                </div>
                <ul className="mt-8 space-y-3">
                  {bullets.map((line) => (
                    <li key={line} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                      <ListChecks className="h-4 w-4 shrink-0 mt-0.5 text-foreground/70" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="relative border border-border overflow-hidden min-h-[200px]">
              <img
                src={
                  workout.category === "cardio"
                    ? "https://images.unsplash.com/photo-1594882645126-14020914d58d?auto=format&fit=crop&w=900&q=82"
                    : "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=900&q=82"
                }
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-transparent" />
              <div className="relative z-10 h-full flex flex-col justify-end p-7 md:p-8">
                <p className="text-[11px] tracking-[0.25em] uppercase text-muted-foreground mb-2">
                  Visual cue
                </p>
                <p className="text-sm text-foreground/95 leading-relaxed max-w-xs">
                  {workout.category === "cardio"
                    ? "Rhythm and breath drive sustainable cardio — chase smooth outputs, not spikes."
                    : "Bracing and joint stacking matter — film one set if you train solo."}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex flex-wrap gap-3">
            <Button asChild variant="ghost" className="rounded-none px-0 text-muted-foreground hover:text-foreground">
              <Link href="/dashboard/workouts">← All workouts</Link>
            </Button>
          </div>
        </div>

        <Card className="rounded-none border-border shadow-none lg:sticky lg:top-8">
          <CardHeader className="pb-4 border-b border-border bg-card/60">
            <CardTitle className="text-lg font-light tracking-tight">Log session</CardTitle>
            <CardDescription>
              Start when you begin moving, then tune numbers before saving — charts update from the
              totals you confirm.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8 space-y-8">
            {!started ? (
              <div className="space-y-5">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Ready? Hit start to reveal the logging fields. Nothing is saved until you submit.
                </p>
                <Button type="button" className="rounded-none w-full" size="lg" onClick={handleStart}>
                  Start workout
                </Button>
              </div>
            ) : (
              <form onSubmit={handleComplete} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min={1}
                    className="rounded-none"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="calories">Calories burned (estimate)</Label>
                  <Input
                    id="calories"
                    type="number"
                    min={0}
                    className="rounded-none"
                    value={calories}
                    onChange={(e) => setCalories(Number(e.target.value))}
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <Button type="submit" className="rounded-none w-full gap-2" size="lg">
                    <CheckCircle2 className="h-4 w-4" />
                    Mark as completed
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-none w-full"
                    onClick={() => setStarted(false)}
                  >
                    Cancel session
                  </Button>
                </div>
                {saved ? (
                  <p className="text-sm text-foreground bg-secondary border border-border px-3 py-3 flex gap-2 items-start">
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>
                      Saved to history — open <Link href="/dashboard" className="underline underline-offset-4">Overview</Link>{" "}
                      to see refreshed charts.
                    </span>
                  </p>
                ) : null}
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
