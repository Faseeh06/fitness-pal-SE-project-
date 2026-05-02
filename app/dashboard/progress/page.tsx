"use client"

import { useMemo, useReducer } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts"

import { useDashboardUser } from "@/components/dashboard/dashboard-context"
import { ModulePageHeader } from "@/components/dashboard/module-page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { getCaloriesConsumedForDay } from "@/lib/fitpal-nutrition"
import {
  getWeightKgForDay,
  getWeightSeries,
  setWeightKgForDay,
} from "@/lib/fitpal-progress-weight"
import {
  caloriesBurnedOnLocalDay,
  formatLocalDay,
  getStepsForDay,
} from "@/lib/fitpal-workouts"

const chartConfig = {
  weight: { label: "Weight (kg)", color: "hsl(0 0% 12%)" },
  in: { label: "Calories in", color: "hsl(0 0% 35%)" },
  out: { label: "Calories out", color: "hsl(0 0% 62%)" },
  steps: { label: "Steps", color: "hsl(0 0% 40%)" },
} as const

export default function ProgressPage() {
  const user = useDashboardUser()
  const [, refresh] = useReducer((n: number) => n + 1, 0)

  const today = formatLocalDay()
  const weightToday = user ? getWeightKgForDay(user.id, today) : null

  const weekDays = useMemo(() => {
    const days: string[] = []
    const ref = new Date()
    for (let i = 6; i >= 0; i -= 1) {
      const d = new Date(ref)
      d.setDate(ref.getDate() - i)
      days.push(formatLocalDay(d))
    }
    return days
  }, [])

  const weightSeries = useMemo(() => {
    if (!user) return []
    return getWeightSeries(user.id, 14, new Date())
  }, [user, refresh])

  const energyData = useMemo(() => {
    if (!user) return []
    return weekDays.map((day) => ({
      label: day.slice(5),
      day,
      in: getCaloriesConsumedForDay(user.id, day),
      out: caloriesBurnedOnLocalDay(user.id, day),
    }))
  }, [user, weekDays, refresh])

  const stepsData = useMemo(() => {
    if (!user) return []
    return weekDays.map((day) => ({
      label: day.slice(5),
      steps: getStepsForDay(user.id, day),
    }))
  }, [user, weekDays, refresh])

  if (!user) return null

  function onLogWeight(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const raw = fd.get("weight")
    const kg = Number.parseFloat(String(raw))
    if (!Number.isFinite(kg)) return
    setWeightKgForDay(user.id, today, kg)
    refresh()
  }

  const todayIn = getCaloriesConsumedForDay(user.id, today)
  const todayOut = caloriesBurnedOnLocalDay(user.id, today)
  const todaySteps = getStepsForDay(user.id, today)

  return (
    <div>
      <ModulePageHeader
        title="Progress"
        description="Log weight, then compare intake from Nutrition with calories burned from workouts. Steps reuse the same daily totals as your dashboard."
      />

      <div className="grid gap-px bg-border border border-border sm:grid-cols-2 xl:grid-cols-4 mb-10">
        <div className="bg-background p-5 md:p-6">
          <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-2">
            Today · Weight
          </p>
          <p className="text-2xl font-extralight tabular-nums">
            {weightToday != null ? `${weightToday} kg` : "—"}
          </p>
        </div>
        <div className="bg-background p-5 md:p-6">
          <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-2">
            Today · Calories in
          </p>
          <p className="text-2xl font-extralight tabular-nums">{todayIn}</p>
        </div>
        <div className="bg-background p-5 md:p-6">
          <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-2">
            Today · Burned
          </p>
          <p className="text-2xl font-extralight tabular-nums">{todayOut}</p>
        </div>
        <div className="bg-background p-5 md:p-6">
          <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-2">
            Today · Steps
          </p>
          <p className="text-2xl font-extralight tabular-nums">{todaySteps.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3 mb-10">
        <Card className="rounded-none border-border lg:col-span-2 xl:col-span-3">
          <CardHeader className="border-b border-border/80 pb-4">
            <CardTitle className="text-base font-light tracking-tight">Log weight</CardTitle>
            <CardDescription>Stored per calendar day (demo · localStorage).</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={onLogWeight} className="flex flex-col sm:flex-row sm:items-end gap-4">
              <div className="space-y-2 flex-1 max-w-xs">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  key={`w-${today}-${weightToday ?? "x"}`}
                  id="weight"
                  name="weight"
                  type="number"
                  step="0.1"
                  min={20}
                  max={300}
                  placeholder="e.g. 72.5"
                  className="rounded-none"
                  defaultValue={weightToday ?? ""}
                />
              </div>
              <Button type="submit" className="rounded-none w-full sm:w-auto">
                Save for today
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="rounded-none border-border xl:col-span-2">
          <CardHeader>
            <p className="text-[11px] tracking-[0.25em] uppercase text-muted-foreground">Trend</p>
            <CardTitle className="text-lg font-light tracking-tight">Weight (14 days)</CardTitle>
            <CardDescription>Line skips days without a log.</CardDescription>
          </CardHeader>
          <CardContent className="pl-1">
            <ChartContainer config={chartConfig} className="h-[280px] w-full aspect-auto">
              <LineChart data={weightSeries} margin={{ left: 0, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/60" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} width={44} domain={["auto", "auto"]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="weightKg"
                  stroke="var(--color-weight)"
                  strokeWidth={2}
                  connectNulls
                  dot={{ r: 3, fill: "var(--color-weight)" }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="rounded-none border-border">
          <CardHeader>
            <p className="text-[11px] tracking-[0.25em] uppercase text-muted-foreground">Balance</p>
            <CardTitle className="text-lg font-light tracking-tight">Energy (7 days)</CardTitle>
            <CardDescription>In from Nutrition vs out from workouts.</CardDescription>
          </CardHeader>
          <CardContent className="pl-1">
            <ChartContainer config={chartConfig} className="h-[280px] w-full aspect-auto">
              <BarChart data={energyData} margin={{ left: 0, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/60" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} width={40} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="in" fill="var(--color-in)" radius={[3, 3, 0, 0]} maxBarSize={28} />
                <Bar dataKey="out" fill="var(--color-out)" radius={[3, 3, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="rounded-none border-border lg:col-span-2 xl:col-span-3">
          <CardHeader>
            <p className="text-[11px] tracking-[0.25em] uppercase text-muted-foreground">Movement</p>
            <CardTitle className="text-lg font-light tracking-tight">Steps (7 days)</CardTitle>
            <CardDescription>Includes workout-based estimates and any seeded demo totals.</CardDescription>
          </CardHeader>
          <CardContent className="pl-1">
            <ChartContainer config={chartConfig} className="h-[260px] w-full aspect-auto">
              <LineChart data={stepsData} margin={{ left: 0, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/60" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} width={48} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="steps"
                  stroke="var(--color-steps)"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "var(--color-steps)" }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-10" />
      <p className="text-xs text-muted-foreground">
        Weekly summary on the overview pulls the same workout and step data; nutrition intake appears
        here once you log meals in the Nutrition module.
      </p>
    </div>
  )
}
