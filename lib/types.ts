// User profile types
export interface UserProfile {
  id: number
  userId: string
  height: number | null
  currentWeight: number | null
  targetWeight: number | null
  gender: string | null
  waterGoal: number
  createdAt: Date
  updatedAt: Date
}

// Nutrition log types
export interface NutritionLog {
  id: number
  userId: string
  date: string
  calories: number
  protein: number
  carbs: number
  fat: number
  createdAt: Date
}

// Water log types
export interface WaterLog {
  id: number
  userId: string
  date: string
  glasses: number
  createdAt: Date
}

// Exercise log types
export interface ExerciseLog {
  id: number
  userId: string
  date: string
  exerciseName: string
  duration: number
  caloriesBurned: number | null
  createdAt: Date
}

// Step log types
export interface StepLog {
  id: number
  userId: string
  date: string
  steps: number
  createdAt: Date
}

// Weight log types
export interface WeightLog {
  id: number
  userId: string
  date: string
  weight: number
  createdAt: Date
}

// Achievement types
export interface Achievement {
  id: number
  name: string
  description: string
  icon: string | null
  createdAt: Date
}

// User achievement types
export interface UserAchievement {
  id: number
  userId: string
  achievementId: number
  completed: boolean
  completedAt: Date | null
  createdAt: Date
  achievement?: Achievement
}

// User goal types
export interface UserGoal {
  id: number
  userId: string
  goalType: string
  targetValue: number
  startDate: string
  targetDate: string | null
  completed: boolean
  createdAt: Date
}

// Daily summary for dashboard
export interface DailySummary {
  calories: number
  caloriesGoal: number
  protein: number
  proteinGoal: number
  carbs: number
  carbsGoal: number
  fat: number
  fatGoal: number
  water: number
  waterGoal: number
  steps: number
  stepsGoal: number
  exerciseCalories: number
}
