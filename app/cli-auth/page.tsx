"use client"

import { useUser } from "@clerk/nextjs"
import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState, Suspense } from "react"

function CliAuthInner() {
  const { isLoaded, isSignedIn, user } = useUser()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "redirecting" | "error">("loading")
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    if (!isLoaded) return

    if (!isSignedIn) {
      router.push(`/login?redirect_url=/cli-auth?${searchParams.toString()}`)
      return
    }

    const port = searchParams.get("port")
    if (!port) {
      setStatus("error")
      setErrorMsg("Missing port parameter")
      return
    }

    setStatus("redirecting")

    fetch("/api/cli-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error || `HTTP ${res.status}`)
        }
        return data
      })
      .then((data) => {
        if (data.token) {
          window.location.href = `http://localhost:${port}/callback?token=${data.token}`
        } else {
          throw new Error("No token in response")
        }
      })
      .catch((err) => {
        console.error("[cli-auth] client error:", err.message)
        setErrorMsg(err.message)
        setStatus("error")
      })
  }, [isLoaded, isSignedIn, user, searchParams, router])

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
      <div className="text-center">
        {status === "loading" && <p className="text-[#777] text-[14px]">Checking authentication...</p>}
        {status === "redirecting" && <p className="text-[#777] text-[14px]">Redirecting to CLI...</p>}
        {status === "error" && (
          <div>
            <p className="text-red-500 text-[14px] mb-2">Authentication failed. Please try again.</p>
            {errorMsg && <p className="text-neutral-500 text-[12px] mb-4">{errorMsg}</p>}
            <button
              onClick={() => window.location.href = "/"}
              className="bg-[#1C1C1C] text-white px-4 py-2 rounded-[8px] text-[13px]"
            >
              Go home
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CliAuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center"><p className="text-[#777] text-[14px]">Loading...</p></div>}>
      <CliAuthInner />
    </Suspense>
  )
}
