"use client"

import { useMemo, useReducer } from "react"
import { Droplets } from "lucide-react"

import { AiAutomationCta } from "@/components/dashboard/ai-plan-automation"
import { useDashboardUser } from "@/components/dashboard/dashboard-context"
import { DashboardPageHero } from "@/components/dashboard/dashboard-page-hero"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  DEFAULT_DAILY_GOAL_ML,
  addWaterMl,
  getHydrationGoalMl,
  getWaterMlForDay,
  setHydrationGoalMl,
} from "@/lib/fitpal-hydration"
import { formatLocalDay } from "@/lib/fitpal-workouts"
import { cn } from "@/lib/utils"

const QUICK_ML = [250, 500, 750] as const

export default function HydrationPage() {
  const user = useDashboardUser()
  const [, refresh] = useReducer((n: number) => n + 1, 0)
  const today = formatLocalDay()

  const total = user ? getWaterMlForDay(user.id, today) : 0
  const goal = user ? getHydrationGoalMl(user.id) : DEFAULT_DAILY_GOAL_ML
  const pct = goal > 0 ? Math.min(100, Math.round((total / goal) * 100)) : 0

  const weekPreview = useMemo(() => {
    if (!user) return []
    const rows: { day: string; label: string; ml: number }[] = []
    const ref = new Date()
    for (let i = 6; i >= 0; i -= 1) {
      const d = new Date(ref)
      d.setDate(ref.getDate() - i)
      const day = formatLocalDay(d)
      rows.push({
        day,
        label: day.slice(5),
        ml: getWaterMlForDay(user.id, day),
      })
    }
    return rows
  }, [user, refresh])

  if (!user) return null

  function add(ml: number) {
    addWaterMl(user.id, today, ml)
    refresh()
  }

  function onCustom(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const n = Number.parseInt(String(fd.get("ml")), 10)
    if (!Number.isFinite(n) || n <= 0) return
    addWaterMl(user.id, today, n)
    refresh()
    e.currentTarget.reset()
  }

  function onGoal(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const n = Number.parseInt(String(fd.get("goal")), 10)
    if (!Number.isFinite(n)) return
    setHydrationGoalMl(user.id, n)
    refresh()
  }

  const maxWeek = Math.max(...weekPreview.map((r) => r.ml), goal, 1)

  return (
    <div>
      <DashboardPageHero
        kicker="Hydration"
        title="Stay topped up"
        description={`Water in ml vs your goal (default ${DEFAULT_DAILY_GOAL_ML.toLocaleString()} ml).`}
      />

      <AiAutomationCta label="Set a smart daily goal with AI →" />

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="rounded-none border-border xl:col-span-2">
          <CardHeader className="border-b border-border/80">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center border border-border bg-muted/40">
                <Droplets className="h-5 w-5 text-foreground/80" />
              </div>
              <div>
                <CardTitle className="text-lg font-light tracking-tight">Today</CardTitle>
                <CardDescription>
                  {total.toLocaleString()} ml of {goal.toLocaleString()} ml
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-8 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-[11px] uppercase tracking-wide text-muted-foreground">
                <span>Progress</span>
                <span className="tabular-nums text-foreground">{pct}%</span>
              </div>
              <Progress value={pct} className="h-3 rounded-none bg-secondary" />
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
                Quick add
              </p>
              <div className="flex flex-wrap gap-2">
                {QUICK_ML.map((ml) => (
                  <Button
                    key={ml}
                    type="button"
                    variant="secondary"
                    className="rounded-none tabular-nums"
                    onClick={() => add(ml)}
                  >
                    +{ml} ml
                  </Button>
                ))}
              </div>
            </div>

            <form onSubmit={onCustom} className="flex flex-col sm:flex-row sm:items-end gap-3">
              <div className="space-y-2 flex-1 max-w-[200px]">
                <Label htmlFor="custom-ml">Custom amount (ml)</Label>
                <Input
                  id="custom-ml"
                  name="ml"
                  type="number"
                  min={1}
                  max={2000}
                  placeholder="300"
                  className="rounded-none"
                />
              </div>
              <Button type="submit" className="rounded-none w-full sm:w-auto">
                Add
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="rounded-none border-border">
          <CardHeader>
            <CardTitle className="text-base font-light tracking-tight">Daily goal</CardTitle>
            <CardDescription>Between 500 and 8000 ml.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onGoal} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="goal-ml">Goal (ml)</Label>
                <Input
                  id="goal-ml"
                  name="goal"
                  type="number"
                  min={500}
                  max={8000}
                  step={50}
                  defaultValue={goal}
                  className="rounded-none"
                />
              </div>
              <Button type="submit" variant="outline" className="rounded-none w-full">
                Update goal
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="rounded-none border-border lg:col-span-2 xl:col-span-3">
          <CardHeader>
            <CardTitle className="text-base font-light tracking-tight">Last 7 days</CardTitle>
            <CardDescription>Relative bars — taller means more logged that day.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 md:gap-3 h-36 border border-border px-3 pt-4 pb-2 bg-muted/20">
              {weekPreview.map((r) => {
                const h = Math.round((r.ml / maxWeek) * 100)
                const isToday = r.day === today
                return (
                  <div key={r.day} className="flex-1 flex flex-col items-center gap-2 min-w-0">
                    <div className="w-full flex flex-col justify-end h-28 bg-secondary/50 border border-border/70">
                      <div
                        className={cn(
                          "w-full transition-all",
                          isToday ? "bg-foreground" : "bg-foreground/55",
                        )}
                        style={{ height: `${Math.max(h, 4)}%` }}
                        title={`${r.ml} ml`}
                      />
                    </div>
                    <span
                      className={cn(
                        "text-[9px] uppercase tracking-tight truncate w-full text-center",
                        isToday ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {r.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-10" />
      <p className="text-[11px] text-muted-foreground leading-snug">Per-browser data; clear storage to reset.</p>
    </div>
  )
}
