import { neon } from "@neondatabase/serverless"

export async function GET() {
  const sql = neon(process.env.DATABASE_URL!)
  try {
    await sql`CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    )`
    await sql`CREATE TABLE IF NOT EXISTS cli_sessions (
      token TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      expires_at TIMESTAMP NOT NULL,
      used BOOLEAN DEFAULT FALSE NOT NULL
    )`
    return Response.json({ ok: true, message: "Tables created" })
  } catch (err: any) {
    return Response.json({ ok: false, error: err.message }, { status: 500 })
  }
}
