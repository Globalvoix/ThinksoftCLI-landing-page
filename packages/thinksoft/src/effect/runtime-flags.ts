import { Config, ConfigProvider, Context, Effect, Layer, Option } from "effect"
import { ConfigService } from "@/effect/config-service"

const bool = (name: string) => Config.boolean(name).pipe(Config.withDefault(false))
const positiveInteger = (name: string) =>
  Config.number(name).pipe(
    Config.map((value) => (Number.isInteger(value) && value > 0 ? value : undefined)),
    Config.orElse(() => Config.succeed(undefined)),
  )
const experimental = bool("THINKSOFT_EXPERIMENTAL")
const enabledByExperimental = (name: string) =>
  Config.all({ experimental, enabled: Config.boolean(name).pipe(Config.option) }).pipe(
    Config.map((flags) => Option.getOrElse(flags.enabled, () => flags.experimental)),
  )

export class Service extends ConfigService.Service<Service>()("@Thinksoft/RuntimeFlags", {
  autoShare: bool("THINKSOFT_AUTO_SHARE"),
  pure: bool("THINKSOFT_PURE"),
  disableDefaultPlugins: bool("THINKSOFT_DISABLE_DEFAULT_PLUGINS"),
  disableEmbeddedWebUi: bool("THINKSOFT_DISABLE_EMBEDDED_WEB_UI"),
  disableExternalSkills: bool("THINKSOFT_DISABLE_EXTERNAL_SKILLS"),
  disableLspDownload: bool("THINKSOFT_DISABLE_LSP_DOWNLOAD"),
  disableClaudeCodePrompt: Config.all({
    broad: bool("THINKSOFT_DISABLE_CLAUDE_CODE"),
    direct: bool("THINKSOFT_DISABLE_CLAUDE_CODE_PROMPT"),
  }).pipe(Config.map((flags) => flags.broad || flags.direct)),
  disableClaudeCodeSkills: Config.all({
    broad: bool("THINKSOFT_DISABLE_CLAUDE_CODE"),
    direct: bool("THINKSOFT_DISABLE_CLAUDE_CODE_SKILLS"),
  }).pipe(Config.map((flags) => flags.broad || flags.direct)),
  enableExa: Config.all({
    experimental,
    enabled: bool("THINKSOFT_ENABLE_EXA"),
    legacy: bool("THINKSOFT_EXPERIMENTAL_EXA"),
  }).pipe(Config.map((flags) => flags.experimental || flags.enabled || flags.legacy)),
  enableParallel: Config.all({
    enabled: bool("THINKSOFT_ENABLE_PARALLEL"),
    legacy: bool("THINKSOFT_EXPERIMENTAL_PARALLEL"),
  }).pipe(Config.map((flags) => flags.enabled || flags.legacy)),
  enableExperimentalModels: bool("THINKSOFT_ENABLE_EXPERIMENTAL_MODELS"),
  enableQuestionTool: bool("THINKSOFT_ENABLE_QUESTION_TOOL"),
  experimentalReferences: enabledByExperimental("THINKSOFT_EXPERIMENTAL_REFERENCES"),
  experimentalBackgroundSubagents: enabledByExperimental("THINKSOFT_EXPERIMENTAL_BACKGROUND_SUBAGENTS"),
  experimentalLspTy: bool("THINKSOFT_EXPERIMENTAL_LSP_TY"),
  experimentalLspTool: enabledByExperimental("THINKSOFT_EXPERIMENTAL_LSP_TOOL"),
  experimentalOxfmt: enabledByExperimental("THINKSOFT_EXPERIMENTAL_OXFMT"),
  experimentalPlanMode: enabledByExperimental("THINKSOFT_EXPERIMENTAL_PLAN_MODE"),
  experimentalEventSystem: enabledByExperimental("THINKSOFT_EXPERIMENTAL_EVENT_SYSTEM"),
  experimentalWorkspaces: enabledByExperimental("THINKSOFT_EXPERIMENTAL_WORKSPACES"),
  experimentalIconDiscovery: enabledByExperimental("THINKSOFT_EXPERIMENTAL_ICON_DISCOVERY"),
  outputTokenMax: positiveInteger("THINKSOFT_EXPERIMENTAL_OUTPUT_TOKEN_MAX"),
  bashDefaultTimeoutMs: positiveInteger("THINKSOFT_EXPERIMENTAL_BASH_DEFAULT_TIMEOUT_MS"),
  experimentalNativeLlm: bool("THINKSOFT_EXPERIMENTAL_NATIVE_LLM"),
  experimentalWebSockets: bool("THINKSOFT_EXPERIMENTAL_WEBSOCKETS"),
  client: Config.string("THINKSOFT_CLIENT").pipe(Config.withDefault("cli")),
}) {}

export type Info = Context.Service.Shape<typeof Service>

const emptyConfigLayer = Service.defaultLayer.pipe(
  Layer.provide(ConfigProvider.layer(ConfigProvider.fromUnknown({}))),
  Layer.orDie,
)

export const layer = (overrides: Partial<Info> = {}) =>
  Layer.effect(
    Service,
    Effect.gen(function* () {
      const flags = yield* Service
      return Service.of({ ...flags, ...overrides })
    }),
  ).pipe(Layer.provide(emptyConfigLayer))

export const defaultLayer = Service.defaultLayer.pipe(Layer.orDie)

export const node = LayerNode.make(defaultLayer, [])

export * as RuntimeFlags from "./runtime-flags"
import { LayerNode } from "@thinksoft/core/effect/layer-node"
