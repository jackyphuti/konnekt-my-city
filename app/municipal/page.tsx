"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MunicipalDashboard } from "@/components/municipal-dashboard"

interface Profile {
  id: string
  full_name: string
  email: string
  role: string
  municipality_id: string
  municipalities: {
    name: string
  }
}

interface Issue {
  id: string
  title: string
  description: string
  location: string
  status: string
  priority: string
  created_at: string
  [key: string]: unknown
}

interface Stats {
  total: number
  pending: number
  inProgress: number
  resolved: number
}

export default function MunicipalPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [issues, setIssues] = useState<Issue[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, inProgress: 0, resolved: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/municipal/dashboard")

        if (!response.ok) {
          if (response.status === 401) {
            router.push("/auth/login?redirect=/municipal")
            return
          }
          if (response.status === 403) {
            setError("Access Denied: You must be a municipal official to access this page.")
            setLoading(false)
            return
          }
          throw new Error("Failed to fetch dashboard data")
        }

        const data = await response.json()
        setProfile(data.profile)
        setIssues(data.issues)
        setStats(data.stats)
      } catch (err) {
        console.error("[v0] Error fetching municipal dashboard:", err)
        setError("Failed to load dashboard data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Error</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return null
  }

  return <MunicipalDashboard profile={profile} issues={issues} stats={stats} />
}
