"use client"

import Link from "next/link"
import { ArrowUpRight, Flame, Timer } from "lucide-react"

import { useDashboardUser } from "@/components/dashboard/dashboard-context"
import { DashboardPageHero } from "@/components/dashboard/dashboard-page-hero"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { db } from "@/lib/db"
import {
  type WorkoutCategory,
  getWorkoutById,
  getWorkoutSessions,
} from "@/lib/fitpal-workouts"


function WorkoutTile({ workoutId }: { workoutId: string }) {
  const w = db.workouts.getById(workoutId)

  if (!w) return null
  return (
    <Link
      href={`/dashboard/workouts/${w.id}`}
      className="group relative overflow-hidden border border-border bg-background text-left shadow-none outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
    >
      <div className="relative aspect-[16/11] overflow-hidden bg-muted">
        {/* Native img avoids intermittent Next/Image remote fetch issues for Unsplash. */}
        <img
          src={w.imageUrl}
          alt=""
          width={640}
          height={440}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent opacity-95 group-hover:opacity-100 transition-opacity pointer-events-none" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <Badge
            variant="secondary"
            className="rounded-none text-[10px] uppercase tracking-wide bg-background/90 backdrop-blur-sm border border-border/60"
          >
            {w.category}
          </Badge>
        </div>
        <ArrowUpRight className="absolute right-4 top-4 h-4 w-4 text-background/90 drop-shadow md:text-foreground/70 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 pointer-events-none" />
      </div>
      <div className="p-6 md:p-7 space-y-3 border-t border-border bg-card/40 backdrop-blur-[2px]">
        <h3 className="text-lg font-light tracking-tight text-foreground leading-snug">{w.name}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{w.description}</p>
        <div className="flex flex-wrap gap-4 pt-1 text-[11px] uppercase tracking-wide text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Timer className="h-3.5 w-3.5" />
            {w.defaultDurationMinutes} min
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Flame className="h-3.5 w-3.5" />
            ~{w.defaultCaloriesBurned} kcal
          </span>
        </div>
      </div>
    </Link>
  )
}

function CategoryPlans({ category }: { category: WorkoutCategory }) {
  const ids = db.workouts.getAll().filter((w) => w.category === category).map((w) => w.id)

  const blurb =
    category === "cardio"
      ? "Intervals, steady-state, and machines that elevate heart rate — open a tile to see the full brief and log your session."
      : "Compound lifts and controlled tension — log honest duration and calories when you finish."

  return (
    <div className="space-y-8">
      <div className="max-w-2xl space-y-3">
        <Badge variant="outline" className="rounded-none text-[10px] uppercase tracking-[0.2em]">
          {category}
        </Badge>
        <p className="text-sm text-muted-foreground leading-relaxed">{blurb}</p>
        <p className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground">
          {ids.length} curated plans
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {ids.map((id) => (
          <WorkoutTile key={id} workoutId={id} />
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
      <DashboardPageHero
        priority
        kicker="Workouts"
        title="Train with intent"
        description="Switch between cardio and strength — one category at a time. Logged sessions feed your dashboard charts."
        imageSrc="https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1800&q=82"
      />

      <Tabs defaultValue="cardio" className="w-full">
        <TabsList className="h-auto w-full flex flex-wrap sm:flex-nowrap rounded-none border border-border bg-muted/40 p-0 gap-px">
          <TabsTrigger
            value="cardio"
            className="flex-1 rounded-none py-3.5 px-4 text-[11px] uppercase tracking-[0.2em] data-[state=active]:bg-background data-[state=active]:shadow-none"
          >
            Cardio
          </TabsTrigger>
          <TabsTrigger
            value="strength"
            className="flex-1 rounded-none py-3.5 px-4 text-[11px] uppercase tracking-[0.2em] data-[state=active]:bg-background data-[state=active]:shadow-none"
          >
            Strength
          </TabsTrigger>
        </TabsList>
        <TabsContent value="cardio" className="mt-8 focus-visible:outline-none">
          <CategoryPlans category="cardio" />
        </TabsContent>
        <TabsContent value="strength" className="mt-8 focus-visible:outline-none">
          <CategoryPlans category="strength" />
        </TabsContent>
      </Tabs>

      <Separator className="my-14 md:my-16" />

      <div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground mb-2">
              History
            </p>
            <h2 className="text-2xl md:text-3xl font-extralight tracking-tight">Recent completions</h2>
          </div>
          <span className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground">
            Newest first · kept locally
          </span>
        </div>
        {history.length === 0 ? (
          <div className="relative overflow-hidden border border-dashed border-border">
            <img
              src="https://images.unsplash.com/photo-1599058945527-39ce67bee916?auto=format&fit=crop&w=1200&q=82"
              alt=""
              className="w-full h-48 object-cover opacity-40 grayscale"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-background/75 backdrop-blur-[1px] px-6">
              <p className="text-sm text-muted-foreground text-center max-w-md leading-relaxed">
                No completions yet — pick a plan in a tab above, tap{" "}
                <span className="text-foreground">Start workout</span>, then save your session.
              </p>
            </div>
          </div>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {history.map((row) => {
              const def = getWorkoutById(row.workoutId)
              const thumb = def?.imageUrl
              return (
                <li
                  key={row.id}
                  className="flex gap-0 border border-border bg-background overflow-hidden group"
                >
                  <Link
                    href={def ? `/dashboard/workouts/${def.id}` : "/dashboard/workouts"}
                    className="relative w-[112px] shrink-0 hidden sm:block self-stretch min-h-[120px] bg-muted"
                  >
                    {thumb ? (
                      <>
                        <img
                          src={thumb}
                          alt=""
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-foreground/15 group-hover:bg-transparent transition-colors" />
                      </>
                    ) : null}
                  </Link>
                  <div className="flex flex-1 flex-col justify-center gap-2 px-5 py-5 sm:py-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-foreground">{def?.name ?? "Workout"}</p>
                      {def ? (
                        <Badge variant="outline" className="rounded-none text-[10px] uppercase">
                          {def.category}
                        </Badge>
                      ) : null}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(row.completedAt).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground uppercase tracking-wide">
                      <span className="inline-flex items-center gap-1 tabular-nums">
                        <Timer className="h-3 w-3" />
                        {row.durationMinutes} min
                      </span>
                      <span className="inline-flex items-center gap-1 tabular-nums">
                        <Flame className="h-3 w-3" />
                        {row.caloriesBurned} kcal
                      </span>
                    </div>
                  </div>
                  <Link
                    href={def ? `/dashboard/workouts/${def.id}` : "/dashboard/workouts"}
                    className="hidden md:flex items-center px-4 border-l border-border text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Open workout"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
