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

    // Get user profile
    const profileResult = await sql`
      SELECT * FROM user_profiles WHERE user_id = ${userId}
    `

    if (profileResult.length === 0) {
      // Create default profile if it doesn't exist
      const newProfile = await sql`
        INSERT INTO user_profiles (user_id, water_goal)
        VALUES (${userId}, 8)
        RETURNING *
      `

      return NextResponse.json(newProfile[0])
    }

    return NextResponse.json(profileResult[0])
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json({ error: "Failed to fetch user profile" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const userId = session.user.id
    const data = await request.json()

    const { height, currentWeight, targetWeight, gender, waterGoal } = data

    // Update user profile
    const result = await sql`
      UPDATE user_profiles
      SET 
        height = ${height},
        current_weight = ${currentWeight},
        target_weight = ${targetWeight},
        gender = ${gender},
        water_goal = ${waterGoal},
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ${userId}
      RETURNING *
    `

    if (result.length === 0) {
      // Create profile if it doesn't exist
      const newProfile = await sql`
        INSERT INTO user_profiles 
        (user_id, height, current_weight, target_weight, gender, water_goal)
        VALUES 
        (${userId}, ${height}, ${currentWeight}, ${targetWeight}, ${gender}, ${waterGoal})
        RETURNING *
      `

      return NextResponse.json(newProfile[0])
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating user profile:", error)
    return NextResponse.json({ error: "Failed to update user profile" }, { status: 500 })
  }
}
