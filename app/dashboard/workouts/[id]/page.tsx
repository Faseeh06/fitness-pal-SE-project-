"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

import { useDashboardUser } from "@/components/dashboard/dashboard-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { addWorkoutSession, getWorkoutById } from "@/lib/fitpal-workouts"

export default function WorkoutDetailPage() {
  const params = useParams()
  const router = useRouter()
  const user = useDashboardUser()
  const id = typeof params.id === "string" ? params.id : params.id?.[0] ?? ""

  const workout = useMemo(() => getWorkoutById(id), [id])
  const [duration, setDuration] = useState(30)
  const [calories, setCalories] = useState(200)
  const [started, setStarted] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!workout) return
    setDuration(workout.defaultDurationMinutes)
    setCalories(workout.defaultCaloriesBurned)
    setStarted(false)
    setSaved(false)
  }, [workout])

  if (!user) return null

  if (!workout) {
    return (
      <div>
        <h1 className="text-2xl font-light tracking-tight mb-4">Workout not found</h1>
        <Button asChild variant="outline" className="rounded-none">
          <Link href="/dashboard/workouts">Back to workouts</Link>
        </Button>
      </div>
    )
  }

  function handleStart() {
    setStarted(true)
    setSaved(false)
  }

  function handleComplete(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    addWorkoutSession(user.id, {
      workoutId: workout.id,
      durationMinutes: duration,
      caloriesBurned: calories,
    })
    setSaved(true)
    router.refresh()
  }

  return (
    <div>
      <p className="text-[11px] tracking-[0.3em] uppercase text-muted-foreground mb-3">
        Workout
      </p>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <h1 className="text-3xl md:text-4xl font-extralight tracking-tight">{workout.name}</h1>
        <Badge variant="outline" className="rounded-none text-[10px] uppercase tracking-wide">
          {workout.category}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">{workout.description}</p>

      <Separator className="my-10" />

      <div className="max-w-md space-y-8">
        <div>
          <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-3">
            Session
          </p>
          {!started ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                When you are ready, start the session. Adjust duration and calories before marking
                complete to match what you actually did.
              </p>
              <Button type="button" className="rounded-none" onClick={handleStart}>
                Start workout
              </Button>
            </div>
          ) : (
            <form onSubmit={handleComplete} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  min={1}
                  className="rounded-none"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="calories">Calories burned (estimate)</Label>
                <Input
                  id="calories"
                  type="number"
                  min={0}
                  className="rounded-none"
                  value={calories}
                  onChange={(e) => setCalories(Number(e.target.value))}
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <Button type="submit" className="rounded-none">
                  Mark as completed
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-none"
                  onClick={() => setStarted(false)}
                >
                  Cancel
                </Button>
              </div>
              {saved ? (
                <p className="text-sm text-foreground bg-secondary border border-border px-3 py-2">
                  Saved to history. Your dashboard stats will update with this session.
                </p>
              ) : null}
            </form>
          )}
        </div>

        <div className="flex flex-wrap gap-3 pt-4">
          <Button asChild variant="ghost" className="rounded-none px-0 text-muted-foreground">
            <Link href="/dashboard/workouts">← All workouts</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
