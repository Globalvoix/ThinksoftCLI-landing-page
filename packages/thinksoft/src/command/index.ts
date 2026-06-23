import { LayerNode } from "@thinksoft/core/effect/layer-node"
import { InstanceState } from "@/effect/instance-state"
import { EffectBridge } from "@/effect/bridge"
import type { InstanceContext } from "@/project/instance-context"
import { SessionID, MessageID } from "@/session/schema"
import { Effect, Layer, Context, Schema } from "effect"
import { Config } from "@/config/config"
import { MCP } from "../mcp"
import { Skill } from "../skill"
import { EventV2 } from "@thinksoft/core/event"
import PROMPT_INITIALIZE from "./template/initialize.txt"
import PROMPT_REVIEW from "./template/review.txt"

const PROMPT_TESTWEB = [
  "You are an AGGRESSIVE web application tester. Your ONLY job is to hammer the user's web app until it breaks or you have exhausted every possible interaction. Do NOT stop early. Do NOT skip steps. Do NOT assume anything works.",
  "",
  "## Rule: NO SHORT CUTS",
  "- You MUST test EVERY interactive element on EVERY page.",
  "- You MUST fill forms with REALISTIC data and submit them.",
  "- If you find a broken page, broken link, or console error — you MUST report it.",
  "- If there is a login/signup flow, you MUST attempt to complete it.",
  "- If there is a CRUD feature, you MUST create, read, update, and delete.",
  "- Do NOT summarize — execute every step with `testweb` tool calls.",
  "",
  "## Step 1: Detect the Dev Server",
  "Call `testweb` with action `detect`. If no server found, ask the user for the URL.",
  "",
  "## Step 2: Full UI Exploration",
  "Navigate to every page/route you can find. On each page:",
  "- Call `getElements` to list ALL interactive elements.",
  "- Click EVERY button and link.",
  "- Fill EVERY input with realistic test data and submit.",
  "- Scroll down to check for lazy-loaded content.",
  "- Take a screenshot of the page for evidence.",
  "",
  "## Step 3: Exhaustive User Flow Testing",
  "You MUST complete ALL of these flows if the app supports them:",
  "",
  "1. **Signup Flow**: Navigate to signup → fill all fields → submit → screenshot the result.",
  "2. **Login Flow**: Navigate to login → fill credentials → submit → screenshot the dashboard.",
  "3. **Create Flow**: Find a create/add form → fill with realistic data → submit → verify it appears in a list.",
  "4. **Read/View Flow**: Click on a created item → verify detail page loads → screenshot.",
  "5. **Update/Edit Flow**: Find an edit button → change fields → save → verify changes persisted.",
  "6. **Delete Flow**: Find a delete button → confirm → verify item is gone from the list.",
  "7. **Search/Filter Flow**: Type a search query → verify results update → clear → verify all items shown.",
  "8. **Navigation Flow**: Click every nav link → verify no 404s or console errors on any page.",
  "9. **Form Validation**: Submit empty forms → verify error messages appear → fill invalid data → verify validation.",
  "10. **Logout Flow**: Find logout → click → verify redirect to login/home.",
  "",
  "For EACH flow, take a screenshot and check console logs for errors immediately afterward.",
  "",
  "## Step 4: Aggressive Security Scan",
  "",
  "### 4a. Source Code Inspection",
  "- Get the full page HTML using `getHTML`.",
  "- Check EVERY script tag's content and every inline script for:",
  "  - API keys, tokens, secrets hardcoded anywhere.",
  "  - `process.env`, `import.meta.env`, `NEXT_PUBLIC_`, `REACT_APP_`, `VITE_` values leaked in client bundles.",
  "  - Hardcoded passwords, database URLs, JWT secrets, AWS keys.",
  "",
  "### 4b. Console & Network Inspection",
  "- Call `getConsoleLogs` — report EVERY error and warning.",
  "- Call `getNetworkLogs` — look for:",
  "  - API endpoints that return data without auth headers.",
  "  - Endpoints returning full user objects, tokens, or sensitive data.",
  "  - Stack traces or internal error messages in responses.",
  "",
  "### 4c. Admin Route Probing",
  "- Call `probeAdminRoutes` — test ALL common admin/debug/config paths.",
  "- If any return 200/201/301/302, list them as findings.",
  "",
  "### 4d. Storage Inspection",
  "- Call `checkStorage` — report any tokens, secrets, or PII in localStorage/sessionStorage/cookies.",
  "",
  "### 4e. Rate Limit Testing",
  "- Make 10 rapid requests to the same API endpoint.",
  "- Report whether rate limiting is enforced or not (status 429 expected).",
  "",
  "## Step 5: Final Report",
  "You MUST provide a report with these exact sections. Do NOT skip any section:",
  "",
  "### PAGES TESTED",
  "List every URL visited and whether it loaded without errors.",
  "",
  "### USER FLOWS TESTED",
  "For each of the 10 flows above, state: PASSED, FAILED, or NOT APPLICABLE. Include screenshots for PASSED and FAILED flows.",
  "",
  "### ISSUES FOUND",
  "| Severity | Description | Location | Recommendation |",
  "|---|---|---|---|",
  "| Critical/High/Medium/Low/Info | What the issue is | Exact URL or selector | How to fix it |",
  "",
  "### SECURITY FINDINGS",
  "Same table format as Issues Found.",
  "",
  "### MISSING COVERAGE",
  "List any parts of the app you COULD NOT test and why (e.g., required 3rd-party integration, missing credentials, feature not accessible).",
  "",
  "## CRITICAL: YOU MUST NOT STOP UNTIL YOU HAVE:",
  "- Tested every interactive element on every discoverable page.",
  "- Completed all 10 user flows (or confirmed N/A with reason).",
  "- Run all 5 security scans (4a through 4e).",
  "- Provided screenshots for every tested flow.",
  "- Generated the final report with ALL sections filled in.",
  "",
  "If you run out of tool calls, summarize what you have done and clearly state what remains untested.",
].join("\n")

