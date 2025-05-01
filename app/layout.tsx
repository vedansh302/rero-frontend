import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import { Analytics } from "@vercel/analytics/react"
import { AuthProvider } from "@/contexts/auth-context"
import Head from "next/head" // ✅ Import Head

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Renewable Energy Resource Optimizer",
  description:
    "Find the optimal renewable energy solution for your location using AI-driven insights and real-time weather data.",
  generator: "v0.dev",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        {/* ✅ This ensures favicon is linked in all environments */}
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
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
