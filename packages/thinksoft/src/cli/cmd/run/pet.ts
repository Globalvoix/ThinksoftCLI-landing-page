import { createEffect, createSignal, onCleanup, type Accessor } from "solid-js"
import type { FooterState } from "./types"

export type PetMood = "happy" | "thinking" | "working" | "excited" | "celebrating" | "idle"

export interface PetState {
  visible: Accessor<boolean>
  message: Accessor<string>
  mood: Accessor<PetMood>
  emoji: Accessor<string>
  catArt: Accessor<string[]>
}

const CAT_ART: Record<PetMood, string[]> = {
  happy: ["  /\\_/\\", " ( •ᴗ• )"],
  thinking: ["  /\\_/\\", " ( ◕.◕ )"],
  working: ["  /\\_/\\", " ( •̀ω•́ )"],
  excited: ["  /\\_/\\", " ( >ᴗ< )"],
  celebrating: ["  /\\_/\\", " ( ^ᴗ^ )"],
  idle: ["  /\\_/\\", " ( -ᴗ- )"],
}

const WORKING_MESSAGES = [
  "Working on it...",
  "Let me look into that...",
  "Analyzing the code...",
  "On it!",
  "Digging through the codebase...",
]

const ENCOURAGEMENTS = [
  "You're doing great!",
  "Need a hand? Try /debug or /security!",
  "I'm here if you need me!",
  "Building something cool?",
  "You've got this!",
  "Keep up the amazing work!",
  "Let me know if you need anything!",
  "Your code is looking sharp today!",
]

const DONE_MESSAGES = [
  "Done! Looks great!",
  "All done! Nice work!",
  "Finished! Check it out!",
  "Done! You're crushing it!",
  "Completed! You're on fire!",
]

const TIP_MESSAGES = [
  "Tip: Use /debug to find and fix issues",
  "Tip: Use /security for a security audit",
  "Tip: Try /logout to sign out",
  "Tip: I can help with code reviews too!",
  "Tip: You can chain commands with /debug and /security",
]

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function createPetState(busy: Accessor<boolean>, statusText: Accessor<string>, state: Accessor<FooterState>): PetState {
  const [visible, setVisible] = createSignal(true)
  const [message, setMessage] = createSignal("Hi there! I'm your coding buddy!")
  const [mood, setMood] = createSignal<PetMood>("happy")
  const [emoji, setEmoji] = createSignal("🐱")
  const [catArt, setCatArt] = createSignal(CAT_ART.happy)

  function updateMood(newMood: PetMood) {
    setMood(newMood)
    setCatArt(CAT_ART[newMood])
  }

  let lastBusy = busy()
  let encouragementTimer: ReturnType<typeof setInterval> | undefined

  createEffect(() => {
    const currentBusy = busy()
    const currentStatus = statusText()

    if (currentBusy && !lastBusy) {
      updateMood("thinking")
      setMessage(pick(WORKING_MESSAGES))
    } else if (!currentBusy && lastBusy) {
      updateMood("celebrating")
      setMessage(pick(DONE_MESSAGES))
      setTimeout(() => {
        if (!busy()) {
          updateMood("happy")
          setMessage("What's next?")
        }
      }, 5000)
    } else if (currentBusy) {
      if (currentStatus.includes("writing") || currentStatus.includes("code")) {
        updateMood("excited")
        setMessage("Nice code coming up!")
      } else if (currentStatus.includes("fix") || currentStatus.includes("error")) {
        updateMood("working")
        setMessage("Let me fix that!")
      } else if (currentStatus.includes("thinking") || currentStatus.includes("analyzing")) {
        updateMood("thinking")
        setMessage("Thinking hard...")
      }
    }

    lastBusy = currentBusy
  })

  createEffect(() => {
    const s = state()
    if (s.status?.startsWith("Debug")) {
      updateMood("thinking")
      setMessage("Let me debug that! 🕵️")
    } else if (s.status?.startsWith("Security")) {
      updateMood("excited")
      setMessage("Security audit in progress! 🛡️")
    }
  })

  encouragementTimer = setInterval(() => {
    if (!busy()) {
      const msg = Math.random() > 0.5 ? pick(ENCOURAGEMENTS) : pick(TIP_MESSAGES)
      setMessage(msg)
    }
  }, 45000)

  onCleanup(() => {
    if (encouragementTimer) clearInterval(encouragementTimer)
  })

  return { visible, message, mood, emoji, catArt }
}
