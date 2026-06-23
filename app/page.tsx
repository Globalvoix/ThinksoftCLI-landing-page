"use client"

import { useState } from "react"
import { Copy, Plus, Check, ChevronDown } from "lucide-react"
import { useUser, useClerk } from "@clerk/nextjs"
import { Signup } from "@/components/Signup"

function Step({ text, time }: { text: string; time: string }) {
  return (
    <div className="flex items-center gap-3">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="#555" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L20.6603 7V17L12 22L3.33975 17V7L12 2Z" />
      </svg>
      <span className="text-neutral-600">{text}</span>
      <span className="text-neutral-300">{time}</span>
    </div>
  )
}

export default function Home() {
  const { isSignedIn, user } = useUser()
  const { signOut } = useClerk()
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(-1)
  const [currentView, setCurrentView] = useState<"home" | "signup">("home")

  if (currentView === "signup") {
    return <Signup setCurrentView={setCurrentView} />
  }

  const handleCopy = () => {
    navigator.clipboard.writeText("npm install -g thinksoft")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] font-sans text-neutral-900 selection:bg-neutral-200 flex flex-col">
      <header className="flex h-20 items-center justify-between px-6 md:px-12 w-full max-w-[1400px] mx-auto">
        <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setCurrentView("home")}>
          <span className="text-[20px] font-bold tracking-[-0.04em] text-[#1C1C1C] mr-4">THINKSOFT</span>
        </div>
        <div className="flex items-center gap-2.5 text-[14px] text-[#111111]">
          {isSignedIn ? (
            <button
              onClick={() => signOut({ redirectUrl: "/" })}
              className="rounded-full border border-neutral-300 text-neutral-700 px-3.5 py-[7px] hover:bg-neutral-100 transition-colors"
            >
              Log out
            </button>
          ) : (
            <button
              onClick={() => setCurrentView("signup")}
              className="rounded-full bg-[#1C1C1C] text-white px-3.5 py-[7px] hover:bg-black transition-colors border border-transparent shadow-sm"
            >
              Try now
            </button>
          )}
        </div>
      </header>

        <main className="flex-1 w-full max-w-[1400px] mx-auto px-6 md:px-12 pt-10 md:pt-16 pb-24">
          <div className="mb-14">
            <div className="text-[14px] font-medium text-[#888888] mb-3 tracking-wide uppercase">CLI</div>
            <h1 className="text-[34px] sm:text-[40px] md:text-[44px] leading-[1.1] font-normal tracking-[-0.01em] text-[#111111]">
              Ship code with agents <br className="hidden sm:block" />
              <span className="text-[#888888]">Right from your terminal.</span>
            </h1>
          </div>

          <div className="relative rounded-[24px] bg-[#F2F0EC] border border-neutral-100 overflow-hidden flex flex-col lg:flex-row min-h-[580px]">
            <div className="flex-1 p-8 md:p-10 lg:p-14 flex flex-col justify-end min-h-[350px] lg:min-h-0 z-10">
              <h2 className="text-[26px] md:text-[30px] leading-[1.2] font-medium tracking-tight mb-8">
                Same commands, any environment.<br />
                <span className="text-neutral-500">Plug into your setup anywhere.</span>
              </h2>
              <div className="flex items-center gap-1 mb-3">
                <button className="px-3.5 py-1.5 rounded-full bg-[#E5E4DE] text-[12px] font-medium text-[#111] tracking-tight">PowerShell</button>
                <button className="px-3.5 py-1.5 rounded-full bg-[#E5E4DE] text-[12px] font-medium text-[#111] tracking-tight">macOS</button>
                <button className="px-3.5 py-1.5 rounded-full bg-[#E5E4DE] text-[12px] font-medium text-[#111] tracking-tight">Linux / WSL</button>
              </div>
              <div className="flex items-center bg-[#EBEAE6] rounded-[10px] p-[5px] pl-4 text-[13px] font-mono text-neutral-700 w-full max-w-[420px]">
                <span className="truncate flex-1 py-1.5">npm install -g thinksoft</span>
                <button
                  onClick={handleCopy}
                  className="ml-3 bg-[#2D2D2D] text-white p-2 rounded-[6px] hover:bg-[#111] transition-colors shadow-sm shrink-0"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>

            <div className="flex-[1.4] relative overflow-hidden bg-white/50 min-h-[400px] lg:min-h-0">
              <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url(/background.jpg)", filter: "saturate(0.8) contrast(0.9) brightness(1.05)" }} />
              <div className="absolute top-1/2 left-[55%] lg:left-[50%] -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[500px] bg-[#FDFDFD] rounded-[10px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden text-[13px]">
                <div className="h-10 border-b border-black/[0.04] flex items-center px-4 relative bg-[#F8F8F8]">
                  <div className="flex gap-2">
                    <div className="w-[11px] h-[11px] rounded-full bg-[#FF5F56] border border-black/10"></div>
                    <div className="w-[11px] h-[11px] rounded-full bg-[#FFBD2E] border border-black/10"></div>
                    <div className="w-[11px] h-[11px] rounded-full bg-[#27C93F] border border-black/10"></div>
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2 text-neutral-400 text-[12px] font-medium tracking-wide">agent</div>
                </div>
                <div className="p-4 font-mono text-[13px] leading-relaxed text-neutral-800">
                  <div className="bg-[#F8F8F8] border border-black/[0.04] rounded-[6px] py-3.5 px-4 mb-5 shadow-sm mt-3">
                    <div className="text-neutral-400 mb-2 font-mono text-[13px]">Question</div>
                    <div className="font-medium text-neutral-800 mb-3 tracking-tight font-sans text-[14px]">What data should the mission control display?</div>
                    <div className="flex flex-col gap-2 font-mono text-[13px]">
                      <div className="text-neutral-900 font-medium border-l-[2px] border-neutral-900 pl-2 -ml-[10px]">&nbsp;&nbsp;[x] Real-time metrics</div>
                      <div className="text-neutral-500">&nbsp;&nbsp;[ ] System status</div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2.5 pl-1 mb-5">
                    <Step text="Analyzed scope" time="2s" />
                    <Step text="Started 3 agents" time="" />
                    <div className="flex flex-col gap-2 pl-3 mt-1 text-[13px] text-neutral-500">
                      <div className="flex items-center gap-3">
                        <div className="w-[10px] h-[10px] bg-[#00C366] rounded-sm flex-shrink-0" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}></div>
                        <span className="text-neutral-800 font-medium">Health</span>
                        <span className="text-neutral-400">· Building health metrics panel</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-[10px] h-[10px] bg-[#00C366] rounded-sm flex-shrink-0" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}></div>
                        <span className="text-neutral-800 font-medium">Deployments</span>
                        <span className="text-neutral-400">· Creating deployment tracker</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-[10px] h-[10px] bg-[#00C366] rounded-sm flex-shrink-0" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}></div>
                        <span className="text-neutral-800 font-medium">Incidents</span>
                        <span className="text-neutral-400">· Building incident feed</span>
                      </div>
                    </div>
                  </div>
                  <div className="border border-neutral-200/80 rounded-[4px] py-1.5 px-3 flex justify-between items-center bg-white shadow-sm mb-4">
                    <div className="flex items-center gap-2 text-neutral-500">
                      <span>→</span>
                      <span>Add a follow-up</span>
                    </div>
                    <span className="text-neutral-400 text-[11px]">esc to stop</span>
                  </div>
                  <div className="flex flex-col gap-2 text-[12px] text-neutral-500 border-t border-dashed border-black/[0.06] pt-3">
                    <div className="text-[#32D74B] flex items-center gap-2 font-sans font-medium">
                      <div className="flex items-center justify-center relative w-3.5 h-3.5">
                        <div className="absolute inset-0 rounded-full border border-current opacity-40"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                      </div>
                      Plan (shift+tab to cycle)
                    </div>
                    <div className="font-mono text-neutral-400">GPT-5.5 Extra High Fast · 5%</div>
                    <div className="font-mono text-neutral-400">/ commands · @ files · ! shell</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16 md:mt-24">
            <div className="flex flex-col bg-[#F3F1EC] rounded-[24px] p-6 md:p-8 overflow-hidden relative border border-[#E3E2DA]/50 shadow-sm">
              <div className="mb-6 md:mb-10">
                <h3 className="text-[17px] font-medium text-[#111111] mb-2 tracking-tight">Always access the latest models</h3>
                <p className="text-[14.5px] leading-[1.4] text-[#666666]">Frontier models from Anthropic, OpenAI, Gemini, and more, at your fingertips.</p>
              </div>
              <div className="flex-1 relative min-h-[320px]">
                <div className="absolute inset-x-0 top-0 bottom-8 rounded-md font-mono text-[13px] text-neutral-800">
                  <div className="flex flex-col mb-5">
                    <span className="font-sans font-medium text-[13px]">Thinksoft Agent</span>
                    <span className="text-[#A39E93]">~/thinksoft/thinksoft-web</span>
                  </div>
                  <div className="border border-[#D1CEC6] rounded-[4px] px-3 bg-transparent flex items-center gap-3 mb-4 h-8 shadow-sm">
                    <span className="text-neutral-900">→</span>
                    <span>/model</span>
                  </div>
                  <div className="flex flex-col gap-2 pl-7 text-[#A39E93]">
                    <div>/model Auto</div>
                    <div>/model DeepSeek V4 Flash Free</div>
                    <div className="text-neutral-900 flex items-center gap-2.5 -ml-7 border-neutral-900 pl-0">
                      <span className="text-neutral-900 font-medium">→</span>
                      <span className="font-bold">/model Opus 4.8</span>
                    </div>
                    <div>/model GPT-5.5 High Fast</div>
                    <div>/model Gemini 3.1 Pro</div>
                    <div>/model Grok 4.3</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col bg-[#F3F1EC] rounded-[24px] p-6 md:p-8 overflow-hidden relative border border-[#E3E2DA]/50 shadow-sm">
              <div className="mb-6 md:mb-10">
                <h3 className="text-[17px] font-medium text-[#111111] mb-2 tracking-tight">Expert Subagents</h3>
                <p className="text-[14.5px] leading-[1.4] text-[#666666]">A team of specialized AI subagents working together to tackle different aspects of software development.</p>
              </div>
              <div className="flex-1 relative min-h-[320px] flex items-start justify-center pt-4 pb-8">
                <div className="grid grid-cols-3 gap-y-8 gap-x-8 md:gap-y-12 md:gap-x-12 text-[#CCC8C0]">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10"><path d="M12 2l4.5 4.5V11l-3 3-4-4V5.5L12 2zM5.5 13l4 4 3-3-4-4-3 3zm11 0l-3 3 4 4 3-3-4-4z" clipRule="evenodd" fillRule="evenodd" /></svg>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10"><path d="M15.5 2h-7L2 8.5v7L8.5 22h7l6.5-6.5v-7L15.5 2zM12 18A6 6 0 1112 6a6 6 0 010 12z" /></svg>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10"><path d="M4 4h16v16H4V4zm3 4h2v8H7V8zm4 0h6v2h-4v4h4v2h-6V8z" /></svg>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10"><path d="M12 2a8 8 0 00-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 00-8-8zm-2 9a2 2 0 110-4 2 2 0 010 4zm4 0a2 2 0 110-4 2 2 0 010 4z" /></svg>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10"><path d="M12 2L3 7l9 5 9-5-9-5zm0 11l-9-5v10l9 5 9-5V8l-9 5z" /></svg>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10"><path d="M4 4h4l8 10V4h4v16h-4L4 10v10H4V4z" /></svg>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10"><path d="M4 8h10v12H4V8zm4-4h12v12h-4v-2h2V6H10v2H8V4z" /></svg>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10"><path d="M4 4h16v16H4V4zm4 5l3 3-3 3v2l5-5-5-5v2zm4 8h5v-2h-5v2z" /></svg>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10"><path d="M17 3l-5 4-4-3-4 2v10l4 2 4-3 5 4 3-2V5l-3-2zm-5 11l-3-2.5V8.5L12 6l5 4v4l-5 4z" /></svg>
                </div>
              </div>
            </div>

            <div className="flex flex-col bg-[#F3F1EC] rounded-[24px] p-6 pb-0 md:p-8 md:pb-0 overflow-hidden relative border border-[#E3E2DA]/50 shadow-sm md:col-span-2 lg:col-span-1">
              <div className="mb-6 md:mb-10">
                <h3 className="text-[17px] font-medium text-[#111111] mb-2 tracking-tight">Write powerful scripts and automations</h3>
                <p className="text-[14.5px] leading-[1.4] text-[#666666]">Automatically update docs, trigger security reviews, or build custom coding agents.</p>
              </div>
              <div className="flex-1 relative min-h-[360px]">
                <div className="absolute left-2 md:left-4 top-2 bottom-0 w-8 bg-[#A8A395] rounded-tl-[8px]"></div>
                <div className="absolute inset-x-8 md:inset-x-10 top-6 bottom-0 bg-[#FAFAFA] rounded-t-[10px] shadow-xl flex flex-col overflow-hidden border border-black/5">
                  <div className="h-[36px] flex items-center px-4 gap-2 bg-[#F6F6F6] border-b border-black/[0.04]">
                    <div className="w-[10px] h-[10px] rounded-full bg-[#E5E5E5]"></div>
                    <div className="w-[10px] h-[10px] rounded-full bg-[#E5E5E5]"></div>
                    <div className="w-[10px] h-[10px] rounded-full bg-[#E5E5E5]"></div>
                  </div>
                  <div className="p-5 bg-[#FAFAFA] flex-1">
                    <div className="flex items-center gap-2 mb-4 font-sans text-[13px]">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="text-[#111]"><path d="M12 2A10 10 0 002 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.45-1.15-1.1-1.46-1.1-1.46-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" /></svg>
                      <span className="font-medium text-[#111]">acme-labs</span>
                      <span className="text-neutral-400">/</span>
                      <span className="font-medium text-[#111]">research</span>
                    </div>
                    <div className="flex gap-5 border-b border-neutral-200/60 text-[12.5px] text-neutral-500 mb-5 font-medium">
                      <div className="pb-2">Code</div>
                      <div className="pb-2">Pull requests</div>
                      <div className="pb-2 text-neutral-900 border-b-2 border-[#E3624D] -mb-[1px]">Actions</div>
                    </div>
                    <div className="flex items-start gap-3 mb-5">
                      <div className="mt-0.5"><div className="w-[15px] h-[15px] rounded-full bg-[#1F883D] flex items-center justify-center p-[2.5px]"><svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div></div>
                      <div className="flex-1 w-0 overflow-hidden">
                        <div className="text-neutral-900 font-medium font-sans mb-[5px] text-[12.5px] tracking-tight">Update documentation nightly</div>
                        <div className="bg-[#F8F8F8] border border-black/5 py-1.5 px-2 rounded-sm font-mono text-[11px] whitespace-nowrap overflow-hidden">
                          <span className="text-[#999]">$ agent -p --model &quot;GPT-5.5 Extra High&quot; &quot;Updat</span><span className="text-[#C6C6C6]">e</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 mb-5">
                      <div className="mt-0.5"><div className="w-[15px] h-[15px] rounded-full bg-[#1F883D] flex items-center justify-center p-[2.5px]"><svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div></div>
                      <div className="flex-1 w-0 overflow-hidden">
                        <div className="text-neutral-900 font-medium font-sans mb-[5px] text-[12.5px] tracking-tight">Send update to Slack</div>
                        <div className="bg-[#F8F8F8] border border-black/5 py-1.5 px-2 rounded-sm font-mono text-[11px] whitespace-nowrap overflow-hidden">
                          <span className="text-[#999]">$ agent -p --model &quot;composer-1&quot; &quot;Use Slack MCP</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 mb-2">
                      <div className="mt-0.5"><div className="w-[15px] h-[15px] rounded-full border-2 border-[#D29922] flex items-center justify-center"><div className="w-[5px] h-[5px] rounded-full bg-[#D29922]"></div></div></div>
                      <div className="flex-1 w-0 overflow-hidden">
                        <div className="text-neutral-900 font-medium font-sans mb-[5px] text-[12.5px] tracking-tight">Update Linear board</div>
                        <div className="bg-[#F8F8F8] border border-black/5 py-1.5 px-2 rounded-sm font-mono text-[11px] whitespace-nowrap overflow-hidden">
                          <span className="text-[#999]">$ linear issue update ENG-* --from-commits</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-32 md:mt-40 mb-20 max-w-[1200px] mx-auto w-full">
            <div className="text-center mb-10 md:mb-12">
              <h2 className="text-[28px] md:text-[32px] font-medium text-[#111111] tracking-tight mb-2">One platform. Endless possibilities.</h2>
              <p className="text-[18px] md:text-[21px] text-[#777777] font-normal tracking-tight">Create, improve, and launch software without limits.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
              {[
                ["Multi-Model Access", "Access the best AI model for every task without switching tools."],
                ["Open by Default", "Connect any AI provider and use the models that fit your workflow and budget."],
                ["Enterprise-Grade Security", "Built to uncover security risks and maintain high standards throughout development."],
                ["Persistent Project Intelligence", "Maintains a comprehensive understanding of your codebase, architecture, workflows, and historical decisions."],
                ["Specialized Skills", "Create reusable expertise, workflows, and development practices that Thinksoft can apply consistently across every project."],
                ["Dynamic Operating Modes", "Tailor Thinksoft's execution strategy with specialized modes designed for every stage of software development."],
                ["Open Integration Framework", "Extend Thinksoft with MCP-powered tools, services, and custom infrastructure without vendor lock-in."],
                ["Enterprise-Grade Architecture", "Build applications with scalable foundations, maintainable codebases, and production-ready engineering practices from day one."],
                ["Autonomous Browser Validation", "Uses a built-in browser environment to rigorously test applications, validate user workflows, uncover frontend vulnerabilities."],
              ].map(([title, desc]) => (
                <div key={title} className="bg-[#F3F2EC] rounded-[6px] p-6 md:p-7 flex flex-col">
                  <h4 className="text-[15px] font-medium text-[#111] mb-1.5 font-sans tracking-tight">{title}</h4>
                  <p className="text-[14.5px] text-[#777] leading-[1.5]">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-24 md:mt-32 max-w-[1200px] mx-auto w-full flex flex-col lg:flex-row gap-8 lg:gap-32 mb-32 border-t border-[#E3E2DA] pt-16 md:pt-32">
            <div className="lg:w-[30%]">
              <h2 className="text-[28px] md:text-[32px] font-medium text-[#111111] tracking-tight sticky top-8 mb-6 lg:mb-0">Questions & Answers</h2>
            </div>
            <div className="lg:w-[70%] flex flex-col">
              {[
                { q: "How do I install Thinksoft?", a: "Run <code>npm install -g thinksoft</code> in your terminal and you are ready." },
                { q: "How do I log in to the CLI?", a: "Run <code>thinksoft</code> and press any key. Your browser opens to authenticate via Clerk (Google, GitHub, or email)." },
                { q: "Do I need my own API keys?", a: "Yes. You bring your own keys from OpenAI, Anthropic, Google, or any supported provider." },
                { q: "How do I log out?", a: "Type <code>/logout</code> in the TUI or run <code>thinksoft logout</code>." },
                { q: "Is my code sent to third parties?", a: "Only to the AI provider you choose. We do not store your code." },
                { q: "Does Thinksoft work on Windows, macOS, and Linux?", a: "Yes. All platforms are supported with native installers." },
                { q: "What is Thinksoft CLI?", a: "Thinksoft CLI is an AI-powered coding assistant that helps you build, edit, debug, and understand code directly from your terminal." },
                { q: "Is Thinksoft CLI free?", a: "Yes. Thinksoft CLI is completely free to use." },
                { q: "Which operating systems are supported?", a: "Thinksoft CLI supports Windows, macOS, and Linux." },
                { q: "Can Thinksoft CLI work with existing projects?", a: "Yes. Thinksoft CLI can understand and work with both new and existing codebases." },
                { q: "How do I get started?", a: "Install Thinksoft CLI, open your terminal, and start building with AI in seconds." },
              ].map((item, i) => (
                <div key={i} className={`${i === 0 ? "border-y" : "border-b"} border-[#E3E2DA]`}>
                  <button
                    onClick={() => setExpanded(expanded === i ? -1 : i)}
                    className="w-full py-5 flex justify-between items-center cursor-pointer group text-left"
                  >
                    <span className="text-[15px] text-[#111111]">{item.q}</span>
                    <ChevronDown
                      size={20}
                      strokeWidth={1.5}
                      className={`text-[#111] transition-transform duration-200 shrink-0 ml-4 ${expanded === i ? "rotate-180" : ""}`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-200 ease-in-out ${
                      expanded === i ? "max-h-40 pb-5" : "max-h-0"
                    }`}
                  >
                    <p className="text-[14.5px] text-[#777] leading-relaxed pr-8" dangerouslySetInnerHTML={{ __html: item.a }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center mt-12 pb-24 w-full px-4 text-center overflow-x-hidden">
            <h2 className="text-[34px] sm:text-[40px] md:text-[48px] leading-[1.1] font-normal tracking-[-0.01em] text-[#111111] mb-8">Get started with Thinksoft.</h2>
            <div className="mt-4 flex flex-col items-start w-full sm:w-auto text-left">
              <div className="flex items-center gap-2 text-[14.5px] mb-3 ml-2">
                <button className="bg-[#E6E4DF] px-3.5 py-1 rounded-full text-[#111111]">PowerShell</button>
                <button className="bg-[#E6E4DF] px-3.5 py-1 rounded-full text-[#111111]">macOS</button>
                <button className="bg-[#E6E4DF] px-3.5 py-1 rounded-full text-[#111111]">Linux / WSL</button>
              </div>
              <div className="bg-[#EFECE8] rounded-[6px] p-3.5 pl-6 flex items-center justify-between w-[90vw] sm:w-[500px] max-w-full">
                <code className="text-[#333] font-mono text-[15px] truncate mr-4">npm install -g thinksoft</code>
                <button onClick={() => { navigator.clipboard.writeText("npm install -g thinksoft"); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="bg-[#222222] text-[#fff] p-2.5 rounded-[8px] hover:bg-black transition-colors flex-shrink-0">
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
            </div>
          </div>
        </main>
    </div>
  )
}
