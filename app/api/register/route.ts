import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    // Check if user already exists
    const existingUsers = await sql`
      SELECT * FROM users WHERE email = ${email}
    `

    if (existingUsers.length > 0) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Generate a unique ID
    const userId = uuidv4()

    // Create the user
    const newUser = await sql`
      INSERT INTO users (id, name, email, password_hash)
      VALUES (${userId}, ${name}, ${email}, ${hashedPassword})
      RETURNING id, name, email
    `

    return NextResponse.json({
      user: {
        id: newUser[0].id,
        name: newUser[0].name,
        email: newUser[0].email,
      },
    })
  } catch (error) {
    console.error("Error during registration:", error)
    return NextResponse.json({ error: "Failed to register user" }, { status: 500 })
  }
}
