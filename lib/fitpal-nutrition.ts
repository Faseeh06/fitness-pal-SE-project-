/** Demo nutrition logging — localStorage only. */

export type MealType = "breakfast" | "lunch" | "dinner" | "snack"

export type MealDefinition = {
  id: string
  name: string
  calories: number
  type: MealType
}

export const MEAL_CATALOG: MealDefinition[] = [
  { id: "oats-berry", name: "Oats with berries", calories: 320, type: "breakfast" },
  { id: "eggs-toast", name: "Eggs & wholegrain toast", calories: 380, type: "breakfast" },
  { id: "yogurt-granola", name: "Greek yogurt & granola", calories: 290, type: "breakfast" },
  { id: "smoothie-green", name: "Green protein smoothie", calories: 260, type: "breakfast" },
  { id: "chicken-rice", name: "Chicken bowl & rice", calories: 520, type: "lunch" },
  { id: "salmon-salad", name: "Salmon salad", calories: 440, type: "lunch" },
  { id: "turkey-wrap", name: "Turkey wholemeal wrap", calories: 410, type: "lunch" },
  { id: "lentil-soup", name: "Lentil soup & bread", calories: 360, type: "lunch" },
  { id: "steak-veg", name: "Steak & roasted vegetables", calories: 620, type: "dinner" },
  { id: "pasta-primavera", name: "Pasta primavera", calories: 540, type: "dinner" },
  { id: "tofu-stirfry", name: "Tofu stir-fry & rice", calories: 480, type: "dinner" },
  { id: "fish-tacos", name: "Grilled fish tacos", calories: 450, type: "dinner" },
  { id: "apple-nuts", name: "Apple & mixed nuts", calories: 180, type: "snack" },
  { id: "protein-bar", name: "Protein bar", calories: 200, type: "snack" },
  { id: "rice-cakes", name: "Rice cakes & hummus", calories: 160, type: "snack" },
  { id: "cottage-fruit", name: "Cottage cheese & fruit", calories: 220, type: "snack" },
]

export type MealPlan = {
  id: string
  name: string
  description: string
  mealIds: string[]
}

export const MEAL_PLANS: MealPlan[] = [
  {
    id: "balanced",
    name: "Balanced training day",
    description: "Moderate carbs and protein spread across the day.",
    mealIds: ["oats-berry", "chicken-rice", "tofu-stirfry", "apple-nuts"],
  },
  {
    id: "high-protein",
    name: "Higher protein",
    description: "Extra protein for recovery-focused days.",
    mealIds: ["eggs-toast", "salmon-salad", "steak-veg", "cottage-fruit", "protein-bar"],
  },
  {
    id: "light-day",
    name: "Lighter day",
    description: "Lower density — good with a short workout or rest.",
    mealIds: ["smoothie-green", "lentil-soup", "fish-tacos", "rice-cakes"],
  },
]

export type NutritionLogEntry = {
  id: string
  mealId: string
  name: string
  calories: number
  type: MealType
  loggedAt: string
}

const nutritionKey = (userId: string) => `fitpal_nutrition_${userId}`

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
  return MEAL_CATALOG.find((m) => m.id === id) ?? null
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

export function removeEntryFromDay(userId: string, day: string, entryId: string) {
  const map = readMap(userId)
  if (!map[day]) return
  map[day] = map[day].filter((e) => e.id !== entryId)
  if (map[day].length === 0) delete map[day]
  writeMap(userId, map)
}

export function applyMealPlanToDay(userId: string, day: string, planId: string): number {
  const plan = MEAL_PLANS.find((p) => p.id === planId)
  if (!plan) return 0
  let added = 0
  for (const mealId of plan.mealIds) {
    if (addMealToDay(userId, day, mealId)) added += 1
  }
  return added
}
