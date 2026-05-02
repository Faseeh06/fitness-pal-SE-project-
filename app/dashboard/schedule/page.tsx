"use client"

import { useMemo, useReducer, useState } from "react"
import { ChevronLeft, ChevronRight, ExternalLink, Trash2 } from "lucide-react"
import Link from "next/link"

import { useDashboardUser } from "@/components/dashboard/dashboard-context"
import { ModulePageHeader } from "@/components/dashboard/module-page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  addScheduleEntry,
  getEntriesForDate,
  getWeekDayKeys,
  removeScheduleEntry,
} from "@/lib/fitpal-schedule"
import { WORKOUT_CATALOG, formatLocalDay } from "@/lib/fitpal-workouts"
import { cn } from "@/lib/utils"

function parseDayLabel(iso: string) {
  const [y, m, d] = iso.split("-").map((x) => Number.parseInt(x, 10))
  if (!y || !m || !d) return iso
  const dt = new Date(y, m - 1, d)
  return dt.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })
}

function weekRangeLabel(mondayIso: string, sundayIso: string) {
  const [y1, m1, d1] = mondayIso.split("-").map((x) => Number.parseInt(x, 10))
  const [y2, m2, d2] = sundayIso.split("-").map((x) => Number.parseInt(x, 10))
  if (!y1 || !m1 || !d1 || !y2 || !m2 || !d2) return `${mondayIso} – ${sundayIso}`
  const a = new Date(y1, m1 - 1, d1)
  const b = new Date(y2, m2 - 1, d2)
  const left = a.toLocaleDateString(undefined, { month: "short", day: "numeric" })
  const right = b.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
  return `${left} – ${right}`
}

export default function SchedulePage() {
  const user = useDashboardUser()
  const [, refresh] = useReducer((n: number) => n + 1, 0)
  const [weekOffset, setWeekOffset] = useState(0)
  const today = formatLocalDay()

  const weekRef = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + weekOffset * 7)
    return d
  }, [weekOffset])

  const weekDays = useMemo(() => getWeekDayKeys(weekRef), [weekRef])
  const monday = weekDays[0]!
  const sunday = weekDays[6]!

  if (!user) return null

  function onAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const date = String(fd.get("date") ?? "").trim()
    const time = String(fd.get("time") ?? "").trim()
    const title = String(fd.get("title") ?? "").trim()
    const notes = String(fd.get("notes") ?? "").trim()
    const workoutId = String(fd.get("workoutId") ?? "").trim()
    if (!date || !time || !title) return
    addScheduleEntry(user.id, {
      date,
      time,
      title,
      notes: notes || undefined,
      workoutId: workoutId || undefined,
    })
    refresh()
    e.currentTarget.reset()
    const dateEl = e.currentTarget.elements.namedItem("date") as HTMLInputElement | null
    const timeEl = e.currentTarget.elements.namedItem("time") as HTMLInputElement | null
    if (dateEl) dateEl.value = date
    if (timeEl) timeEl.value = time
  }

  function remove(id: string) {
    removeScheduleEntry(user.id, id)
    refresh()
  }

  return (
    <div>
      <ModulePageHeader
        kicker="Plan"
        title="Schedule"
        description="Plan sessions for the week ahead. Optional links jump to catalog workouts. Everything is stored in this browser (demo)."
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-border">
        <div>
          <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">Week</p>
          <p className="text-sm font-light text-foreground mt-1">{weekRangeLabel(monday, sunday)}</p>
        </div>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="rounded-none"
            aria-label="Previous week"
            onClick={() => setWeekOffset((w) => w - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            className="rounded-none px-4 text-xs uppercase tracking-wide"
            onClick={() => setWeekOffset(0)}
          >
            This week
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="rounded-none"
            aria-label="Next week"
            onClick={() => setWeekOffset((w) => w + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7 mb-10">
        {weekDays.map((day) => {
          const entries = getEntriesForDate(user.id, day)
          const isToday = day === today
          return (
            <div
              key={day}
              className={cn(
                "flex flex-col border border-border bg-background min-h-[140px]",
                isToday && "ring-1 ring-foreground/20 bg-card/40",
              )}
            >
              <div
                className={cn(
                  "px-3 py-2 border-b border-border text-[11px] uppercase tracking-wide",
                  isToday ? "text-foreground bg-secondary/60" : "text-muted-foreground bg-muted/30",
                )}
              >
                {parseDayLabel(day)}
                {isToday ? <span className="ml-2 text-foreground/70 normal-case">· Today</span> : null}
              </div>
              <ul className="flex-1 p-2 space-y-2 overflow-y-auto max-h-[280px]">
                {entries.length === 0 ? (
                  <li className="text-[11px] text-muted-foreground px-1 py-2">No items</li>
                ) : (
                  entries.map((e) => (
                    <li
                      key={e.id}
                      className="group border border-border/80 bg-background px-2 py-2 text-[12px] leading-snug"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <span className="tabular-nums text-muted-foreground shrink-0">{e.time}</span>
                        <button
                          type="button"
                          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive p-0.5"
                          aria-label="Remove"
                          onClick={() => remove(e.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="text-foreground mt-1 font-medium">{e.title}</p>
                      {e.workoutId ? (
                        <Link
                          href={`/dashboard/workouts/${e.workoutId}`}
                          className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground mt-1"
                        >
                          Open workout
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      ) : null}
                      {e.notes ? (
                        <p className="text-[11px] text-muted-foreground mt-1 line-clamp-3">{e.notes}</p>
                      ) : null}
                    </li>
                  ))
                )}
              </ul>
            </div>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
        <Card className="rounded-none border-border">
          <CardHeader className="border-b border-border/80">
            <CardTitle className="text-base font-light tracking-tight">Add to schedule</CardTitle>
            <CardDescription>Pick a date in the visible week or any day you need.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={onAdd} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sch-date">Date</Label>
                  <Input
                    id="sch-date"
                    name="date"
                    type="date"
                    required
                    defaultValue={today}
                    className="rounded-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sch-time">Time</Label>
                  <Input id="sch-time" name="time" type="time" required className="rounded-none" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sch-title">Title</Label>
                <Input
                  id="sch-title"
                  name="title"
                  placeholder="e.g. Upper body · Easy run"
                  required
                  className="rounded-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sch-notes">Notes (optional)</Label>
                <Textarea
                  id="sch-notes"
                  name="notes"
                  rows={2}
                  placeholder="Warm-up, location, equipment…"
                  className="rounded-none resize-y min-h-[72px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sch-workout">Catalog workout (optional)</Label>
                <select
                  id="sch-workout"
                  name="workoutId"
                  className="flex h-10 w-full border border-input bg-background px-3 py-2 text-sm rounded-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  defaultValue=""
                >
                  <option value="">None — custom only</option>
                  {WORKOUT_CATALOG.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>
              <Button type="submit" className="rounded-none w-full sm:w-auto">
                Add entry
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed border border-border p-5 md:p-6 bg-muted/20">
          <p>
            Use the week controls to plan ahead. Entries are sorted by time within each day. Removing
            an item only affects the schedule — not completed workout history.
          </p>
          <Separator className="bg-border" />
          <p className="text-xs">
            Tip: link a catalog workout to open its detail page with steps and demo logging.
          </p>
        </div>
      </div>
    </div>
  )
}
