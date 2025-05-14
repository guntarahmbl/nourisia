import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const userId = session.user.id
    const { pathname } = new URL(request.url)
    const exerciseId = pathname.split("/").pop()

    if (!exerciseId) {
      return NextResponse.json({ error: "Exercise ID is required" }, { status: 400 })
    }

    // Delete exercise log by ID for the logged-in user
    const result = await sql`
      DELETE FROM exercise_logs 
      WHERE user_id = ${userId} AND id = ${exerciseId}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Exercise log not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Exercise log deleted successfully" })
  } catch (error) {
    console.error("Error deleting exercise log:", error)
    return NextResponse.json({ error: "Failed to delete exercise log" }, { status: 500 })
  }
}