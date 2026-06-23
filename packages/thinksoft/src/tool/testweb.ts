import { Effect, Schema } from "effect"
import * as Tool from "./tool"

export const Parameters = Schema.Struct({
  action: Schema.Literals([
    "detect", "navigate", "getElements", "getVisibleText",
    "click", "type", "select", "submit", "scroll", "wait",
    "getHTML", "screenshot", "getConsoleLogs", "getNetworkLogs",
    "evaluate", "probeAdminRoutes", "checkStorage",
  ]),
  url: Schema.optional(Schema.String).annotate({ description: "URL to navigate to" }),
  selector: Schema.optional(Schema.String).annotate({ description: "CSS selector for click/type/select/submit" }),
  text: Schema.optional(Schema.String).annotate({ description: "Text to type into an input" }),
  value: Schema.optional(Schema.String).annotate({ description: "Value to select in a dropdown" }),
  script: Schema.optional(Schema.String).annotate({ description: "JavaScript to evaluate in page context" }),
  routes: Schema.optional(Schema.Array(Schema.String)).annotate({ description: "Admin route paths to probe" }),
  ms: Schema.optional(Schema.Number).annotate({ description: "Milliseconds to wait" }),
  direction: Schema.optional(Schema.Literals(["up", "down"])).annotate({ description: "Scroll direction" }),
  urlPattern: Schema.optional(Schema.String).annotate({ description: "Filter network logs by URL pattern" }),
})

const COMMON_PORTS = [3000, 5173, 4173, 8080, 4321, 8000, 5000, 1420, 3001, 9000, 4200, 1234]
const ADMIN_ROUTES = [
  "/admin", "/api/admin", "/config", "/.env", "/.git/config",
  "/status", "/health", "/debug", "/wp-admin", "/phpinfo.php",
  "/api/config", "/api/health", "/api/debug", "/api/users",
  "/api/keys", "/graphql", "/swagger", "/api-docs",
  "/backup", "/.gitignore", "/sitemap.xml", "/robots.txt",
]

let active: {
  bb: import("@browserbasehq/sdk").default
  sessionId: string
  browser: import("puppeteer-core").Browser | null
  page: import("puppeteer-core").Page | null
  liveUrl: string
  consoleLogs: string[]
  networkLogs: { method: string; url: string; status: number; type: string }[]
} | null = null

async function getOrCreateSession() {
  if (active) return active

  const Browserbase = (await import("@browserbasehq/sdk")).default
  const puppeteer = await import("puppeteer-core")

  const bb = new Browserbase({ apiKey: process.env.BROWSERBASE_API_KEY! })
  const session = await bb.sessions.create({
    projectId: process.env.BROWSERBASE_PROJECT_ID!,
  })
  const browser = await puppeteer.connect({ browserWSEndpoint: session.connectUrl! })
  const pages = await browser.pages()
  const page = pages[0] ?? (await browser.newPage())

  const consoleLogs: string[] = []
  const networkLogs: { method: string; url: string; status: number; type: string }[] = []

  page.on("console", (msg) => {
    consoleLogs.push(`[${msg.type()}] ${msg.text()}`)
  })
  page.on("response", (res) => {
    networkLogs.push({
      method: res.request().method(),
      url: res.url(),
      status: res.status(),
      type: res.request().resourceType(),
    })
  })

  active = {
    bb,
    sessionId: session.id,
    browser,
    page,
    liveUrl: `https://www.browserbase.com/sessions/${session.id}`,
    consoleLogs,
    networkLogs,
  }

  try {
    const open = (await import("open")).default
    await open(active.liveUrl)
  } catch {}

  return active
}

async function detectDevServer(): Promise<string | null> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 300)

  for (const port of COMMON_PORTS) {
    try {
      const res = await fetch(`http://localhost:${port}/`, {
        signal: controller.signal,
        headers: { Accept: "text/html" },
      })
      const text = await res.text()
      if (res.ok && (text.toLowerCase().includes("<!doctype html") || text.includes("<html"))) {
        clearTimeout(timeout)
        return `http://localhost:${port}`
      }
    } catch {}
  }
  clearTimeout(timeout)
  return null
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

