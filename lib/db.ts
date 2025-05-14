import { neon } from "@neondatabase/serverless"

// Create a reusable SQL client using the DATABASE_URL environment variable
export const sql = neon(process.env.DATABASE_URL!)

// Helper function to format date to YYYY-MM-DD
export function formatDateForDB(date: Date): string {
  return date.toISOString().split("T")[0]
}

// Helper function to get today's date formatted for DB
export function getTodayFormatted(): string {
  return formatDateForDB(new Date())
}

// Helper to safely parse numeric values
export function parseNumeric(value: any): number {
  if (value === null || value === undefined) return 0
  const parsed = Number.parseFloat(value)
  return isNaN(parsed) ? 0 : parsed
}
