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

    // Get nutrition logs for the specified date
    const nutritionLogs = await sql`
      SELECT * FROM nutrition_logs 
      WHERE user_id = ${userId} AND date = ${date}
      ORDER BY created_at DESC
    `

    return NextResponse.json(nutritionLogs)
  } catch (error) {
    console.error("Error fetching nutrition logs:", error)
    return NextResponse.json({ error: "Failed to fetch nutrition logs" }, { status: 500 })
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

    const { date = getTodayFormatted(), calories, protein, carbs, fat } = data

    // Create new nutrition log
    const result = await sql`
      INSERT INTO nutrition_logs (user_id, date, calories, protein, carbs, fat)
      VALUES (${userId}, ${date}, ${calories}, ${protein}, ${carbs}, ${fat})
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating nutrition log:", error)
    return NextResponse.json({ error: "Failed to create nutrition log" }, { status: 500 })
  }
}
