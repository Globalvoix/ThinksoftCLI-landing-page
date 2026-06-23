import { run as runTui, type TuiInput } from "@thinksoft/tui"
import { Global } from "@thinksoft/core/global"
import { Effect } from "effect"

export function run(input: TuiInput) {
  return runTui(input).pipe(Effect.provide(Global.defaultLayer))
}
