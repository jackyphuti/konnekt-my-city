"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, MapPin, AlertCircle, Bell, User, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"

export function MobileNavigation() {
  const pathname = usePathname()
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(true)

  // Detect if screen is mobile or desktop
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const isActive = (path: string) => pathname === path || pathname?.startsWith(path)

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/issues", label: "Issues", icon: MapPin },
    { href: "/updates", label: "Updates", icon: AlertCircle },
    { href: "/report", label: "Report", icon: Bell },
    { href: "/", label: "Dashboard", icon: User },
  ]

  return (
    <>
      {/* Mobile Bottom Navigation - Only visible on mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-40">
        <div className="flex justify-around items-center h-16">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center w-16 h-16 transition-colors ${
                isActive(href)
                  ? "text-blue-600 border-t-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs mt-1">{label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Desktop Menu Button - Only visible on desktop */}
      <button
        className="hidden md:fixed top-4 right-4 z-50 p-2 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-colors"
        onClick={() => setDesktopMenuOpen(!desktopMenuOpen)}
        aria-label="Toggle menu"
      >
        {desktopMenuOpen ? (
          <X className="h-6 w-6 text-gray-700" />
        ) : (
          <Menu className="h-6 w-6 text-gray-700" />
        )}
      </button>

      {/* Desktop Popup Menu - Only visible on desktop when opened */}
      {desktopMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="hidden md:fixed inset-0 z-40 bg-black/20"
            onClick={() => setDesktopMenuOpen(false)}
          />

          {/* Popup Menu */}
          <nav className="hidden md:flex fixed top-14 right-4 flex-col gap-2 p-4 bg-white rounded-lg shadow-lg border border-gray-200 z-50 min-w-48">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(href)
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setDesktopMenuOpen(false)}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{label}</span>
              </Link>
            ))}
          </nav>
        </>
      )}
    </>
  )
}
