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

    // Get water logs for the specified date
    const waterLogs = await sql`
      SELECT * FROM water_logs 
      WHERE user_id = ${userId} AND date = ${date}
      ORDER BY created_at DESC
      LIMIT 1
    `

    if (waterLogs.length === 0) {
      return NextResponse.json({ glasses: 0, date })
    }

    return NextResponse.json(waterLogs[0])
  } catch (error) {
    console.error("Error fetching water logs:", error)
    return NextResponse.json({ error: "Failed to fetch water logs" }, { status: 500 })
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

    const { date = getTodayFormatted(), glasses } = data

    // Check if there's already a water log for today
    const existingLog = await sql`
      SELECT * FROM water_logs 
      WHERE user_id = ${userId} AND date = ${date}
      LIMIT 1
    `

    let result

    if (existingLog.length > 0) {
      // Update existing log
      result = await sql`
        UPDATE water_logs
        SET glasses = ${glasses}
        WHERE id = ${existingLog[0].id}
        RETURNING *
      `
    } else {
      // Create new water log
      result = await sql`
        INSERT INTO water_logs (user_id, date, glasses)
        VALUES (${userId}, ${date}, ${glasses})
        RETURNING *
      `
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating water log:", error)
    return NextResponse.json({ error: "Failed to update water log" }, { status: 500 })
  }
}
