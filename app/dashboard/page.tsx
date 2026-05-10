"use client"

import Link from "next/link"
import { Apple, ArrowRight, Droplets, Dumbbell, Flame, Footprints, LayoutList, Scale } from "lucide-react"

import { DashboardAnalyticsCharts } from "@/components/dashboard/dashboard-analytics-charts"
import { useDashboardUser } from "@/components/dashboard/dashboard-context"
import { DashboardPageHero } from "@/components/dashboard/dashboard-page-hero"
import { Separator } from "@/components/ui/separator"
import { getHydrationGoalMl, getWaterMlForDay } from "@/lib/fitpal-hydration"
import { getLatestWeightKg } from "@/lib/fitpal-progress-weight"
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

  const weight = getLatestWeightKg(user.id)
  const hydration = getWaterMlForDay(user.id, todayKey)
  const hydrationGoal = getHydrationGoalMl(user.id)


  return (
    <div>
      <DashboardPageHero
        priority
        kicker="Overview"
        title="This week"
        description="Today and weekly totals below; charts follow what you log."
      />

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-px bg-border border border-border">
        <div className="bg-background p-5 md:p-7 relative group transition-colors hover:bg-amber-50/30">
          <Footprints
            className="absolute right-4 top-4 h-5 w-5 text-amber-500/20 group-hover:text-amber-500/40 transition-colors"
            strokeWidth={1.5}
            aria-hidden
          />
          <p className="text-[11px] tracking-[0.2em] uppercase text-amber-700/70 mb-3 font-medium">
            Steps
          </p>
          <p className="text-2xl md:text-4xl font-light tabular-nums tracking-tight text-amber-900">
            {today.steps.toLocaleString()}
          </p>
          <div className="mt-4 h-1.5 bg-amber-100 overflow-hidden rounded-full">
            <div
              className="h-full bg-amber-500 transition-all duration-1000"
              style={{
                width: `${Math.min(100, Math.round((today.steps / 12000) * 100))}%`,
              }}
            />
          </div>
          <p className="text-[10px] text-amber-700/60 mt-2 uppercase tracking-wide font-medium">
            {Math.round((today.steps / 12000) * 100)}% of goal
          </p>
        </div>


        <div className="bg-background p-5 md:p-7 relative group transition-colors hover:bg-orange-50/30">
          <Flame
            className="absolute right-4 top-4 h-5 w-5 text-orange-500/20 group-hover:text-orange-500/40 transition-colors"
            strokeWidth={1.5}
            aria-hidden
          />
          <p className="text-[11px] tracking-[0.2em] uppercase text-orange-700/70 mb-3 font-medium">
            Energy
          </p>
          <p className="text-2xl md:text-4xl font-light tabular-nums tracking-tight text-orange-900">
            {today.caloriesBurned}
            <span className="text-sm text-orange-600/60 ml-1 font-normal tracking-normal">kcal</span>
          </p>
          <div className="mt-4 h-1.5 bg-orange-100 overflow-hidden rounded-full">
            <div
              className="h-full bg-orange-500 transition-all duration-1000"
              style={{
                width: `${Math.min(100, Math.round((today.caloriesBurned / 600) * 100))}%`,
              }}
            />
          </div>
          <p className="text-[10px] text-orange-700/60 mt-2 uppercase tracking-wide font-medium">
            Active burn
          </p>
        </div>


        <div className="bg-background p-5 md:p-7 relative group transition-colors hover:bg-sky-50/30">
          <Droplets
            className="absolute right-4 top-4 h-5 w-5 text-sky-500/20 group-hover:text-sky-500/40 transition-colors"
            strokeWidth={1.5}
            aria-hidden
          />
          <p className="text-[11px] tracking-[0.2em] uppercase text-sky-700/70 mb-3 font-medium">
            Hydration
          </p>
          <p className="text-2xl md:text-4xl font-light tabular-nums tracking-tight text-sky-900">
            {(hydration / 1000).toFixed(1)}
            <span className="text-sm text-sky-600/60 ml-1 font-normal tracking-normal">L</span>
          </p>
          <div className="mt-4 h-1.5 bg-sky-100 overflow-hidden rounded-full">
            <div
              className="h-full bg-sky-500 transition-all duration-1000"
              style={{
                width: `${Math.min(100, Math.round((hydration / hydrationGoal) * 100))}%`,
              }}
            />
          </div>
          <p className="text-[10px] text-sky-700/60 mt-2 uppercase tracking-wide font-medium">
            Goal: {(hydrationGoal / 1000).toFixed(1)}L
          </p>
        </div>


        <div className="bg-background p-5 md:p-7 relative group transition-colors hover:bg-indigo-50/30">
          <Scale
            className="absolute right-4 top-4 h-5 w-5 text-indigo-500/20 group-hover:text-indigo-500/40 transition-colors"
            strokeWidth={1.5}
            aria-hidden
          />
          <p className="text-[11px] tracking-[0.2em] uppercase text-indigo-700/70 mb-3 font-medium">
            Weight
          </p>
          <p className="text-2xl md:text-4xl font-light tabular-nums tracking-tight text-indigo-900">
            {weight ?? "—"}
            {weight && <span className="text-sm text-indigo-600/60 ml-1 font-normal tracking-normal">kg</span>}
          </p>
          <p className="text-[10px] text-indigo-700/60 mt-4 uppercase tracking-wide font-medium">
            {weight ? "Latest entry" : "No data"}
          </p>
        </div>


        <div className="bg-background p-5 md:p-7 relative group transition-colors hover:bg-emerald-50/30">
          <LayoutList
            className="absolute right-4 top-4 h-5 w-5 text-emerald-500/20 group-hover:text-emerald-500/40 transition-colors"
            strokeWidth={1.5}
            aria-hidden
          />
          <p className="text-[11px] tracking-[0.2em] uppercase text-emerald-700/70 mb-3 font-medium">
            Weekly
          </p>
          <p className="text-2xl md:text-4xl font-light tabular-nums tracking-tight text-emerald-900">
            {week.totalCaloriesBurned}
          </p>
          <p className="text-[10px] text-emerald-700/60 mt-4 uppercase tracking-wide font-medium">
            Total kcal
          </p>
        </div>


        <div className="bg-background p-5 md:p-7 relative group transition-colors hover:bg-violet-50/30">
          <Dumbbell
            className="absolute right-4 top-4 h-5 w-5 text-violet-500/20 group-hover:text-violet-500/40 transition-colors"
            strokeWidth={1.5}
            aria-hidden
          />
          <p className="text-[11px] tracking-[0.2em] uppercase text-violet-700/70 mb-3 font-medium">
            Sessions
          </p>
          <p className="text-2xl md:text-4xl font-light tabular-nums tracking-tight text-violet-900">
            {week.workoutsCompleted}
          </p>
          <p className="text-[10px] text-violet-700/60 mt-4 uppercase tracking-wide font-medium">
            This week
          </p>
        </div>

      </div>



      <div className="mt-10">
        <DashboardAnalyticsCharts userId={user.id} />
      </div>

      <Separator className="my-14" />

      <div>
        <p className="text-[10px] tracking-[0.28em] uppercase text-muted-foreground mb-3">
          Quick actions
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/dashboard/workouts"
            className="group flex items-center gap-3 border border-border bg-background px-4 py-3.5 transition-colors hover:bg-secondary/60"
          >
            <span className="flex h-9 w-9 items-center justify-center border border-border bg-secondary/50 text-foreground/80">
              <Dumbbell className="h-4 w-4" strokeWidth={1.5} />
            </span>
            <span className="flex-1 text-sm font-light tracking-tight">Workouts</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-50 group-hover:opacity-80" />
          </Link>
          <Link
            href="/dashboard/hydration"
            className="group flex items-center gap-3 border border-border bg-background px-4 py-3.5 transition-colors hover:bg-secondary/60"
          >
            <span className="flex h-9 w-9 items-center justify-center border border-border bg-secondary/50 text-foreground/80">
              <Droplets className="h-4 w-4" strokeWidth={1.5} />
            </span>
            <span className="flex-1 text-sm font-light tracking-tight">Hydration</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-50 group-hover:opacity-80" />
          </Link>
          <Link
            href="/dashboard/nutrition"
            className="group flex items-center gap-3 border border-border bg-background px-4 py-3.5 transition-colors hover:bg-secondary/60"
          >
            <span className="flex h-9 w-9 items-center justify-center border border-border bg-secondary/50 text-foreground/80">
              <Apple className="h-4 w-4" strokeWidth={1.5} />
            </span>
            <span className="flex-1 text-sm font-light tracking-tight">Nutrition</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-50 group-hover:opacity-80" />
          </Link>
        </div>
      </div>
    </div>
  )
}
