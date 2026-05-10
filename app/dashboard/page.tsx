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

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-10">

        <div className="bg-transparent p-5 md:p-7 relative group transition-all hover:bg-secondary/40 border-none">
          <Footprints
            className="absolute right-4 top-4 h-6 w-6 text-amber-500/30 group-hover:text-amber-500/50 transition-colors"
            strokeWidth={1.5}
            aria-hidden
          />
          <p className="text-[12px] tracking-[0.2em] uppercase text-amber-600/80 mb-3 font-normal">
            Steps
          </p>
          <p className="text-3xl md:text-5xl font-extralight tabular-nums tracking-tighter text-amber-500 dark:text-amber-400">
            {today.steps.toLocaleString()}
          </p>
          <div className="mt-4 h-2 bg-amber-500/20 overflow-hidden rounded-full">
            <div
              className="h-full bg-amber-500 transition-all duration-1000 shadow-[0_0_8px_rgba(245,158,11,0.4)]"
              style={{
                width: `${Math.min(100, Math.round((today.steps / 12000) * 100))}%`,
              }}
            />
          </div>
          <p className="text-[11px] text-amber-600/70 mt-2 uppercase tracking-wide font-normal">
            {Math.round((today.steps / 12000) * 100)}% of goal
          </p>
        </div>






        <div className="bg-transparent p-5 md:p-7 relative group transition-all hover:bg-secondary/40 border-none">
          <Flame
            className="absolute right-4 top-4 h-6 w-6 text-orange-500/30 group-hover:text-orange-500/50 transition-colors"
            strokeWidth={1.5}
            aria-hidden
          />
          <p className="text-[12px] tracking-[0.2em] uppercase text-orange-600/80 mb-3 font-normal">
            Energy
          </p>
          <p className="text-3xl md:text-5xl font-extralight tabular-nums tracking-tighter text-orange-500 dark:text-orange-400">
            {today.caloriesBurned}
            <span className="text-sm text-orange-400/60 ml-1 font-normal tracking-normal">kcal</span>
          </p>
          <div className="mt-4 h-2 bg-orange-500/20 overflow-hidden rounded-full">
            <div
              className="h-full bg-orange-500 transition-all duration-1000 shadow-[0_0_8px_rgba(249,115,22,0.4)]"
              style={{
                width: `${Math.min(100, Math.round((today.caloriesBurned / 600) * 100))}%`,
              }}
            />
          </div>
          <p className="text-[11px] text-orange-600/70 mt-2 uppercase tracking-wide font-normal">
            Active burn
          </p>
        </div>






        <div className="bg-transparent p-5 md:p-7 relative group transition-all hover:bg-secondary/40 border-none">
          <Droplets
            className="absolute right-4 top-4 h-6 w-6 text-sky-500/30 group-hover:text-sky-500/50 transition-colors"
            strokeWidth={1.5}
            aria-hidden
          />
          <p className="text-[12px] tracking-[0.2em] uppercase text-sky-600/80 mb-3 font-normal">
            Hydration
          </p>
          <p className="text-3xl md:text-5xl font-extralight tabular-nums tracking-tighter text-sky-500 dark:text-sky-400">
            {(hydration / 1000).toFixed(1)}
            <span className="text-sm text-sky-400/60 ml-1 font-normal tracking-normal">L</span>
          </p>
          <div className="mt-4 h-2 bg-sky-500/20 overflow-hidden rounded-full">
            <div
              className="h-full bg-sky-500 transition-all duration-1000 shadow-[0_0_8px_rgba(14,165,233,0.4)]"
              style={{
                width: `${Math.min(100, Math.round((hydration / hydrationGoal) * 100))}%`,
              }}
            />
          </div>
          <p className="text-[11px] text-sky-600/70 mt-2 uppercase tracking-wide font-normal">
            Goal: {(hydrationGoal / 1000).toFixed(1)}L
          </p>
        </div>






        <div className="bg-transparent p-5 md:p-7 relative group transition-all hover:bg-secondary/40 border-none">
          <Scale
            className="absolute right-4 top-4 h-6 w-6 text-indigo-500/30 group-hover:text-indigo-500/50 transition-colors"
            strokeWidth={1.5}
            aria-hidden
          />
          <p className="text-[12px] tracking-[0.2em] uppercase text-indigo-600/80 mb-3 font-normal">
            Weight
          </p>
          <p className="text-3xl md:text-5xl font-extralight tabular-nums tracking-tighter text-indigo-500 dark:text-indigo-400">
            {weight ?? "—"}
            {weight && <span className="text-sm text-indigo-400/60 ml-1 font-normal tracking-normal">kg</span>}
          </p>
          <p className="text-[11px] text-indigo-600/70 mt-4 uppercase tracking-wide font-normal">
            {weight ? "Latest entry" : "No data"}
          </p>
        </div>






        <div className="bg-transparent p-5 md:p-7 relative group transition-all hover:bg-secondary/40 border-none">
          <LayoutList
            className="absolute right-4 top-4 h-6 w-6 text-emerald-500/30 group-hover:text-emerald-500/50 transition-colors"
            strokeWidth={1.5}
            aria-hidden
          />
          <p className="text-[12px] tracking-[0.2em] uppercase text-emerald-600/80 mb-3 font-normal">
            Weekly
          </p>
          <p className="text-3xl md:text-5xl font-extralight tabular-nums tracking-tighter text-emerald-500 dark:text-emerald-400">
            {week.totalCaloriesBurned}
          </p>
          <p className="text-[11px] text-emerald-600/70 mt-4 uppercase tracking-wide font-normal">
            Total kcal
          </p>
        </div>






        <div className="bg-transparent p-5 md:p-7 relative group transition-all hover:bg-secondary/40 border-none">
          <Dumbbell
            className="absolute right-4 top-4 h-6 w-6 text-violet-500/30 group-hover:text-violet-500/50 transition-colors"
            strokeWidth={1.5}
            aria-hidden
          />
          <p className="text-[12px] tracking-[0.2em] uppercase text-violet-600/80 mb-3 font-normal">
            Sessions
          </p>
          <p className="text-3xl md:text-5xl font-extralight tabular-nums tracking-tighter text-violet-500 dark:text-violet-400">
            {week.workoutsCompleted}
          </p>
          <p className="text-[11px] text-violet-600/70 mt-4 uppercase tracking-wide font-normal">
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
