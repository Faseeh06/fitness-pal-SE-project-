/** Demo hydration — millilitres (ml) in localStorage. */

export const DEFAULT_DAILY_GOAL_ML = 2500

const hydrationKey = (userId: string) => `fitpal_hydration_${userId}`

type DayMap = Record<string, number>

function readMap(userId: string): DayMap {
  if (typeof window === "undefined") return {}
  try {
    const raw = window.localStorage.getItem(hydrationKey(userId))
    if (!raw) return {}
    const parsed = JSON.parse(raw) as DayMap
    return parsed && typeof parsed === "object" ? parsed : {}
  } catch {
    return {}
  }
}

function writeMap(userId: string, map: DayMap) {
  window.localStorage.setItem(hydrationKey(userId), JSON.stringify(map))
}

export function getWaterMlForDay(userId: string, day: string): number {
  const map = readMap(userId)
  return Math.max(0, Math.round(map[day] ?? 0))
}

export function addWaterMl(userId: string, day: string, ml: number) {
  const delta = Math.max(0, Math.round(ml))
  if (delta === 0) return
  const map = readMap(userId)
  map[day] = (map[day] ?? 0) + delta
  writeMap(userId, map)
}

export function setWaterMlForDay(userId: string, day: string, totalMl: number) {
  const map = readMap(userId)
  const v = Math.max(0, Math.round(totalMl))
  if (v === 0) delete map[day]
  else map[day] = v
  writeMap(userId, map)
}

export function getHydrationGoalMl(userId: string): number {
  if (typeof window === "undefined") return DEFAULT_DAILY_GOAL_ML
  try {
    const raw = window.localStorage.getItem(`fitpal_hydration_goal_${userId}`)
    if (!raw) return DEFAULT_DAILY_GOAL_ML
    const n = Number.parseInt(raw, 10)
    return Number.isFinite(n) && n >= 500 && n <= 8000 ? n : DEFAULT_DAILY_GOAL_ML
  } catch {
    return DEFAULT_DAILY_GOAL_ML
  }
}

export function setHydrationGoalMl(userId: string, ml: number) {
  const v = Math.max(500, Math.min(8000, Math.round(ml)))
  window.localStorage.setItem(`fitpal_hydration_goal_${userId}`, String(v))
}
