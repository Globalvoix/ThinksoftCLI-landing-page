import path from "path"
import fs from "fs/promises"
import http from "http"
import os from "os"
import { spawn, execSync } from "child_process"
import { xdgData } from "xdg-basedir"

const app = "Thinksoft"
const dataDir = path.join(xdgData!, app)
const tokenFile = path.join(dataDir, "clerk_token.json")

export interface ClerkToken {
  token: string
  userEmail: string
  userId: string
  createdAt: string
}

export async function getStoredToken(): Promise<ClerkToken | null> {
  try {
    const data = await fs.readFile(tokenFile, "utf-8")
    return JSON.parse(data)
  } catch {
    return null
  }
}

export async function storeToken(info: ClerkToken): Promise<void> {
  await fs.mkdir(dataDir, { recursive: true })
  await fs.writeFile(tokenFile, JSON.stringify(info, null, 2), { mode: 0o600 })
}

export async function removeToken(): Promise<void> {
  const baseUrl = process.env.THINKSOFT_AUTH_URL || "https://thinksoft.dev"
  try {
    const stored = await getStoredToken()
    if (stored) {
      try {
        await fetch(`${baseUrl}/api/cli/logout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: stored.token }),
        })
      } catch {
        // best-effort server logout
      }
    }
  } catch {}

  try {
    await fs.unlink(tokenFile)
  } catch {}
}

export async function verifyToken(token: string): Promise<ClerkToken | null> {
  const baseUrl = process.env.THINKSOFT_AUTH_URL || "https://thinksoft.dev"
  try {
    const res = await fetch(`${baseUrl}/api/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
    if (!res.ok) return null
    const data = await res.json()
    if (!data.valid) return null
    return {
      token,
      userEmail: data.user?.email ?? "",
      userId: data.user?.id ?? "",
      createdAt: new Date().toISOString(),
    }
  } catch {
    return null
  }
}

export function startAuthServer(): Promise<{
  server: http.Server
  port: number
  tokenPromise: Promise<string>
}> {
  let resolveToken: (token: string) => void = () => {}
  const tokenPromise = new Promise<string>((resolve) => {
    resolveToken = resolve
  })

  const server = http.createServer((req, res) => {
    const host = req.headers.host || "127.0.0.1"
    const url = new URL(req.url!, `http://${host}`)
    if (url.pathname === "/callback" && url.searchParams.has("token")) {
      const token = url.searchParams.get("token")!
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" })
      res.end(
        `<html><body style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:system-ui;background:#111;color:#fff">` +
          `<h1>Authentication successful! You can close this tab and return to your terminal.</h1>` +
          `</body></html>`
      )
      resolveToken(token)
    } else {
      res.writeHead(404)
      res.end("Not found")
    }
  })

  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const port = (server.address() as any).port
      resolve({ server, port, tokenPromise })
    })
  })
}

export async function authLoop(): Promise<ClerkToken> {
  const { server, port, tokenPromise } = await startAuthServer()
  const baseUrl = process.env.THINKSOFT_AUTH_URL || "https://thinksoft.dev"
  const authUrl = `${baseUrl}/cli-auth?port=${port}`

  const openCmd = process.platform === "win32" ? "start" : process.platform === "darwin" ? "open" : "xdg-open"
  spawn(openCmd, [authUrl], { stdio: "ignore", detached: true, shell: process.platform === "win32" }).unref()

  const rawToken = await tokenPromise
  server.close()

  const info = await verifyToken(rawToken)
  if (!info) throw new Error("Token verification failed")
  await storeToken(info)
  return info
}

export async function isAuthenticated(): Promise<boolean> {
  const stored = await getStoredToken()
  return stored !== null
}
