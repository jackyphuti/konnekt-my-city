"use client"

import { useEffect } from "react"

export function ServiceWorkerRegister() {
  useEffect(() => {
    // Only register service worker in production and on client side
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/service-worker.js", { scope: "/" })
          .then((registration) => {
            console.log("Service Worker registered successfully:", registration)
          })
          .catch((error) => {
            console.log("Service Worker registration failed:", error)
          })
      })
    }
  }, [])

  return null
}
