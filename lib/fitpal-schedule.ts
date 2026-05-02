import { formatLocalDay } from "@/lib/fitpal-workouts"

export type ScheduleEntry = {
  id: string
  date: string
  /** 24h "HH:MM" for sorting and display */
  time: string
  title: string
  notes?: string
  /** Optional link to a catalog workout */
  workoutId?: string
}

const scheduleKey = (userId: string) => `fitpal_schedule_${userId}`

function readList(userId: string): ScheduleEntry[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(scheduleKey(userId))
    if (!raw) return []
    const parsed = JSON.parse(raw) as ScheduleEntry[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeList(userId: string, list: ScheduleEntry[]) {
  window.localStorage.setItem(scheduleKey(userId), JSON.stringify(list))
}

function newId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID()
  return `sch_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

/** Normalise "H:MM" or "HH:MM" to zero-padded 24h; invalid input defaults to 09:00. */
export function normalizeScheduleTime(input: string): string {
  const m = /^(\d{1,2}):(\d{2})$/.exec(input.trim())
  if (!m) return "09:00"
  const h = Math.min(23, Math.max(0, parseInt(m[1], 10)))
  const min = Math.min(59, Math.max(0, parseInt(m[2], 10)))
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`
}

export function getScheduleEntries(userId: string): ScheduleEntry[] {
  return readList(userId).sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date)
    return a.time.localeCompare(b.time)
  })
}

export function getEntriesForDate(userId: string, date: string): ScheduleEntry[] {
  return getScheduleEntries(userId).filter((e) => e.date === date)
}

/** Monday-start week dates (7 strings) that contain `reference`. */
export function getWeekDayKeys(reference = new Date()): string[] {
  const d = new Date(reference)
  const dow = d.getDay()
  const mondayOffset = dow === 0 ? -6 : 1 - dow
  const monday = new Date(d)
  monday.setDate(d.getDate() + mondayOffset)
  const days: string[] = []
  for (let i = 0; i < 7; i++) {
    const x = new Date(monday)
    x.setDate(monday.getDate() + i)
    days.push(formatLocalDay(x))
  }
  return days
}

export function addScheduleEntry(
  userId: string,
  input: {
    date: string
    time: string
    title: string
    notes?: string
    workoutId?: string
  },
): ScheduleEntry {
  const list = readList(userId)
  const entry: ScheduleEntry = {
    id: newId(),
    date: input.date.trim(),
    time: normalizeScheduleTime(input.time),
    title: input.title.trim(),
    notes: input.notes?.trim() || undefined,
    workoutId: input.workoutId?.trim() || undefined,
  }
  list.push(entry)
  writeList(userId, list)
  return entry
}

export function removeScheduleEntry(userId: string, entryId: string) {
  const list = readList(userId).filter((e) => e.id !== entryId)
  writeList(userId, list)
}
