import { clerkClient } from "@clerk/nextjs/server"
import { neon } from "@neondatabase/serverless"

export async function POST(req: Request) {
  try {
    const { token } = await req.json()
    if (!token) {
      return Response.json({ ok: false, error: "Missing token" }, { status: 400 })
    }

    const sql = neon(process.env.DATABASE_URL!)

    const sessions = await sql`SELECT * FROM cli_sessions WHERE token = ${token} LIMIT 1`
    if (sessions.length === 0) {
      return Response.json({ ok: false, error: "Session not found" }, { status: 404 })
    }

    const session = sessions[0] as any
    const userId = session.user_id

    await sql`DELETE FROM cli_sessions WHERE token = ${token}`

    const client = await clerkClient()
    const userSessions = await client.sessions.getSessionList({ userId })
    for (const s of userSessions.data) {
      try {
        await client.sessions.revokeSession(s.id)
      } catch {
        // best-effort per-session revocation
      }
    }

    return Response.json({ ok: true })
  } catch (err: any) {
    return Response.json({ ok: false, error: err.message }, { status: 500 })
  }
}
