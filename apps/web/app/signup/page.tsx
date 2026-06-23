"use client"

import { SignUp } from "@clerk/nextjs"

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
      <SignUp
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-none border border-[#E3E2DA] rounded-[16px]",
          },
        }}
      />
    </div>
  )
}
