import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import { Analytics } from "@vercel/analytics/react"
import { AuthProvider } from "@/contexts/auth-context"
import Head from "next/head" // ✅ Import Head to manually inject favicon

const inter = Inter({ subsets: ["latin"] })

// Optional metadata if used elsewhere (not needed for favicon anymore)
export const metadata = {
  title: "Renewable Energy Resource Optimizer",
  description:
    "Find the optimal renewable energy solution for your location using AI-driven insights and real-time weather data.",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        {/* ✅ Manually linking favicon for full reliability */}
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Renewable Energy Resource Optimizer</title>
      </Head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Header />
            {children}
            <Analytics />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
