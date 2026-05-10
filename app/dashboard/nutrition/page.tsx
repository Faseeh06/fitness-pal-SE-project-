"use client"

import { useMemo, useReducer } from "react"
import { Plus, Trash2 } from "lucide-react"

import { AiAutomationCta } from "@/components/dashboard/ai-plan-automation"
import { useDashboardUser } from "@/components/dashboard/dashboard-context"
import { DashboardPageHero } from "@/components/dashboard/dashboard-page-hero"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { db } from "@/lib/db"
import {
  type MealType,
  addMealToDay,
  applyMealPlanToDay,
  getCaloriesConsumedForDay,
  getEntriesForDay,
  removeEntryFromDay,
} from "@/lib/fitpal-nutrition"

import { formatLocalDay } from "@/lib/fitpal-workouts"

const typeOrder: MealType[] = ["breakfast", "lunch", "dinner", "snack"]

const typeLabel: Record<MealType, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
}

export default function NutritionPage() {
  const user = useDashboardUser()
  const [tick, refresh] = useReducer((n: number) => n + 1, 0)
  const today = formatLocalDay()

  const entries = useMemo(() => {
    if (!user) return []
    return getEntriesForDay(user.id, today)
  }, [user, today, tick])

  const total = useMemo(() => {
    if (!user) return 0
    return getCaloriesConsumedForDay(user.id, today)
  }, [user, today, tick])


  if (!user) return null

  function add(mealId: string) {
    addMealToDay(user.id, today, mealId)
    refresh()
  }

  function remove(entryId: string) {
    removeEntryFromDay(user.id, today, entryId)
    refresh()
  }

  function applyPlan(planId: string) {
    applyMealPlanToDay(user.id, today, planId)
    refresh()
  }

  return (
    <div>
      <DashboardPageHero
        kicker="Nutrition"
        title="Fuel your day"
        description="Add meals or a sample plan — calories flow to Progress and charts."
      />

      <AiAutomationCta label="Generate a day’s meals with AI →" />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-start">
        <div className="space-y-8">
          <Tabs defaultValue="meals" className="w-full">
            <TabsList className="h-auto w-full flex flex-wrap rounded-none border border-border bg-muted/40 p-0 gap-px">
              <TabsTrigger
                value="meals"
                className="flex-1 rounded-none py-3 text-[11px] uppercase tracking-[0.18em] data-[state=active]:bg-background data-[state=active]:shadow-none"
              >
                Meals
              </TabsTrigger>
              <TabsTrigger
                value="plans"
                className="flex-1 rounded-none py-3 text-[11px] uppercase tracking-[0.18em] data-[state=active]:bg-background data-[state=active]:shadow-none"
              >
                Meal plans
              </TabsTrigger>
            </TabsList>

            <TabsContent value="meals" className="mt-8 space-y-10 focus-visible:outline-none">
              {typeOrder.map((type) => (
                <div key={type}>
                  <div className="flex items-baseline justify-between gap-4 mb-4 border-b border-border pb-3">
                    <h2 className="text-sm font-medium tracking-tight uppercase text-muted-foreground">
                      {typeLabel[type]}
                    </h2>
                    <span className="text-[11px] text-muted-foreground tabular-nums">
                      {db.nutrition.getMeals().filter((m) => m.type === type).length} items
                    </span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
                    {db.nutrition.getMeals().filter((m) => m.type === type).map((m) => (

                      <div
                        key={m.id}
                        className="flex flex-col border border-border bg-background p-4 md:p-5 gap-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-light text-foreground leading-snug">{m.name}</p>
                          <Badge variant="outline" className="rounded-none shrink-0 text-[10px]">
                            {m.calories} kcal
                          </Badge>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          className="rounded-none w-full gap-1.5"
                          onClick={() => add(m.id)}
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Add to today
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="plans" className="mt-8 focus-visible:outline-none">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {db.nutrition.getPlans().map((plan) => (

                  <Card key={plan.id} className="rounded-none border-border">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-light tracking-tight">{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="text-xs text-muted-foreground space-y-1.5">
                        {plan.mealIds.map((id) => {
                          const m = db.nutrition.getMealById(id)

                          return (
                            <li key={id} className="flex justify-between gap-2">
                              <span>{m?.name ?? id}</span>
                              <span className="tabular-nums shrink-0">{m?.calories ?? "—"}</span>
                            </li>
                          )
                        })}
                      </ul>
                      <Button
                        type="button"
                        className="rounded-none w-full"
                        variant="outline"
                        onClick={() => applyPlan(plan.id)}
                      >
                        Apply to today
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <Card className="rounded-none border-border xl:sticky xl:top-6">
          <CardHeader className="border-b border-border bg-card/50">
            <p className="text-[11px] tracking-[0.25em] uppercase text-muted-foreground">Today</p>
            <CardTitle className="text-lg font-light tracking-tight">
              {today.slice(5)} · {total.toLocaleString()} kcal
            </CardTitle>
            <CardDescription>Logged meals for the current local day.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-0">
            {entries.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center border border-dashed border-border px-4">
                No meals yet — add from the catalog or apply a plan.
              </p>
            ) : (
              <ul className="divide-y divide-border border border-border">
                {entries.map((e) => (
                  <li
                    key={e.id}
                    className="flex items-start justify-between gap-3 px-4 py-3 bg-background"
                  >
                    <div className="min-w-0">
                      <p className="text-sm text-foreground">{e.name}</p>
                      <p className="text-[11px] text-muted-foreground mt-1 uppercase tracking-wide">
                        {typeLabel[e.type]} · {e.calories} kcal
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="rounded-none shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={() => remove(e.id)}
                      aria-label={`Remove ${e.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <Separator className="my-12" />
      <p className="text-[11px] text-muted-foreground max-w-md leading-snug">
        Plans append meals to Today; remove lines anytime. Browser-only storage.
      </p>
    </div>
  )
}
