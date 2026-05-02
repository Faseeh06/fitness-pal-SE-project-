import { DEMO_CREDENTIALS } from "@/lib/fitpal-auth"

export type WorkoutCategory = "cardio" | "strength"

export type WorkoutDefinition = {
  id: string
  name: string
  category: WorkoutCategory
  description: string
  defaultDurationMinutes: number
  defaultCaloriesBurned: number
  /** Cover image for cards and detail hero (Unsplash). */
  imageUrl: string
}

/** Stable Unsplash URLs (`auto=format` helps avoid broken loads across environments). */
const u = (photoId: string, w: number) =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${w}&q=82`

export const WORKOUT_CATALOG: WorkoutDefinition[] = [
  {
    id: "run-easy",
    name: "Easy run",
    category: "cardio",
    description: "Steady aerobic pace — conversational intensity.",
    defaultDurationMinutes: 30,
    defaultCaloriesBurned: 280,
    imageUrl: u("photo-1571019614242-c5c5dee9f50b", 1200),
  },
  {
    id: "hiit-core",
    name: "HIIT core circuit",
    category: "cardio",
    description: "Short work intervals with brief recovery windows.",
    defaultDurationMinutes: 25,
    defaultCaloriesBurned: 320,
    imageUrl: u("photo-1517836357463-d25dfeac3438", 1200),
  },
  {
    id: "row-steady",
    name: "Rowing endurance",
    category: "cardio",
    description: "Consistent stroke rate and even splits.",
    defaultDurationMinutes: 35,
    defaultCaloriesBurned: 300,
    imageUrl: u("photo-1576678927484-cc907957088c", 1200),
  },
  {
    id: "upper-push",
    name: "Upper push strength",
    category: "strength",
    description: "Pressing patterns with controlled tempo.",
    defaultDurationMinutes: 45,
    defaultCaloriesBurned: 220,
    imageUrl: u("photo-1581009146145-b5ef050c2e1e", 1200),
  },
  {
    id: "lower-compound",
    name: "Lower-body compound",
    category: "strength",
    description: "Squat and hinge emphasis — full range.",
    defaultDurationMinutes: 50,
    defaultCaloriesBurned: 260,
    imageUrl: u("photo-1434682881908-b43fa046c57b", 1200),
  },
  {
    id: "full-body",
    name: "Full-body basics",
    category: "strength",
    description: "Compound lifts covering major patterns.",
    defaultDurationMinutes: 40,
    defaultCaloriesBurned: 240,
    imageUrl: u("photo-1534438327276-14e5300c3a48", 1200),
  },
]

export type CompletedWorkoutSession = {
  id: string
  workoutId: string
  completedAt: string
  durationMinutes: number
  caloriesBurned: number
}

const STEPS_KEY = "fitpal_daily_steps"

type StepsByUser = Record<string, Record<string, number>>

function readStepsStore(): StepsByUser {
  if (typeof window === "undefined") return {}
  try {
    const raw = window.localStorage.getItem(STEPS_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as StepsByUser
    return parsed && typeof parsed === "object" ? parsed : {}
  } catch {
    return {}
  }
}

function writeStepsStore(store: StepsByUser) {
  window.localStorage.setItem(STEPS_KEY, JSON.stringify(store))
}

function addStepsForDay(userId: string, day: string, delta: number) {
  const store = readStepsStore()
  if (!store[userId]) store[userId] = {}
  store[userId][day] = (store[userId][day] ?? 0) + delta
  writeStepsStore(store)
}

export function getStepsForDay(userId: string, day: string): number {
  const store = readStepsStore()
  return store[userId]?.[day] ?? 0
}

function sessionsStorageKey(userId: string) {
  return `fitpal_workout_sessions_${userId}`
}

function readSessionsRaw(userId: string): CompletedWorkoutSession[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(sessionsStorageKey(userId))
    if (!raw) return []
    const parsed = JSON.parse(raw) as CompletedWorkoutSession[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeSessionsRaw(userId: string, sessions: CompletedWorkoutSession[]) {
  window.localStorage.setItem(sessionsStorageKey(userId), JSON.stringify(sessions))
}

export function getWorkoutById(id: string) {
  return WORKOUT_CATALOG.find((w) => w.id === id) ?? null
}

export function getWorkoutsByCategory(category: WorkoutCategory) {
  return WORKOUT_CATALOG.filter((w) => w.category === category)
}

export function getWorkoutSessions(userId: string): CompletedWorkoutSession[] {
  return readSessionsRaw(userId).sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
  )
}

function newSessionId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID()
  return `ws_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

