import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { Suspense } from "react"
import { ChatbotAssistant } from "@/components/chatbot-assistant"
import { ServiceWorkerRegister } from "@/components/service-worker-register"
import { MobileNavigation } from "@/components/mobile-navigation"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Konnekt My City - Civic Engagement Platform",
  description: "Report infrastructure issues and connect with your municipality across South Africa",
  generator: "v0.app",
  manifest: "/manifest.json",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover",
  themeColor: "#0066CC",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Konnekt My City",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icon-180.png", sizes: "180x180", type: "image/png" },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Konnekt My City" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className={`font-sans ${inter.variable} ${jetbrainsMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          {children}
        </Suspense>
        <MobileNavigation />
        <ChatbotAssistant />
        <ServiceWorkerRegister />
      </body>
    </html>
  )
}
