"use client"

import { useMemo } from "react"
import {
  Area,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Bar as StackedBar,
  BarChart as StackedBarChart,
  LineChart as TrainingLineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  formatLocalDay,
  getWorkoutById,
  getWorkoutSessions,
  getWeekSummary,
} from "@/lib/fitpal-workouts"

const chartStyles = {
  calories: { label: "Calories burned", color: "hsl(0 0% 12%)" },
  steps: { label: "Steps", color: "hsl(0 0% 42%)" },
  cardio: { label: "Cardio sessions", color: "hsl(0 0% 18%)" },
  strength: { label: "Strength sessions", color: "hsl(0 0% 58%)" },
  minutes: { label: "Minutes trained", color: "hsl(0 0% 28%)" },
  cardioKcal: { label: "Cardio burn", color: "hsl(0 0% 15%)" },
  strengthKcal: { label: "Strength burn", color: "hsl(0 0% 50%)" },
} as const

const WEEKLY_WORKOUT_GOAL = 5
const WEEKLY_STEPS_GOAL = 70_000

type Props = {
  userId: string
}

export function DashboardAnalyticsCharts({ userId }: Props) {
  const week = useMemo(() => getWeekSummary(userId), [userId])
  const dayKeys = useMemo(() => new Set(week.days.map((d) => d.day)), [week.days])

  const trendData = useMemo(
    () =>
      week.days.map((d) => ({
        day: d.day.slice(5),
        calories: d.caloriesBurned,
        steps: d.steps,
      })),
    [week.days],
  )

  const stackedSessions = useMemo(() => {
    return week.days.map((d) => {
      const sessionsOnDay = getWorkoutSessions(userId).filter(
        (s) => formatLocalDay(new Date(s.completedAt)) === d.day,
      )
      let cardio = 0
      let strength = 0
      sessionsOnDay.forEach((s) => {
        const w = getWorkoutById(s.workoutId)
        if (w?.category === "cardio") cardio += 1
        else if (w?.category === "strength") strength += 1
      })
      return { day: d.day.slice(5), cardio, strength }
    })
  }, [userId, week.days])

  const minutesTrend = useMemo(() => {
    return week.days.map((d) => {
      const minutes = getWorkoutSessions(userId)
        .filter((s) => formatLocalDay(new Date(s.completedAt)) === d.day)
        .reduce((acc, s) => acc + s.durationMinutes, 0)
      return { day: d.day.slice(5), minutes }
    })
  }, [userId, week.days])

  const calorieMix = useMemo(() => {
    let cardioKcal = 0
    let strengthKcal = 0
    for (const s of getWorkoutSessions(userId)) {
      if (!dayKeys.has(formatLocalDay(new Date(s.completedAt)))) continue
      const w = getWorkoutById(s.workoutId)
      if (w?.category === "cardio") cardioKcal += s.caloriesBurned
      else strengthKcal += s.caloriesBurned
    }
    const rows: { key: string; name: string; value: number }[] = []
    if (cardioKcal > 0) rows.push({ key: "cardioKcal", name: "cardioKcal", value: cardioKcal })
    if (strengthKcal > 0)
      rows.push({ key: "strengthKcal", name: "strengthKcal", value: strengthKcal })
    return rows
  }, [userId, dayKeys])

  const workoutGoalPct = Math.min(
    100,
    Math.round((week.workoutsCompleted / WEEKLY_WORKOUT_GOAL) * 100),
  )
  const stepsGoalPct = Math.min(100, Math.round((week.totalSteps / WEEKLY_STEPS_GOAL) * 100))

  return (
    <div className="grid gap-6 lg:grid-cols-2 mt-12">
      <Card className="rounded-none border-border lg:col-span-2 overflow-hidden">
        <CardHeader className="pb-2">
          <p className="text-[11px] tracking-[0.25em] uppercase text-muted-foreground">
            Trends
          </p>
          <CardTitle className="text-lg font-light tracking-tight">
            Calories burned & steps (7 days)
          </CardTitle>
          <CardDescription>
            Area shows daily burn from logged workouts; line tracks step totals stored for each day.
          </CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <ChartContainer config={chartStyles} className="h-[300px] w-full aspect-auto">
            <ComposedChart data={trendData} margin={{ left: 4, right: 4, top: 12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/60" />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis
                yAxisId="left"
                tickLine={false}
                axisLine={false}
                width={40}
                tickMargin={8}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={false}
                width={44}
                tickMargin={8}
              />
              <ChartTooltip cursor={{ className: "stroke-border" }} content={<ChartTooltipContent />} />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="calories"
                stroke="var(--color-calories)"
                strokeWidth={2}
                fill="var(--color-calories)"
                fillOpacity={0.18}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="steps"
                stroke="var(--color-steps)"
                strokeWidth={2}
                dot={{ r: 3, fill: "var(--color-steps)", strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
            </ComposedChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="rounded-none border-border overflow-hidden">
        <CardHeader className="pb-2">
          <p className="text-[11px] tracking-[0.25em] uppercase text-muted-foreground">
            Volume
          </p>
          <CardTitle className="text-lg font-light tracking-tight">
            Sessions per day
          </CardTitle>
          <CardDescription>Stacked counts — cardio vs strength completions.</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <ChartContainer config={chartStyles} className="h-[280px] w-full aspect-auto">
            <StackedBarChart data={stackedSessions} margin={{ left: 4, right: 8, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/60" />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={32} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <StackedBar dataKey="cardio" stackId="mix" fill="var(--color-cardio)" radius={[0, 0, 0, 0]} />
              <StackedBar
                dataKey="strength"
                stackId="mix"
                fill="var(--color-strength)"
                radius={[4, 4, 0, 0]}
              />
              <ChartLegend content={<ChartLegendContent />} />
            </StackedBarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="rounded-none border-border overflow-hidden">
        <CardHeader className="pb-2">
          <p className="text-[11px] tracking-[0.25em] uppercase text-muted-foreground">
            Balance
          </p>
          <CardTitle className="text-lg font-light tracking-tight">
            Weekly calorie mix
          </CardTitle>
          <CardDescription>Share of burned calories tagged cardio vs strength.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center pb-8 pt-2">
          {calorieMix.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center px-6 py-16 border border-dashed border-border w-full">
              Log a few workouts this week to see how your burn splits across categories.
            </p>
          ) : (
            <ChartContainer config={chartStyles} className="h-[260px] w-full max-w-[320px] aspect-auto mx-auto">
              <PieChart margin={{ top: 8, bottom: 8 }}>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={calorieMix}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={56}
                  outerRadius={88}
                  strokeWidth={1}
                  paddingAngle={2}
                >
                  {calorieMix.map((entry) => (
                    <Cell key={entry.key} fill={`var(--color-${entry.key})`} stroke="hsl(0 0% 92%)" />
                  ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent nameKey="name" />} />
              </PieChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-none border-border overflow-hidden">
        <CardHeader className="pb-2">
          <p className="text-[11px] tracking-[0.25em] uppercase text-muted-foreground">
            Training load
          </p>
          <CardTitle className="text-lg font-light tracking-tight">
            Minutes logged per day
          </CardTitle>
          <CardDescription>Total duration from completed sessions.</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <ChartContainer config={chartStyles} className="h-[260px] w-full aspect-auto">
            <TrainingLineChart data={minutesTrend} margin={{ left: 4, right: 8, top: 12 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/60" />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} width={36} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="minutes"
                stroke="var(--color-minutes)"
                strokeWidth={2}
                dot={{ r: 3, fill: "var(--color-minutes)", strokeWidth: 0 }}
              />
            </TrainingLineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="rounded-none border-border">
        <CardHeader className="pb-4">
          <p className="text-[11px] tracking-[0.25em] uppercase text-muted-foreground">
            Targets (demo)
          </p>
          <CardTitle className="text-lg font-light tracking-tight">Weekly goals</CardTitle>
          <CardDescription>
            Fixed demo targets — {WEEKLY_WORKOUT_GOAL} workouts & {WEEKLY_STEPS_GOAL.toLocaleString()}{" "}
            steps this rolling week.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-3">
            <div className="flex justify-between text-xs uppercase tracking-wide text-muted-foreground">
              <span>Workouts</span>
              <span className="tabular-nums text-foreground">
                {week.workoutsCompleted}/{WEEKLY_WORKOUT_GOAL}
              </span>
            </div>
            <Progress value={workoutGoalPct} className="h-2 rounded-none bg-secondary" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-xs uppercase tracking-wide text-muted-foreground">
              <span>Steps</span>
              <span className="tabular-nums text-foreground">
                {week.totalSteps.toLocaleString()} / {WEEKLY_STEPS_GOAL.toLocaleString()}
              </span>
            </div>
            <Progress value={stepsGoalPct} className="h-2 rounded-none bg-secondary" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
