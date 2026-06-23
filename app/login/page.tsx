"use client"

import { Suspense } from "react"
import { Signup } from "@/components/Signup"

function LoginFallback() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
      <p className="text-[#777] text-[14px]">Loading...</p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <Signup initialMode="login" />
    </Suspense>
  )
}
