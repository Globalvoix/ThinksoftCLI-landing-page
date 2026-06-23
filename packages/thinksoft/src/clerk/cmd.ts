import { cmd } from "@/cli/cmd/cmd"
import { authLoop, removeToken, getStoredToken } from "./index"
import { UI } from "@/cli/ui"

export const ClerkLoginCommand = cmd({
  command: "login",
  describe: "sign in to Thinksoft with Clerk",
  handler: async () => {
    try {
      const info = await authLoop()
      UI.success(`Signed in as ${info.userEmail}`)
    } catch (err) {
      UI.error("Sign in failed: " + (err instanceof Error ? err.message : String(err)))
      process.exitCode = 1
    }
  },
})

export const ClerkLogoutCommand = cmd({
  command: "logout",
  describe: "sign out of Thinksoft",
  handler: async () => {
    const stored = await getStoredToken()
    if (!stored) {
      UI.info("Not signed in")
      return
    }
    await removeToken()
    UI.success(`Signed out from ${stored.userEmail}`)
  },
})
