"use client"

import { useMemo, useState } from "react"
import { Crosshair, Dumbbell, Sparkles, UtensilsCrossed } from "lucide-react"

import { useDashboardUser } from "@/components/dashboard/dashboard-context"
import { ModulePageHeader } from "@/components/dashboard/module-page-header"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  FITNESS_GOAL_LABEL,
  type FitnessGoalKey,
  getSuggestionPack,
  parseGoalFromProfile,
} from "@/lib/fitpal-ai-suggestions"
import { cn } from "@/lib/utils"

type SourceMode = "profile" | FitnessGoalKey

export default function AiPage() {
  const user = useDashboardUser()
  const [mode, setMode] = useState<SourceMode>("profile")

  const profileGoal = useMemo(
    () => (user ? parseGoalFromProfile(user.goal) : "maintain"),
    [user],
  )

  const activeGoal: FitnessGoalKey = mode === "profile" ? profileGoal : mode
  const pack = useMemo(() => getSuggestionPack(activeGoal), [activeGoal])

  if (!user) return null

  return (
    <div>
      <ModulePageHeader
        icon={Sparkles}
        kicker="Guidance"
        title="AI suggestions"
        description="No cloud model — short rules from your goal (loss / gain / maintain)."
      />

      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-8 pb-6 border-b border-border">
        <div>
          <p className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground mb-1.5">
            Active goal
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-lg font-light tracking-tight">{FITNESS_GOAL_LABEL[activeGoal]}</span>
            {mode === "profile" ? (
              <Badge variant="outline" className="rounded-none text-[10px] uppercase tracking-wide">
                Profile
              </Badge>
            ) : (
              <Badge variant="secondary" className="rounded-none text-[10px] uppercase tracking-wide">
                Preview
              </Badge>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">
            Saved: <span className="text-foreground/85">{FITNESS_GOAL_LABEL[profileGoal]}</span>
            {user.goal ? ` · ${user.goal}` : ""}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setMode("profile")}
            className={cn(
              "px-3 py-2 text-[11px] uppercase tracking-wide border transition-colors",
              mode === "profile"
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-background text-muted-foreground hover:text-foreground",
            )}
          >
            Use profile
          </button>
          {(Object.keys(FITNESS_GOAL_LABEL) as FitnessGoalKey[]).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setMode(k)}
              className={cn(
                "px-3 py-2 text-[11px] uppercase tracking-wide border transition-colors",
                mode === k
                  ? "border-foreground bg-secondary text-foreground"
                  : "border-border bg-background text-muted-foreground hover:text-foreground",
              )}
            >
              {FITNESS_GOAL_LABEL[k]}
            </button>
          ))}
        </div>
      </div>

      <div className="border border-border bg-secondary/35 px-5 py-5 md:px-7 md:py-6 mb-9 flex gap-4 items-start">
        <Sparkles className="h-4 w-4 shrink-0 text-foreground/35 mt-1" strokeWidth={1.5} aria-hidden />
        <div>
          <p className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground mb-2">Summary</p>
          <h2 className="text-lg md:text-xl font-extralight tracking-tight text-balance max-w-2xl leading-snug">
            {pack.headline}
          </h2>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 mb-10">
        <Card className="rounded-none border-border md:col-span-2 xl:col-span-1">
          <CardHeader className="border-b border-border/70 pb-4">
            <div className="flex items-center gap-2.5">
              <Dumbbell className="h-4 w-4 text-foreground/40" strokeWidth={1.5} aria-hidden />
              <CardTitle className="text-base font-light tracking-tight">Training</CardTitle>
            </div>
            <CardDescription className="text-xs">Emphasis for this goal.</CardDescription>
          </CardHeader>
          <CardContent className="pt-5">
            <ul className="space-y-2.5">
              {pack.workouts.map((line, i) => (
                <li key={`w-${i}`} className="flex gap-2.5 text-[13px] text-muted-foreground leading-snug">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-foreground/20" aria-hidden />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="rounded-none border-border md:col-span-2 xl:col-span-1">
          <CardHeader className="border-b border-border/70 pb-4">
            <div className="flex items-center gap-2.5">
              <UtensilsCrossed className="h-4 w-4 text-foreground/40" strokeWidth={1.5} aria-hidden />
              <CardTitle className="text-base font-light tracking-tight">Meals</CardTitle>
            </div>
            <CardDescription className="text-xs">Patterns, not a fixed menu.</CardDescription>
          </CardHeader>
          <CardContent className="pt-5">
            <ul className="space-y-2.5">
              {pack.meals.map((line, i) => (
                <li key={`m-${i}`} className="flex gap-2.5 text-[13px] text-muted-foreground leading-snug">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-foreground/20" aria-hidden />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="rounded-none border-border md:col-span-2 xl:col-span-1">
          <CardHeader className="border-b border-border/70 pb-4">
            <div className="flex items-center gap-2.5">
              <Crosshair className="h-4 w-4 text-foreground/40" strokeWidth={1.5} aria-hidden />
              <CardTitle className="text-base font-light tracking-tight">Targets</CardTitle>
            </div>
            <CardDescription className="text-xs">Reminders — tune in Progress / Hydration.</CardDescription>
          </CardHeader>
          <CardContent className="pt-5">
            <ul className="divide-y divide-border border border-border bg-background">
              {pack.targets.map((t) => (
                <li key={t.label} className="flex justify-between gap-4 px-3 py-2.5 text-[13px]">
                  <span className="text-muted-foreground">{t.label}</span>
                  <span className="text-foreground text-right tabular-nums shrink-0">{t.value}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-9" />
      <p className="text-[11px] text-muted-foreground max-w-2xl leading-snug border-l-2 border-foreground/10 pl-4">
        {pack.notes}
      </p>
    </div>
  )
}