/** Local calendar day `YYYY-MM-DD` (not UTC). */
export function formatLocalDay(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

export function addWorkoutSession(
  userId: string,
  input: { workoutId: string; durationMinutes: number; caloriesBurned: number },
): CompletedWorkoutSession {
  const sessions = readSessionsRaw(userId)
  const completedAt = new Date().toISOString()
  const row: CompletedWorkoutSession = {
    id: newSessionId(),
    workoutId: input.workoutId,
    completedAt,
    durationMinutes: Math.max(1, Math.round(input.durationMinutes)),
    caloriesBurned: Math.max(0, Math.round(input.caloriesBurned)),
  }
  sessions.unshift(row)
  writeSessionsRaw(userId, sessions)
  const day = formatLocalDay(new Date(completedAt))
  addStepsForDay(userId, day, Math.round(row.durationMinutes * 72))
  return row
}

export function caloriesBurnedOnLocalDay(userId: string, day: string) {
  return getWorkoutSessions(userId)
    .filter((s) => formatLocalDay(new Date(s.completedAt)) === day)
    .reduce((acc, s) => acc + s.caloriesBurned, 0)
}

export type WeekSummary = {
  days: { day: string; caloriesBurned: number; steps: number }[]
  totalCaloriesBurned: number
  totalSteps: number
  workoutsCompleted: number
}

export function getWeekSummary(userId: string, reference = new Date()): WeekSummary {
  const days: WeekSummary["days"] = []
  let totalCaloriesBurned = 0
  let totalSteps = 0
  let workoutsCompleted = 0

  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date(reference)
    d.setDate(reference.getDate() - i)
    const day = formatLocalDay(d)
    const burned = caloriesBurnedOnLocalDay(userId, day)
    const steps = getStepsForDay(userId, day)
    const count = getWorkoutSessions(userId).filter(
      (s) => formatLocalDay(new Date(s.completedAt)) === day,
    ).length
    days.push({ day, caloriesBurned: burned, steps })
    totalCaloriesBurned += burned
    totalSteps += steps
    workoutsCompleted += count
  }

  return { days, totalCaloriesBurned, totalSteps, workoutsCompleted }
}

/** Sample history + baseline steps for the seeded demo account only. */
export function bootstrapDemoFitnessData(userId: string) {
  if (typeof window === "undefined") return
  if (userId !== DEMO_CREDENTIALS.id) return
  if (readSessionsRaw(userId).length > 0) return

  const now = new Date()
  const d1 = new Date(now)
  d1.setDate(now.getDate() - 1)
  const d2 = new Date(now)
  d2.setDate(now.getDate() - 3)

  const sessions: CompletedWorkoutSession[] = [
    {
      id: "seed-1",
      workoutId: "run-easy",
      completedAt: d1.toISOString(),
      durationMinutes: 28,
      caloriesBurned: 265,
    },
    {
      id: "seed-2",
      workoutId: "lower-compound",
      completedAt: d2.toISOString(),
      durationMinutes: 48,
      caloriesBurned: 255,
    },
  ]
  writeSessionsRaw(userId, sessions)

  const dayToday = formatLocalDay(now)
  const dayD1 = formatLocalDay(d1)
  const dayD2 = formatLocalDay(d2)
  addStepsForDay(userId, dayToday, 8200)
  addStepsForDay(userId, dayD1, 9100)
  addStepsForDay(userId, dayD2, 7800)
  addStepsForDay(userId, dayD1, Math.round(28 * 72))
  addStepsForDay(userId, dayD2, Math.round(48 * 72))
}