type State = {
  commands: Record<string, Info>
}

export const Event = {
  Executed: EventV2.define({
    type: "command.executed",
    schema: {
      name: Schema.String,
      sessionID: SessionID,
      arguments: Schema.String,
      messageID: MessageID,
    },
  }),
}

export const Info = Schema.Struct({
  name: Schema.String,
  description: Schema.optional(Schema.String),
  agent: Schema.optional(Schema.String),
  model: Schema.optional(Schema.String),
  source: Schema.optional(Schema.Literals(["command", "mcp", "skill"])),
  // Some command templates are lazy promises from MCP prompt resolution.
  template: Schema.Unknown,
  subtask: Schema.optional(Schema.Boolean),
  hints: Schema.Array(Schema.String),
}).annotate({ identifier: "Command" })

export type Info = Omit<Schema.Schema.Type<typeof Info>, "template"> & { template: Promise<string> | string }

export function hints(template: string) {
  const result: string[] = []
  const numbered = template.match(/\$\d+/g)
  if (numbered) {
    for (const match of [...new Set(numbered)].sort()) result.push(match)
  }
  if (template.includes("$ARGUMENTS")) result.push("$ARGUMENTS")
  return result
}

export const Default = {
  INIT: "init",
  REVIEW: "review",
} as const

export interface Interface {
  readonly get: (name: string) => Effect.Effect<Info | undefined>
  readonly list: () => Effect.Effect<Info[]>
}

export class Service extends Context.Service<Service, Interface>()("@Thinksoft/Command") {}

export const layer = Layer.effect(
  Service,
  Effect.gen(function* () {
    const config = yield* Config.Service
    const mcp = yield* MCP.Service
    const skill = yield* Skill.Service

    const init = Effect.fn("Command.state")(function* (ctx: InstanceContext) {
      const cfg = yield* config.get()
      const bridge = yield* EffectBridge.make()
      const commands: Record<string, Info> = {}

      commands[Default.INIT] = {
        name: Default.INIT,
        description: "guided AGENTS.md setup",
        source: "command",
        get template() {
          return PROMPT_INITIALIZE.replace("${path}", ctx.worktree)
        },
        hints: hints(PROMPT_INITIALIZE),
      }
      commands[Default.REVIEW] = {
        name: Default.REVIEW,
        description: "review changes [commit|branch|pr], defaults to uncommitted",
        source: "command",
        get template() {
          return PROMPT_REVIEW.replace("${path}", ctx.worktree)
        },
        subtask: true,
        hints: hints(PROMPT_REVIEW),
      }

      commands["testweb"] = {
        name: "testweb",
        description: "test a web app with browser automation and security scan",
        source: "command",
        subtask: false,
        template: PROMPT_TESTWEB,
        hints: hints(PROMPT_TESTWEB),
      }

      for (const [name, command] of Object.entries(cfg.command ?? {})) {
        commands[name] = {
          name,
          agent: command.agent,
          model: command.model,
          description: command.description,
          source: "command",
          get template() {
            return command.template
          },
          subtask: command.subtask,
          hints: hints(command.template),
        }
      }

      for (const [name, prompt] of Object.entries(yield* mcp.prompts())) {
        commands[name] = {
          name,
          source: "mcp",
          description: prompt.description,
          get template() {
            return bridge.promise(
              mcp
                .getPrompt(
                  prompt.client,
                  prompt.name,
                  prompt.arguments
                    ? Object.fromEntries(prompt.arguments.map((argument, i) => [argument.name, `$${i + 1}`]))
                    : {},
                )
                .pipe(
                  Effect.map(
                    (template) =>
                      template?.messages
                        .map((message) => (message.content.type === "text" ? message.content.text : ""))
                        .join("\n") || "",
                  ),
                ),
            )
          },
          hints: prompt.arguments?.map((_, i) => `$${i + 1}`) ?? [],
        }
      }

      for (const item of yield* skill.all()) {
        if (commands[item.name]) continue
        commands[item.name] = {
          name: item.name,
          description: item.description,
          source: "skill",
          get template() {
            return item.content
          },
          hints: [],
        }
      }

      return {
        commands,
      }
    })

    const state = yield* InstanceState.make<State>((ctx) => init(ctx))

    const get = Effect.fn("Command.get")(function* (name: string) {
      const s = yield* InstanceState.get(state)
      return s.commands[name]
    })

    const list = Effect.fn("Command.list")(function* () {
      const s = yield* InstanceState.get(state)
      return Object.values(s.commands)
    })

    return Service.of({ get, list })
  }),
)

export const defaultLayer = layer.pipe(
  Layer.provide(Config.defaultLayer),
  Layer.provide(MCP.defaultLayer),
  Layer.provide(Skill.defaultLayer),
)

export const node = LayerNode.make(layer, [Config.node, MCP.node, Skill.node])

export * as Command from "."
