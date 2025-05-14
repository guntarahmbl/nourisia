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
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    // Get weight logs
    const weightLogs = await sql`
      SELECT * FROM weight_logs 
      WHERE user_id = ${userId}
      ORDER BY date DESC
      LIMIT ${limit}
    `

    return NextResponse.json(weightLogs)
  } catch (error) {
    console.error("Error fetching weight logs:", error)
    return NextResponse.json({ error: "Failed to fetch weight logs" }, { status: 500 })
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

    const { date = getTodayFormatted(), weight } = data

    // Create new weight log
    const result = await sql`
      INSERT INTO weight_logs (user_id, date, weight)
      VALUES (${userId}, ${date}, ${weight})
      RETURNING *
    `

    // Also update the current weight in user profile
    await sql`
      UPDATE user_profiles
      SET current_weight = ${weight}, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ${userId}
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating weight log:", error)
    return NextResponse.json({ error: "Failed to create weight log" }, { status: 500 })
  }
}
