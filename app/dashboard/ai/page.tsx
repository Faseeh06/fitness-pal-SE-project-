"use client"

import { useMemo, useState } from "react"
import { Sparkles } from "lucide-react"

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
        kicker="Guidance"
        title="AI suggestions"
        description="No cloud model — FitPal applies fixed rules from your goal: weight loss leans on cardio-aware training and lighter plates; muscle gain emphasizes strength work and protein-forward meals."
      />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10 pb-8 border-b border-border">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-border bg-muted/40">
            <Sparkles className="h-5 w-5 text-foreground/85" />
          </div>
          <div>
            <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-2">
              Active goal
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-lg font-light tracking-tight">
                {FITNESS_GOAL_LABEL[activeGoal]}
              </span>
              {mode === "profile" ? (
                <Badge variant="outline" className="rounded-none text-[10px] uppercase tracking-wide">
                  From profile
                </Badge>
              ) : (
                <Badge variant="secondary" className="rounded-none text-[10px] uppercase tracking-wide">
                  Preview
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2 max-w-md">
              Profile goal:{" "}
              <span className="text-foreground/90">{FITNESS_GOAL_LABEL[profileGoal]}</span>
              {user.goal ? ` (${user.goal})` : ""}
            </p>
          </div>
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

      <div className="border border-border bg-muted/15 px-5 py-6 md:px-8 md:py-8 mb-10">
        <p className="text-[11px] tracking-[0.25em] uppercase text-muted-foreground mb-3">Summary</p>
        <h2 className="text-xl md:text-2xl font-extralight tracking-tight text-balance max-w-3xl">
          {pack.headline}
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 mb-10">
        <Card className="rounded-none border-border md:col-span-2 xl:col-span-1">
          <CardHeader className="border-b border-border/70 pb-4">
            <CardTitle className="text-base font-light tracking-tight">Training</CardTitle>
            <CardDescription>Workout emphasis for this goal.</CardDescription>
          </CardHeader>
          <CardContent className="pt-5">
            <ul className="space-y-3 text-sm text-muted-foreground leading-relaxed list-disc pl-4">
              {pack.workouts.map((line, i) => (
                <li key={`w-${i}`}>{line}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="rounded-none border-border md:col-span-2 xl:col-span-1">
          <CardHeader className="border-b border-border/70 pb-4">
            <CardTitle className="text-base font-light tracking-tight">Meals</CardTitle>
            <CardDescription>Food patterns — not a prescribed meal plan.</CardDescription>
          </CardHeader>
          <CardContent className="pt-5">
            <ul className="space-y-3 text-sm text-muted-foreground leading-relaxed list-disc pl-4">
              {pack.meals.map((line, i) => (
                <li key={`m-${i}`}>{line}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="rounded-none border-border md:col-span-2 xl:col-span-1">
          <CardHeader className="border-b border-border/70 pb-4">
            <CardTitle className="text-base font-light tracking-tight">Targets</CardTitle>
            <CardDescription>Demo reminders you can mirror in Progress & Hydration.</CardDescription>
          </CardHeader>
          <CardContent className="pt-5">
            <ul className="divide-y divide-border border border-border">
              {pack.targets.map((t) => (
                <li key={t.label} className="flex justify-between gap-4 px-3 py-2.5 text-sm">
                  <span className="text-muted-foreground">{t.label}</span>
                  <span className="text-foreground text-right tabular-nums shrink-0">{t.value}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-10" />
      <p className="text-xs text-muted-foreground max-w-3xl leading-relaxed">{pack.notes}</p>
    </div>
  )
}
