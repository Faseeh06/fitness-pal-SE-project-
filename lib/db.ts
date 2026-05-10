import workoutData from "@/data/workouts.json"
import nutritionData from "@/data/nutrition.json"
import { WorkoutDefinition } from "./fitpal-workouts"
import { MealDefinition, MealPlan } from "./fitpal-nutrition"

/**
 * Mock Database Interface
 * 
 * This file serves as the central Data Access Layer (DAL) for the application.
 * Currently, it loads data from static JSON files and provides a clean API
 * for the rest of the application. 
 * 
 * To migrate to a real database (e.g., PostgreSQL, MongoDB, Firebase):
 * 1. Replace the JSON imports with database client calls.
 * 2. Update the async nature of these functions if necessary.
 */

export const db = {
  /**
   * Catalog Data (Static/Global)
   */
  workouts: {
    getAll: (): WorkoutDefinition[] => workoutData as WorkoutDefinition[],
    getById: (id: string): WorkoutDefinition | null => 
      (workoutData as WorkoutDefinition[]).find(w => w.id === id) || null,
  },

  nutrition: {
    getMeals: (): MealDefinition[] => nutritionData.meals as MealDefinition[],
    getMealById: (id: string): MealDefinition | null => 
      (nutritionData.meals as MealDefinition[]).find(m => m.id === id) || null,
    getPlans: (): MealPlan[] => nutritionData.plans as MealPlan[],
    getPlanById: (id: string): MealPlan | null => 
      (nutritionData.plans as MealPlan[]).find(p => p.id === id) || null,
  },

  /**
   * User Data (Currently in localStorage, accessed via keys)
   * This structure prepares the app for a database where these would be tables/collections.
   */
  user: {
    // Keys for localStorage to maintain consistency
    keys: {
      steps: "fitpal_daily_steps",
      sessions: (userId: string) => `fitpal_workout_sessions_${userId}`,
      nutrition: (userId: string) => `fitpal_nutrition_${userId}`,
      schedule: (userId: string) => `fitpal_schedule_${userId}`,
      weight: (userId: string) => `fitpal_weight_${userId}`,
      weightHistory: (userId: string) => `fitpal_weight_history_${userId}`,
      hydration: (userId: string) => `fitpal_hydration_${userId}`,
      hydrationGoal: (userId: string) => `fitpal_hydration_goal_${userId}`,
      profile: (userId: string) => `fitpal_profile_${userId}`,
      users: "fitpal_users",
      session: "fitpal_session",
    }
  }
}
