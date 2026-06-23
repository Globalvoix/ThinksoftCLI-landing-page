import type { Metadata } from "next"
import { ClerkProvider } from "@clerk/nextjs"
import "./globals.css"

const baseUrl = "https://thinksoft.ai"

export const metadata: Metadata = {
  title: {
    default: "Thinksoft — AI-Powered Coding Assistant for Your Terminal",
    template: "%s | Thinksoft",
  },
  description:
    "Thinksoft CLI is a free AI-powered coding assistant that helps you build, edit, debug, and understand code directly from your terminal. Works on Windows, macOS, and Linux.",
  keywords: [
    "Thinksoft",
    "Thinksoft CLI",
    "AI coding assistant",
    "terminal AI",
    "AI code editor",
    "free AI coding tool",
    "AI developer tool",
    "code with AI",
    "terminal coding assistant",
  ],
  metadataBase: new URL(baseUrl),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Thinksoft",
    title: "Thinksoft — AI-Powered Coding Assistant for Your Terminal",
    description:
      "Thinksoft CLI is a free AI-powered coding assistant that helps you build, edit, debug, and understand code directly from your terminal.",
    url: baseUrl,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Thinksoft — AI-Powered Coding Assistant",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Thinksoft — AI-Powered Coding Assistant for Your Terminal",
    description:
      "Thinksoft CLI is a free AI-powered coding assistant that helps you build, edit, debug, and understand code directly from your terminal.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: baseUrl,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  category: "technology",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "Thinksoft",
                url: baseUrl,
                description:
                  "Thinksoft CLI is a free AI-powered coding assistant that helps you build, edit, debug, and understand code directly from your terminal.",
                potentialAction: {
                  "@type": "SearchAction",
                  target: {
                    "@type": "EntryPoint",
                    urlTemplate: `${baseUrl}/search?q={search_term_string}`,
                  },
                  "query-input": "required name=search_term_string",
                },
              }),
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                name: "Thinksoft CLI",
                operatingSystem: "Windows, macOS, Linux",
                applicationCategory: "DeveloperApplication",
                offers: {
                  "@type": "Offer",
                  price: "0",
                  priceCurrency: "USD",
                },
                description:
                  "Thinksoft CLI is a free AI-powered coding assistant that helps you build, edit, debug, and understand code directly from your terminal.",
              }),
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: [
                  {
                    "@type": "Question",
                    name: "How do I install Thinksoft?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Run <code>npm install -g thinksoft</code> in your terminal and you are ready.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "How do I log in to the CLI?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Run thinksoft and press any key. Your browser opens to authenticate via Clerk (Google, GitHub, or email).",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Do I need my own API keys?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Yes. You bring your own keys from OpenAI, Anthropic, Google, or any supported provider.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "How do I log out?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Type /logout in the TUI or run thinksoft logout.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Is my code sent to third parties?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Only to the AI provider you choose. We do not store your code.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Does Thinksoft work on Windows, macOS, and Linux?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Yes. All platforms are supported with native installers.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "What is Thinksoft CLI?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Thinksoft CLI is an AI-powered coding assistant that helps you build, edit, debug, and understand code directly from your terminal.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Is Thinksoft CLI free?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Yes. Thinksoft CLI is completely free to use.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Which operating systems are supported?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Thinksoft CLI supports Windows, macOS, and Linux.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Can Thinksoft CLI work with existing projects?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Yes. Thinksoft CLI can understand and work with both new and existing codebases.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "How do I get started?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Install Thinksoft CLI, open your terminal, and start building with AI in seconds.",
                    },
                  },
                ],
              }),
            }}
          />
        </head>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