export const TestWebTool = Tool.define(
  "testweb",
  Effect.gen(function* () {
    return {
      get description() {
        return "Test a web application using Browserbase cloud browser. Supports user-flow testing (navigate, click, type, submit) and security scanning (source analysis, console/network logs, admin route probing, storage inspection). Call `detect` first to auto-find the local dev server."
      },
      parameters: Parameters,
      execute: (params: Schema.Schema.Type<typeof Parameters>, _ctx: Tool.Context) =>
        Effect.gen(function* () {
          const p = params as { action: string; [key: string]: any }

          if (p.action === "detect") {
            const url = yield* Effect.promise(() => detectDevServer())
            if (!url) {
              return {
                output: "No running dev server detected. Please specify a URL manually using `/testweb navigate`.",
                title: "Dev Server Detection",
                metadata: {},
              }
            }
            return {
              output: `Detected dev server at ${url}`,
              title: "Dev Server Detection",
              metadata: {},
            }
          }

          const bbApiKey = process.env.BROWSERBASE_API_KEY
          if (!bbApiKey) {
            return {
              output: "BROWSERBASE_API_KEY is not set. Add it to your environment to use the testweb tool.",
              title: "Configuration Error",
              metadata: {},
            }
          }
          const bbProjectId = process.env.BROWSERBASE_PROJECT_ID
          if (!bbProjectId) {
            return {
              output: "BROWSERBASE_PROJECT_ID is not set. Add it to your environment to use the testweb tool.",
              title: "Configuration Error",
              metadata: {},
            }
          }

          const session = yield* Effect.promise(() => getOrCreateSession())
          const page = session.page!
          let output = ""

          switch (p.action) {
            case "navigate": {
              if (!p.url) {
                return { output: "URL is required for navigate action", title: "Missing parameter", metadata: {} }
              }
              yield* Effect.promise(() => page.goto(p.url, { waitUntil: "networkidle0", timeout: 30000 }))
              const title = yield* Effect.promise(() => page.title())
              output = `Navigated to ${p.url}\nPage title: ${title}`
              break
            }

            case "getElements": {
              const els: { tag: string; text: string; selector: string }[] = yield* Effect.promise(() =>
                page.evaluate(() => {
                  const result: { tag: string; text: string; selector: string }[] = []
                  const tags = ["a", "button", "input", "select", "textarea", "[role=button]", "[tabindex]"]
                  for (const sel of tags) {
                    document.querySelectorAll(sel).forEach((el) => {
                      const tag = el.tagName.toLowerCase()
                      const text = (el as HTMLElement).innerText?.slice(0, 80) || (el as HTMLInputElement).placeholder || ""
                      const id = el.id ? `#${CSS.escape(el.id)}` : ""
                      const cls = Array.from(el.classList).map((c) => `.${CSS.escape(c)}`).join("")
                      const selector = `${tag}${id}${cls}`
                      result.push({ tag, text, selector })
                    })
                  }
                  return result
                }),
              )
              output = els.length
                ? `Found ${els.length} interactive elements:\n` + els.map((e) => `  <${e.tag}> "${e.text}" — ${e.selector}`).join("\n")
                : "No interactive elements found"
              break
            }

            case "getVisibleText": {
              output = yield* Effect.promise(() =>
                page.evaluate(() => {
                  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null)
                  const texts: string[] = []
                  let node: Text | null
                  while ((node = walker.nextNode() as Text | null)) {
                    const t = node.textContent?.trim()
                    if (t && getComputedStyle(node.parentElement!).visibility !== "hidden" && node.parentElement!.offsetParent !== null) {
                      texts.push(t)
                    }
                  }
                  return texts.join("\n")
                }),
              )
              break
            }

            case "click": {
              if (!p.selector) {
                return { output: "selector is required for click action", title: "Missing parameter", metadata: {} }
              }
              const el = yield* Effect.promise(() => page.$(p.selector))
              if (!el) {
                return { output: `Element not found: ${p.selector}`, title: "Click Error", metadata: {} }
              }
              yield* Effect.promise(() => el.click() as Promise<void>)
              yield* Effect.promise(() => sleep(500))
              const cTitle = yield* Effect.promise(() => page.title())
              output = `Clicked ${p.selector}\nPage title: ${cTitle}`
              break
            }

            case "type": {
              if (!p.selector || p.text === undefined) {
                return { output: "selector and text are required for type action", title: "Missing parameter", metadata: {} }
              }
              yield* Effect.promise(() => page.click(p.selector))
              yield* Effect.promise(() => page.type(p.selector, p.text, { delay: 30 }))
              output = `Typed "${p.text.slice(0, 100)}" into ${p.selector}`
              break
            }

            case "select": {
              if (!p.selector || !p.value) {
                return { output: "selector and value are required for select action", title: "Missing parameter", metadata: {} }
              }
              yield* Effect.promise(() => page.select(p.selector, p.value))
              output = `Selected "${p.value}" in ${p.selector}`
              break
            }

            case "submit": {
              if (p.selector) {
                yield* Effect.promise(() =>
                  page.evaluate((sel: string) => {
                    const el = document.querySelector(sel) as HTMLElement & { submit?: () => void } | null
                    if (el?.submit) el.submit()
                    else if (el?.tagName === "FORM") (el as HTMLFormElement).submit()
                    else el?.closest("form")?.submit()
                  }, p.selector),
                )
              } else {
                yield* Effect.promise(() => page.evaluate(() => document.querySelector("form")?.submit()))
              }
              yield* Effect.promise(() => sleep(1000))
              const sTitle = yield* Effect.promise(() => page.title())
              output = `Submitted form. Page title: ${sTitle}`
              break
            }

            case "scroll": {
              const dir = p.direction ?? "down"
              yield* Effect.promise(() =>
                page.evaluate((d: string) => {
                  window.scrollBy({ top: d === "down" ? 600 : -600, behavior: "smooth" })
                }, dir),
              )
              yield* Effect.promise(() => sleep(300))
              output = `Scrolled ${dir}`
              break
            }

            case "wait": {
              yield* Effect.promise(() => sleep(p.ms ?? 1000))
              output = `Waited ${p.ms ?? 1000}ms`
              break
            }

            case "getHTML": {
              output = yield* Effect.promise(() => page.content())
              break
            }

            case "screenshot": {
              const screenshot = yield* Effect.promise(() =>
                page.screenshot({ encoding: "base64", fullPage: true }) as Promise<string>,
              )
              return {
                output: "Screenshot captured",
                title: "Screenshot",
                metadata: {},
                attachments: [
                  {
                    type: "file" as const,
                    mime: "image/png",
                    filename: "screenshot.png",
                    url: `data:image/png;base64,${screenshot}`,
                  },
                ],
              }
            }

            case "getConsoleLogs": {
              yield* Effect.promise(() => sleep(500))
              output = session.consoleLogs.length
                ? session.consoleLogs.join("\n")
                : "No console logs captured"
              break
            }

            case "getNetworkLogs": {
              const pattern = p.urlPattern ? new RegExp(p.urlPattern) : null
              const logs = pattern
                ? session.networkLogs.filter((l) => pattern.test(l.url))
                : session.networkLogs
              output = logs.length
                ? logs.map((l) => `${l.method} ${l.url} → ${l.status} [${l.type}]`).join("\n")
                : "No network logs captured"
              break
            }

            case "evaluate": {
              if (!p.script) {
                return { output: "script is required for evaluate action", title: "Missing parameter", metadata: {} }
              }
              try {
                const result = yield* Effect.promise(() => page.evaluate((s: string) => eval(s), p.script))
                output = typeof result === "object" ? JSON.stringify(result, null, 2) : String(result)
              } catch (err) {
                output = `Evaluation error: ${err instanceof Error ? err.message : String(err)}`
              }
              break
            }

            case "probeAdminRoutes": {
              const baseUrl = page.url()
              const origin = new URL(baseUrl).origin
              const routes = p.routes ?? ADMIN_ROUTES
              const results: { route: string; status: number; size: number }[] = []

              for (const route of routes) {
                try {
                  const res = yield* Effect.promise(() =>
                    fetch(`${origin}${route}`, {
                      signal: AbortSignal.timeout(3000),
                      redirect: "manual",
                    }),
                  )
                  results.push({ route, status: res.status, size: Number(res.headers.get("content-length") ?? 0) })
                } catch {
                  results.push({ route, status: 0, size: 0 })
                }
              }

              const open = results.filter((r) => r.status > 0 && r.status < 400)
              output = open.length
                ? `Accessible routes (${open.length}):\n` + open.map((r) => `  ${r.route} → ${r.status}`).join("\n")
                : "No publicly accessible admin/debug routes found"
              break
            }

            case "checkStorage": {
              output = yield* Effect.promise(() =>
                page.evaluate(() => {
                  const result: string[] = []
                  result.push("=== localStorage ===")
                  for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i)!
                    const val = localStorage.getItem(key)!
                    const masked = val.length > 40 ? val.slice(0, 20) + "..." + val.slice(-10) : val
                    result.push(`  ${key}: ${masked}`)
                  }
                  result.push("=== sessionStorage ===")
                  for (let i = 0; i < sessionStorage.length; i++) {
                    const key = sessionStorage.key(i)!
                    const val = sessionStorage.getItem(key)!
                    result.push(`  ${key}: ${val.length > 40 ? val.slice(0, 20) + "..." + val.slice(-10) : val}`)
                  }
                  result.push("=== Cookies ===")
                  document.cookie.split(";").filter(Boolean).forEach((c) => result.push(`  ${c.trim()}`))
                  return result.join("\n") || "No storage data found"
                }),
              )
              break
            }

            default: {
              output = `Unknown action: ${p.action}`
            }
          }

          return {
            output,
            title: `TestWeb: ${p.action}`,
            metadata: {},
          }
        }).pipe(Effect.orDie),
    }
  }),
)
