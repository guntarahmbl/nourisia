import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const userId = session.user.id

    // Get all achievements with user completion status
    const achievements = await sql`
      SELECT 
        a.*,
        ua.completed,
        ua.completed_at
      FROM 
        achievements a
      LEFT JOIN 
        user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = ${userId}
      ORDER BY 
        a.id ASC
    `

    return NextResponse.json(achievements)
  } catch (error) {
    console.error("Error fetching achievements:", error)
    return NextResponse.json({ error: "Failed to fetch achievements" }, { status: 500 })
  }
}
