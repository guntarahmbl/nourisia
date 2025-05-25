import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 })
    }

    // Check if user already exists
    const existingUsers = await sql`
      SELECT * FROM users WHERE email = ${email.toLowerCase()}
    `

    if (existingUsers.length > 0) {
      return NextResponse.json(
        {
          error: "An account with this email address already exists. Please use a different email or try logging in.",
        },
        { status: 409 },
      )
    }

    // Hash the password
    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Generate a unique ID
    const userId = uuidv4()

    // Create the user
    const newUser = await sql`
      INSERT INTO users (id, name, email, password_hash)
      VALUES (${userId}, ${name.trim()}, ${email.toLowerCase()}, ${hashedPassword})
      RETURNING id, name, email
    `

    return NextResponse.json({
      message: "Account created successfully",
      user: {
        id: newUser[0].id,
        name: newUser[0].name,
        email: newUser[0].email,
      },
    })
  } catch (error) {
    console.error("Error during registration:", error)

    // Check if it's a database constraint error
    if (error instanceof Error && error.message.includes("duplicate key")) {
      return NextResponse.json(
        {
          error: "An account with this email address already exists. Please use a different email or try logging in.",
        },
        { status: 409 },
      )
    }

    return NextResponse.json(
      {
        error: "Unable to create account at this time. Please try again later.",
      },
      { status: 500 },
    )
  }
}
