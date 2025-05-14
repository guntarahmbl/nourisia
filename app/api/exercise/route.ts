import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { sql, getTodayFormatted } from "@/lib/db"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const userId = session.user.id
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date") || getTodayFormatted()

    // Get exercise logs for the specified date
    const exerciseLogs = await sql`
      SELECT * FROM exercise_logs 
      WHERE user_id = ${userId} AND date = ${date}
      ORDER BY created_at DESC
    `

    return NextResponse.json(exerciseLogs)
  } catch (error) {
    console.error("Error fetching exercise logs:", error)
    return NextResponse.json({ error: "Failed to fetch exercise logs" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const userId = session.user.id
    const data = await request.json()

    const { date = getTodayFormatted(), exerciseName, duration, caloriesBurned } = data

    // Create new exercise log
    const result = await sql`
      INSERT INTO exercise_logs (user_id, date, exercise_name, duration, calories_burned)
      VALUES (${userId}, ${date}, ${exerciseName}, ${duration}, ${caloriesBurned})
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating exercise log:", error)
    return NextResponse.json({ error: "Failed to create exercise log" }, { status: 500 })
  }
}
