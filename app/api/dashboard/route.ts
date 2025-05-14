import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { sql, getTodayFormatted, parseNumeric } from "@/lib/db"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import type { DailySummary } from "@/lib/types"

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const userId = session.user.id
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date") || getTodayFormatted()

    // Get user profile for goals
    const profileResult = await sql`
      SELECT * FROM user_profiles WHERE user_id = ${userId}
    `

    const profile = profileResult[0] || { water_goal: 8 }

    // Get nutrition logs for the day
    const nutritionResult = await sql`
      SELECT 
        SUM(calories) as total_calories,
        SUM(protein) as total_protein,
        SUM(carbs) as total_carbs,
        SUM(fat) as total_fat
      FROM nutrition_logs 
      WHERE user_id = ${userId} AND date = ${date}
    `

    // Get water intake for the day
    const waterResult = await sql`
      SELECT glasses FROM water_logs 
      WHERE user_id = ${userId} AND date = ${date}
      ORDER BY created_at DESC
      LIMIT 1
    `

    // Get steps for the day
    const stepsResult = await sql`
      SELECT steps FROM step_logs 
      WHERE user_id = ${userId} AND date = ${date}
      ORDER BY created_at DESC
      LIMIT 1
    `

    // Get exercise calories for the day
    const exerciseResult = await sql`
      SELECT SUM(calories_burned) as total_exercise_calories
      FROM exercise_logs 
      WHERE user_id = ${userId} AND date = ${date}
    `

    // Default goals
    const caloriesGoal = 2000
    const proteinGoal = 120
    const carbsGoal = 200
    const fatGoal = 65
    const stepsGoal = 10000

    // Compile daily summary
    const summary: DailySummary = {
      calories: parseNumeric(nutritionResult[0]?.total_calories),
      caloriesGoal,
      protein: parseNumeric(nutritionResult[0]?.total_protein),
      proteinGoal,
      carbs: parseNumeric(nutritionResult[0]?.total_carbs),
      carbsGoal,
      fat: parseNumeric(nutritionResult[0]?.total_fat),
      fatGoal,
      water: waterResult[0]?.glasses || 0,
      waterGoal: profile.water_goal,
      steps: stepsResult[0]?.steps || 0,
      stepsGoal,
      exerciseCalories: parseNumeric(exerciseResult[0]?.total_exercise_calories),
    }

    return NextResponse.json(summary)
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}
