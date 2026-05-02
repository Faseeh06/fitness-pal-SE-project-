"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { useDashboardUser } from "@/components/dashboard/dashboard-context"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  WORKOUT_CATALOG,
  type WorkoutCategory,
  getWorkoutById,
  getWorkoutSessions,
} from "@/lib/fitpal-workouts"

function CategoryBlock({
  title,
  category,
}: {
  title: string
  category: WorkoutCategory
}) {
  const items = WORKOUT_CATALOG.filter((w) => w.category === category)
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 mb-6">
        <h2 className="text-lg font-light tracking-tight">{title}</h2>
        <span className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground">
          {items.length} plans
        </span>
      </div>
      <div className="grid gap-px bg-border border border-border">
        {items.map((w) => (
          <Link
            key={w.id}
            href={`/dashboard/workouts/${w.id}`}
            className="group flex items-start justify-between gap-6 bg-background p-6 md:p-8 hover:bg-secondary/40 transition-colors"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h3 className="text-base font-light tracking-tight text-foreground">{w.name}</h3>
                <Badge variant="outline" className="rounded-none text-[10px] uppercase tracking-wide">
                  {w.category}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                {w.description}
              </p>
              <p className="text-[11px] text-muted-foreground/80 mt-3 tracking-wide">
                Suggested {w.defaultDurationMinutes} min · ~{w.defaultCaloriesBurned} kcal
              </p>
            </div>
            <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground/40 group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all mt-1" />
          </Link>
        ))}
      </div>
    </div>
  )
}

export default function WorkoutsPage() {
  const user = useDashboardUser()
  if (!user) return null

  const history = getWorkoutSessions(user.id).slice(0, 12)

  return (
    <div>
      <p className="text-[11px] tracking-[0.3em] uppercase text-muted-foreground mb-3">Module</p>
      <h1 className="text-3xl md:text-4xl font-extralight tracking-tight text-balance mb-3">
        Workouts
      </h1>
      <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
        Browse cardio and strength sessions, open a plan, then log duration and calories when you
        finish. History stays in this browser.
      </p>

      <div className="mt-14 space-y-16">
        <CategoryBlock title="Cardio" category="cardio" />
        <CategoryBlock title="Strength" category="strength" />
      </div>

      <Separator className="my-16" />

      <div>
        <div className="flex items-end justify-between gap-4 mb-6">
          <h2 className="text-lg font-light tracking-tight">Recent history</h2>
          <span className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground">
            Newest first
          </span>
        </div>
        {history.length === 0 ? (
          <p className="text-sm text-muted-foreground border border-dashed border-border px-6 py-10 text-center">
            No completed workouts yet. Finish a session from a plan above to build your log.
          </p>
        ) : (
          <div className="divide-y divide-border border border-border">
            {history.map((row) => {
              const def = getWorkoutById(row.workoutId)
              return (
                <div
                  key={row.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-background px-6 py-5"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {def?.name ?? "Workout"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(row.completedAt).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground tabular-nums sm:text-right">
                    {row.durationMinutes} min · {row.caloriesBurned} kcal
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
