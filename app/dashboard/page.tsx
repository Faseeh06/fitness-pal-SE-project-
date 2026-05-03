"use client"

import Image from "next/image"
import Link from "next/link"
import { Apple, ArrowRight, Droplets, Dumbbell, Flame, Footprints, LayoutList } from "lucide-react"

import { DashboardAnalyticsCharts } from "@/components/dashboard/dashboard-analytics-charts"
import { useDashboardUser } from "@/components/dashboard/dashboard-context"
import { Separator } from "@/components/ui/separator"
import { dashboardBleedX } from "@/lib/dashboard-layout"
import { formatLocalDay, getWeekSummary } from "@/lib/fitpal-workouts"
import { cn } from "@/lib/utils"

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
      <section
        className={cn(
          "relative overflow-hidden border border-border bg-card/40 mb-10 md:mb-12",
          dashboardBleedX,
        )}
      >
        <div className="relative h-[200px] md:h-[240px]">
          <Image
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1600&q=80"
            alt=""
            fill
            className="object-cover object-center opacity-95"
            sizes="(max-width: 768px) 100vw, 896px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/88 to-background/25" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_transparent_20%,_hsl(var(--background))_75%)] opacity-90" />
          <div className="relative z-10 flex h-full flex-col justify-end p-8 md:p-10 lg:p-12">
            <p className="text-[11px] tracking-[0.32em] uppercase text-muted-foreground mb-2">
              Overview
            </p>
            <h1 className="text-3xl md:text-[2.65rem] font-extralight tracking-tight text-balance max-w-2xl">
              This week
            </h1>
            <p className="text-sm text-muted-foreground mt-3 max-w-md leading-snug">
              Today and weekly totals below; charts follow what you log.
            </p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border">
        <div className="bg-background p-5 md:p-7 relative">
          <Footprints
            className="absolute right-4 top-4 h-4 w-4 text-foreground/[0.07]"
            strokeWidth={1.25}
            aria-hidden
          />
          <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-3">
            Today · Steps
          </p>
          <p className="text-2xl md:text-3xl font-extralight tabular-nums tracking-tight">
            {today.steps.toLocaleString()}
          </p>
          <div className="mt-4 h-1 bg-secondary overflow-hidden">
            <div
              className="h-full bg-foreground/80 transition-all"
              style={{
                width: `${Math.min(100, Math.round((today.steps / 12000) * 100))}%`,
              }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground/90 mt-2 uppercase tracking-wide">
            vs 12k demo pace
          </p>
        </div>
        <div className="bg-background p-5 md:p-7 relative">
          <Flame
            className="absolute right-4 top-4 h-4 w-4 text-foreground/[0.07]"
            strokeWidth={1.25}
            aria-hidden
          />
          <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-3">
            Today · Burn
          </p>
          <p className="text-2xl md:text-3xl font-extralight tabular-nums tracking-tight">
            {today.caloriesBurned}
            <span className="text-sm text-muted-foreground ml-1 font-normal">kcal</span>
          </p>
          <div className="mt-4 h-1 bg-secondary overflow-hidden">
            <div
              className="h-full bg-foreground/60 transition-all"
              style={{
                width: `${Math.min(100, Math.round((today.caloriesBurned / 600) * 100))}%`,
              }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground/90 mt-2 uppercase tracking-wide">
            vs 600 kcal demo
          </p>
        </div>
        <div className="bg-background p-5 md:p-7 relative">
          <LayoutList
            className="absolute right-4 top-4 h-4 w-4 text-foreground/[0.07]"
            strokeWidth={1.25}
            aria-hidden
          />
          <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-3">
            Week · Burn
          </p>
          <p className="text-2xl md:text-3xl font-extralight tabular-nums tracking-tight">
            {week.totalCaloriesBurned}
          </p>
          <p className="text-[11px] text-muted-foreground mt-4 leading-snug">7-day total kcal.</p>
        </div>
        <div className="bg-background p-5 md:p-7 relative">
          <Dumbbell
            className="absolute right-4 top-4 h-4 w-4 text-foreground/[0.07]"
            strokeWidth={1.25}
            aria-hidden
          />
          <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-3">
            Week · Sessions
          </p>
          <p className="text-2xl md:text-3xl font-extralight tabular-nums tracking-tight">
            {week.workoutsCompleted}
          </p>
          <p className="text-[11px] text-muted-foreground mt-4 leading-snug">Completed workouts.</p>
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
