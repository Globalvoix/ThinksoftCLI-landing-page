import { Context } from "effect"
import type { InstanceContext } from "@/project/instance-context"
import type { WorkspaceV2 } from "@thinksoft/core/workspace"

export const InstanceRef = Context.Reference<InstanceContext | undefined>("~Thinksoft/InstanceRef", {
  defaultValue: () => undefined,
})

export const WorkspaceRef = Context.Reference<WorkspaceV2.ID | undefined>("~Thinksoft/WorkspaceRef", {
  defaultValue: () => undefined,
})
