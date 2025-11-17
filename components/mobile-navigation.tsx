"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, MapPin, AlertCircle, Bell, User, Menu } from "lucide-react"
import { useState } from "react"

export function MobileNavigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path: string) => pathname === path || pathname?.startsWith(path)

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/issues", label: "Issues", icon: MapPin },
    { href: "/updates", label: "Updates", icon: AlertCircle },
    { href: "/report", label: "Report", icon: Bell },
    { href: "/dashboard", label: "Dashboard", icon: User },
  ]

  return (
    <>
      {/* Mobile Bottom Navigation */}
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

      {/* Desktop Sidebar Navigation */}
      <nav className="hidden md:flex flex-col gap-2 p-4">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
              isActive(href)
                ? "bg-blue-100 text-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      {/* Mobile Menu Button */}
      <button
        className="fixed md:hidden top-4 right-4 z-50 p-2 bg-white rounded-lg shadow-md"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <Menu className="h-6 w-6" />
      </button>
    </>
  )
}
