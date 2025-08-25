import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { AIChatbot } from "@/components/ai-chatbot"
import { EnhancedNavbar } from "@/components/enhanced-navbar"

export const metadata: Metadata = {
  title: "TrustHive - Freelancing Platform",
  description: "Modern freelancing platform with AI-powered job matching",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body className="antialiased">
        <EnhancedNavbar />
        {children}
        <AIChatbot />
      </body>
    </html>
  )
}
