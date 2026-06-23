import { auth, clerkClient } from "@clerk/nextjs/server"
import { neon } from "@neondatabase/serverless"
import { ulid } from "ulid"

export async function POST() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return Response.json({ error: "Not authenticated" }, { status: 401 })
    }

    const client = await clerkClient()
    const clerkUser = await client.users.getUser(userId)
    const email = clerkUser.emailAddresses[0]?.emailAddress
    if (!email) {
      return Response.json({ error: "No email found" }, { status: 400 })
    }

    const sql = neon(process.env.DATABASE_URL!)
    await sql`INSERT INTO users (id, email) VALUES (${userId}, ${email}) ON CONFLICT (id) DO NOTHING`

    const token = ulid()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString()
    await sql`INSERT INTO cli_sessions (token, user_id, expires_at) VALUES (${token}, ${userId}, ${expiresAt})`

    return Response.json({ token })
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
