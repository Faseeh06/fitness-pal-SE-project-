/** Rule-based “AI” suggestions — no model, matches Readme behavior. */

export type FitnessGoalKey = "weight_loss" | "muscle_gain" | "maintain"

export const FITNESS_GOAL_LABEL: Record<FitnessGoalKey, string> = {
  weight_loss: "Weight loss",
  muscle_gain: "Muscle gain",
  maintain: "Maintain / general",
}

export function parseGoalFromProfile(goal: string | undefined): FitnessGoalKey {
  const g = (goal ?? "").toLowerCase().trim()
  if (g === "muscle_gain" || g === "muscle gain" || g === "strength") return "muscle_gain"
  if (g === "weight_loss" || g === "weight loss" || g === "fat loss") return "weight_loss"
  return "maintain"
}

export type AiSuggestionPack = {
  headline: string
  workouts: string[]
  meals: string[]
  targets: { label: string; value: string }[]
  notes: string
}

export function getSuggestionPack(goal: FitnessGoalKey): AiSuggestionPack {
  if (goal === "weight_loss") {
    return {
      headline: "Calorie-aware cardio with lighter plates",
      workouts: [
        "3–4× weekly: easy runs, incline walks, or rowing — 30–45 min at conversational pace.",
        "1–2× weekly: short HIIT (20–25 min) after a solid warm-up.",
        "Keep 1–2 strength sessions for muscle retention — full-body or upper/lower split, moderate load.",
      ],
      meals: [
        "Prioritize protein at each meal; fill half the plate with vegetables.",
        "Favor high-volume, lower-calorie options: soups, salads, lean proteins, whole grains.",
        "Pre-plan snacks (fruit + yogurt, cottage cheese) to avoid impulse calories.",
      ],
      targets: [
        { label: "Steps (demo target)", value: "8,000–10,000 / day" },
        { label: "Protein", value: "~1.6–2 g/kg body weight if training" },
        { label: "Hydration", value: "2.5 L+ water; more on training days" },
        { label: "Deficit", value: "Moderate; avoid aggressive daily cuts" },
      ],
      notes:
        "This is a fixed rule set for the course demo — not medical advice. Adjust with a coach or clinician for real programs.",
    }
  }
  if (goal === "muscle_gain") {
    return {
      headline: "Strength-first training with protein-forward nutrition",
      workouts: [
        "3–4× weekly: compound lifts — squat, hinge, press, row — progressive overload over weeks.",
        "Limit excessive cardio; 1–2 short conditioning sessions for heart health.",
        "Rest days matter — schedule deloads when joints or sleep suffer.",
      ],
      meals: [
        "Lean protein every meal: chicken, fish, eggs, Greek yogurt, legumes, tofu.",
        "Carbs around training: rice, potatoes, oats, fruit to fuel sessions.",
        "Small calorie surplus only if weight is trending up slowly with strength gains.",
      ],
      targets: [
        { label: "Strength sessions", value: "3–4 / week" },
        { label: "Protein", value: "~1.8–2.2 g/kg if hypertrophy focus" },
        { label: "Sleep", value: "7–9 h for recovery (demo reminder)" },
        { label: "Hydration", value: "2.5–3 L on training days" },
      ],
      notes:
        "Rule-based template aligned with your “muscle gain” profile goal. Tune volume to your recovery.",
    }
  }
  return {
    headline: "Balanced movement and steady habits",
    workouts: [
      "Mix 2× cardio + 2× strength weekly, or 3 full-body sessions combining both.",
      "Add a mobility or walk on rest days.",
      "Log workouts in FitPal so Progress charts stay meaningful.",
    ],
    meals: [
      "Half plate plants, quarter lean protein, quarter whole grains most meals.",
      "Keep regular meal times; avoid skipping pre/post workout fuel when training hard.",
    ],
    targets: [
      { label: "Steps", value: "7,000–9,000 / day baseline" },
      { label: "Hydration", value: "2.5 L / day (adjust in Hydration module)" },
      { label: "Check-ins", value: "Weekly weight or tape measure if tracking composition" },
    ],
    notes: "General maintenance template — set a specific goal in Profile for sharper AI-style tips.",
  }
}
