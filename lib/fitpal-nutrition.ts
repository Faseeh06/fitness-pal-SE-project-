import { db } from "./db"

/** Demo nutrition logging — localStorage only. */

export type MealType = "breakfast" | "lunch" | "dinner" | "snack"

export type MealDefinition = {
  id: string
  name: string
  calories: number
  type: MealType
}

export type MealPlan = {
  id: string
  name: string
  description: string
  mealIds: string[]
}


export type NutritionLogEntry = {
  id: string
  mealId: string
  name: string
  calories: number
  type: MealType
  loggedAt: string
}

const nutritionKey = (userId: string) => db.user.keys.nutrition(userId)


type DayMap = Record<string, NutritionLogEntry[]>

function readMap(userId: string): DayMap {
  if (typeof window === "undefined") return {}
  try {
    const raw = window.localStorage.getItem(nutritionKey(userId))
    if (!raw) return {}
    const parsed = JSON.parse(raw) as DayMap
    return parsed && typeof parsed === "object" ? parsed : {}
  } catch {
    return {}
  }
}

function writeMap(userId: string, map: DayMap) {
  window.localStorage.setItem(nutritionKey(userId), JSON.stringify(map))
}

function newEntryId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID()
  return `ne_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

export function getMealById(id: string) {
  return db.nutrition.getMealById(id)
}


export function getEntriesForDay(userId: string, day: string): NutritionLogEntry[] {
  const map = readMap(userId)
  return [...(map[day] ?? [])].sort(
    (a, b) => new Date(a.loggedAt).getTime() - new Date(b.loggedAt).getTime(),
  )
}

export function getCaloriesConsumedForDay(userId: string, day: string): number {
  return getEntriesForDay(userId, day).reduce((acc, e) => acc + e.calories, 0)
}

export function addMealToDay(userId: string, day: string, mealId: string): NutritionLogEntry | null {
  const meal = getMealById(mealId)
  if (!meal) return null
  const map = readMap(userId)
  if (!map[day]) map[day] = []
  const entry: NutritionLogEntry = {
    id: newEntryId(),
    mealId: meal.id,
    name: meal.name,
    calories: meal.calories,
    type: meal.type,
    loggedAt: new Date().toISOString(),
  }
  map[day].push(entry)
  writeMap(userId, map)
  return entry
}

export function clearDayNutrition(userId: string, day: string) {
  const map = readMap(userId)
  delete map[day]
  writeMap(userId, map)
}

export function removeEntryFromDay(userId: string, day: string, entryId: string) {
  const map = readMap(userId)
  if (!map[day]) return
  map[day] = map[day].filter((e) => e.id !== entryId)
  if (map[day].length === 0) delete map[day]
  writeMap(userId, map)
}

export function applyMealPlanToDay(userId: string, day: string, planId: string): number {
  const plan = db.nutrition.getPlanById(planId)

  if (!plan) return 0
  let added = 0
  for (const mealId of plan.mealIds) {
    if (addMealToDay(userId, day, mealId)) added += 1
  }
  return added
}
