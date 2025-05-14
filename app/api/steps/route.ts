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

    // Get steps log for the specified date
    const stepsLog = await sql`
      SELECT * FROM step_logs 
      WHERE user_id = ${userId} AND date = ${date}
      ORDER BY created_at DESC
      LIMIT 1
    `

    if (stepsLog.length === 0) {
      return NextResponse.json({ steps: 0, date })
    }

    return NextResponse.json(stepsLog[0])
  } catch (error) {
    console.error("Error fetching steps log:", error)
    return NextResponse.json({ error: "Failed to fetch steps log" }, { status: 500 })
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

    const { date = getTodayFormatted(), steps } = data

    // Check if there's already a steps log for today
    const existingLog = await sql`
      SELECT * FROM step_logs 
      WHERE user_id = ${userId} AND date = ${date}
      LIMIT 1
    `

    let result

    if (existingLog.length > 0) {
      // Update existing log
      result = await sql`
        UPDATE step_logs
        SET steps = ${steps}
        WHERE id = ${existingLog[0].id}
        RETURNING *
      `
    } else {
      // Create new steps log
      result = await sql`
        INSERT INTO step_logs (user_id, date, steps)
        VALUES (${userId}, ${date}, ${steps})
        RETURNING *
      `
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating steps log:", error)
    return NextResponse.json({ error: "Failed to update steps log" }, { status: 500 })
  }
}
