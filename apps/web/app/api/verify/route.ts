import { neon } from "@neondatabase/serverless"

export async function POST(req: Request) {
  try {
    const { token } = await req.json()
    if (!token) {
      return Response.json({ valid: false }, { status: 400 })
    }

    const sql = neon(process.env.DATABASE_URL!)

    const sessions = await sql`SELECT * FROM cli_sessions WHERE token = ${token} LIMIT 1`

    if (sessions.length === 0) {
      return Response.json({ valid: false, reason: "not_found" })
    }

    const session = sessions[0] as any

    if (session.used) {
      return Response.json({ valid: false, reason: "already_used" })
    }

    if (new Date() > new Date(session.expires_at)) {
      return Response.json({ valid: false, reason: "expired" })
    }

    await sql`UPDATE cli_sessions SET used = true WHERE token = ${token}`

    const users = await sql`SELECT * FROM users WHERE id = ${session.user_id} LIMIT 1`
    const user = users[0] as any
    if (!user) {
      return Response.json({ valid: false, reason: "user_not_found" })
    }

    return Response.json({
      valid: true,
      user: {
        id: user.id,
        email: user.email,
      },
    })
  } catch (err: any) {
    return Response.json({ valid: false, error: err.message }, { status: 500 })
  }
}
