import { db } from "./db"

/** Body weight log (kg) — localStorage. */

const weightKey = (userId: string) => db.user.keys.weight(userId)


type DayMap = Record<string, number>

function readMap(userId: string): DayMap {
  if (typeof window === "undefined") return {}
  try {
    const raw = window.localStorage.getItem(weightKey(userId))
    if (!raw) return {}
    const parsed = JSON.parse(raw) as DayMap
    return parsed && typeof parsed === "object" ? parsed : {}
  } catch {
    return {}
  }
}

function writeMap(userId: string, map: DayMap) {
  window.localStorage.setItem(weightKey(userId), JSON.stringify(map))
}

export function getWeightKgForDay(userId: string, day: string): number | null {
  const map = readMap(userId)
  const v = map[day]
  return typeof v === "number" && v > 0 ? v : null
}

export function setWeightKgForDay(userId: string, day: string, kg: number) {
  const map = readMap(userId)
  const v = Math.round(kg * 10) / 10
  if (!Number.isFinite(v) || v < 20 || v > 300) return
  map[day] = v
  writeMap(userId, map)
}

export function clearWeightForDay(userId: string, day: string) {
  const map = readMap(userId)
  delete map[day]
  writeMap(userId, map)
}

/** Last N local calendar days ending at `reference`, each with weight or null. */
export function getWeightSeries(
  userId: string,
  days: number,
  reference = new Date(),
): { day: string; label: string; weightKg: number | null }[] {
  const map = readMap(userId)
  const out: { day: string; label: string; weightKg: number | null }[] = []
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(reference)
    d.setDate(reference.getDate() - i)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, "0")
    const dayNum = String(d.getDate()).padStart(2, "0")
    const day = `${y}-${m}-${dayNum}`
    const w = map[day]
    out.push({
      day,
      label: `${m}-${dayNum}`,
      weightKg: typeof w === "number" && w > 0 ? w : null,
    })
  }
  return out
}
export function getLatestWeightKg(userId: string): number | null {
  const map = readMap(userId)
  const entries = Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]))
  return entries[0] ? entries[0][1] : null
}
