"use client"

import Link from "next/link"
import { ArrowRight, Dumbbell } from "lucide-react"

import { useDashboardUser } from "@/components/dashboard/dashboard-context"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { formatLocalDay, getWeekSummary } from "@/lib/fitpal-workouts"

export default function DashboardHomePage() {
  const user = useDashboardUser()
  if (!user) return null

  const week = getWeekSummary(user.id)
  const todayKey = formatLocalDay()
  const today = week.days.find((d) => d.day === todayKey) ?? {
    day: todayKey,
    caloriesBurned: 0,
    steps: 0,
  }

  return (
    <div>
      <p className="text-[11px] tracking-[0.3em] uppercase text-muted-foreground mb-3">
        Dashboard
      </p>
      <h1 className="text-3xl md:text-4xl font-extralight tracking-tight text-balance">
        Hello, {user.name}
      </h1>
      <p className="text-sm text-muted-foreground mt-3 max-w-2xl leading-relaxed">
        Daily snapshot and weekly roll-up from your logged workouts and step estimates (demo
        localStorage).
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border mt-12 border border-border">
        <div className="bg-background p-6 md:p-8">
          <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-4">
            Today · Steps
          </p>
          <p className="text-3xl md:text-4xl font-extralight tabular-nums">
            {today.steps.toLocaleString()}
          </p>
        </div>
        <div className="bg-background p-6 md:p-8">
          <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-4">
            Today · Calories burned
          </p>
          <p className="text-3xl md:text-4xl font-extralight tabular-nums">
            {today.caloriesBurned}
          </p>
        </div>
        <div className="bg-background p-6 md:p-8">
          <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-4">
            Week · Calories burned
          </p>
          <p className="text-3xl md:text-4xl font-extralight tabular-nums">
            {week.totalCaloriesBurned}
          </p>
        </div>
        <div className="bg-background p-6 md:p-8">
          <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-4">
            Week · Workouts
          </p>
          <p className="text-3xl md:text-4xl font-extralight tabular-nums">
            {week.workoutsCompleted}
          </p>
        </div>
      </div>

      <div className="mt-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
          <div>
            <p className="text-[11px] tracking-[0.3em] uppercase text-muted-foreground mb-2">
              Last 7 days
            </p>
            <h2 className="text-xl md:text-2xl font-extralight tracking-tight">Weekly rhythm</h2>
          </div>
          <p className="text-xs text-muted-foreground max-w-md leading-relaxed">
            Bars show calories burned from completed sessions per day. Steps combine baseline
            entries and workout-based estimates.
          </p>
        </div>
        <div className="flex items-end gap-2 md:gap-3 h-40 border border-border px-4 pt-4 pb-2 bg-card/40">
          {week.days.map((d) => {
            const max = Math.max(...week.days.map((x) => x.caloriesBurned), 1)
            const h = Math.round((d.caloriesBurned / max) * 100)
            const isToday = d.day === todayKey
            return (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2 min-w-0">
                <div className="w-full flex flex-col justify-end h-28 bg-secondary/40 border border-border/60">
                  <div
                    className={`w-full transition-all ${isToday ? "bg-foreground" : "bg-foreground/70"}`}
                    style={{ height: `${Math.max(h, 4)}%` }}
                    title={`${d.caloriesBurned} kcal`}
                  />
                </div>
                <span
                  className={`text-[10px] uppercase tracking-tight truncate w-full text-center ${
                    isToday ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {d.day.slice(5)}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <Separator className="my-14" />

      <div>
        <p className="text-[11px] tracking-[0.3em] uppercase text-muted-foreground mb-4">
          Quick actions
        </p>
        <div className="flex flex-col sm:flex-row flex-wrap gap-3">
          <Button asChild className="rounded-none gap-2">
            <Link href="/dashboard/workouts">
              <Dumbbell className="h-4 w-4" />
              Start a workout
              <ArrowRight className="h-4 w-4 opacity-60" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-none">
            <Link href="/dashboard/hydration">Log hydration</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-none">
            <Link href="/dashboard/nutrition">Nutrition</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
