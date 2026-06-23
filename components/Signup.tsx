"use client"

import { useSignIn, useSignUp } from "@clerk/nextjs"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, FormEvent } from "react"

interface SignupProps {
  setCurrentView?: (view: "home" | "signup") => void
  initialMode?: "login" | "signup"
}

export function Signup({ setCurrentView, initialMode = "signup" }: SignupProps) {
  const [isLogin, setIsLogin] = useState(initialMode === "login")
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [step, setStep] = useState<"email" | "code">("email")
  const [error, setError] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get("redirect_url") || "/"
  const { isLoaded: signInLoaded, signIn } = useSignIn()
  const { isLoaded: signUpLoaded, signUp, setActive } = useSignUp()

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")

    if (isLogin) {
      if (!signInLoaded) return
      try {
        const result = await signIn.create({
          identifier: email,
        })

        if (result.status === "needs_first_factor") {
          const emailCodeFactor = result.supportedFirstFactors?.find(
            (f: any) => f.strategy === "email_code"
          ) as { emailAddressId: string; strategy: string } | undefined
          if (emailCodeFactor) {
            await signIn.prepareFirstFactor({
              strategy: "email_code",
              emailAddressId: emailCodeFactor.emailAddressId,
            })
            setStep("code")
          } else {
            setError("Email code authentication is not available. Try another method.")
          }
        } else if (result.status === "complete") {
          await (setActive as any)({ session: result.createdSessionId })
          router.push(redirectUrl)
        }
      } catch (err: any) {
        setError(err.errors?.[0]?.message || "Something went wrong")
      }
    } else {
      if (!signUpLoaded) return
      try {
        await signUp.create({ emailAddress: email })
        await signUp.prepareVerification({ strategy: "email_code" })
        setStep("code")
      } catch (err: any) {
        setError(err.errors?.[0]?.message || "Something went wrong")
      }
    }
  }

  const handleCodeSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")

    if (isLogin) {
      if (!signInLoaded) return
      try {
        const result = await signIn.attemptFirstFactor({ strategy: "email_code", code })
        if (result.status === "complete") {
          await signIn.createdSessionId ? (setActive as any)({ session: result.createdSessionId }) : null
          router.push(redirectUrl)
        }
      } catch (err: any) {
        setError(err.errors?.[0]?.message || "Invalid code")
      }
    } else {
      if (!signUpLoaded) return
      try {
        const result = await signUp.attemptVerification({ strategy: "email_code", code })
        if (result.status === "complete") {
          await setActive({ session: result.createdSessionId })
          router.push(redirectUrl)
        }
      } catch (err: any) {
        setError(err.errors?.[0]?.message || "Invalid code")
      }
    }
  }

  const handleOAuth = async (provider: "oauth_github" | "oauth_google") => {
    if (!signInLoaded) return
    try {
      const completeUrl = redirectUrl !== "/" ? redirectUrl : "/"
await signIn.authenticateWithRedirect({ strategy: provider, redirectUrl: "/sso-callback", redirectUrlComplete: completeUrl })
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "OAuth failed")
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center font-sans tracking-tight text-neutral-900 selection:bg-neutral-200">
      <div className="w-full max-w-[340px] flex flex-col items-center relative -top-[4vh]">
        <h1 className="text-[19px] font-medium text-[#111] mb-1.5 tracking-[-0.01em]">
          {isLogin ? "Log in to Thinksoft" : "Welcome to Thinksoft"}
        </h1>
        <p className="text-[13.5px] text-[#777] mb-8 font-normal">
          {isLogin ? "Enter your details below" : "Create a new account"}
        </p>

        {step === "email" ? (
          <>
            <div className="w-full flex flex-col gap-2.5 mb-6">
              <button type="button" onClick={() => handleOAuth("oauth_github")} className="w-full relative flex items-center justify-center bg-[#F1F1F1] hover:bg-[#E5E5E5] text-[#111] text-[13px] font-medium py-[8px] px-4 rounded-[6px] transition-colors border border-[#DBDBDB] shadow-[0_1px_1px_rgba(0,0,0,0.02),inset_0_1px_0_rgba(255,255,255,0.7)] group">
                <div className="absolute left-[17px]">
                  <svg width="15" height="15" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="group-hover:opacity-80 transition-opacity">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" fill="#000000" />
                  </svg>
                </div>
                <span>Continue with GitHub</span>
              </button>
              <button type="button" onClick={() => handleOAuth("oauth_google")} className="w-full relative flex items-center justify-center bg-[#F1F1F1] hover:bg-[#E5E5E5] text-[#111] text-[13px] font-medium py-[8px] px-4 rounded-[6px] transition-colors border border-[#DBDBDB] shadow-[0_1px_1px_rgba(0,0,0,0.02),inset_0_1px_0_rgba(255,255,255,0.7)] group">
                <div className="absolute left-[17px]">
                  <svg width="15" height="15" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="group-hover:opacity-80 transition-opacity">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>
                <span>Continue with Google</span>
              </button>
            </div>

            <div className="w-full flex items-center gap-4 mb-5">
              <div className="h-px bg-neutral-200 flex-1"></div>
              <span className="text-[#A3A3A3] text-[10px] uppercase font-medium tracking-[0.05em]">OR</span>
              <div className="h-px bg-neutral-200 flex-1"></div>
            </div>

            <form onSubmit={handleEmailSubmit} className="w-full flex flex-col gap-3 mb-6">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-[#DBDBDB] focus:border-blue-500 rounded-[6px] px-3.5 py-[8px] text-[14px] outline-none focus:shadow-[0_0_0_1px_rgba(59,130,246,0.3)] placeholder:text-[#999] text-[#111] shadow-[inset_0_1px_1px_rgba(0,0,0,0.02)]"
                required
              />
              {error && <p className="text-red-500 text-[12px]">{error}</p>}
              <button type="submit" className="w-full bg-[#1C1C1C] hover:bg-black text-white rounded-[6px] py-[8.5px] text-[13.5px] font-medium transition-colors border border-transparent shadow-[0_1px_1px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.1)]">
                {isLogin ? "Log in" : "Sign up"}
              </button>
            </form>
          </>
        ) : (
          <form onSubmit={handleCodeSubmit} className="w-full flex flex-col gap-3 mb-6">
            <p className="text-[13px] text-[#777]">Enter the verification code sent to {email}</p>
            <input
              type="text"
              placeholder="Verification code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full border border-[#DBDBDB] focus:border-blue-500 rounded-[6px] px-3.5 py-[8px] text-[14px] outline-none focus:shadow-[0_0_0_1px_rgba(59,130,246,0.3)] placeholder:text-[#999] text-[#111] shadow-[inset_0_1px_1px_rgba(0,0,0,0.02)]"
              required
            />
            {error && <p className="text-red-500 text-[12px]">{error}</p>}
            <button type="submit" className="w-full bg-[#1C1C1C] hover:bg-black text-white rounded-[6px] py-[8.5px] text-[13.5px] font-medium transition-colors border border-transparent shadow-[0_1px_1px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.1)]">
              Verify
            </button>
          </form>
        )}

        <div className="text-[13px] text-[#777]">
          {isLogin ? (
            <>
              Don&apos;t have an account?{" "}
              <button onClick={() => { setIsLogin(false); setStep("email"); setError("") }} className="text-[#3B82F6] hover:underline hover:text-blue-700 transition-colors">Sign up</button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button onClick={() => { setIsLogin(true); setStep("email"); setError("") }} className="text-[#3B82F6] hover:underline hover:text-blue-700 transition-colors">Log in</button>
            </>
          )}
        </div>

        {setCurrentView && (
          <button onClick={() => setCurrentView("home")} className="mt-6 text-[13px] text-[#777] hover:text-[#111] transition-colors">
            ← Back to home
          </button>
        )}
      </div>
    </div>
  )
}
