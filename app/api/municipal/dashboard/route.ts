import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.log("[v0] Supabase not configured, returning mock data for demo")
      // Return mock data for demonstration purposes
      return NextResponse.json({
        profile: {
          id: "demo-user",
          full_name: "Demo Municipal Official",
          email: "demo@municipality.gov",
          role: "municipal_official",
          municipality_id: "1",
          municipalities: { name: "City of Cape Town" },
        },
        issues: [
          {
            id: "1",
            title: "Pothole on Main Street",
            description: "Large pothole causing traffic issues",
            status: "pending",
            priority: "high",
            location: "Main Street & 5th Ave",
            latitude: -33.9249,
            longitude: 18.4241,
            created_at: new Date().toISOString(),
            category_id: "1",
            categories: { name: "Road & Infrastructure", icon: "construction" },
            profiles: { full_name: "John Citizen", email: "john@example.com" },
            upvotes: 15,
          },
          {
            id: "2",
            title: "Broken streetlight",
            description: "Streetlight not working for 2 weeks",
            status: "in_progress",
            priority: "medium",
            location: "Park Avenue",
            latitude: -33.9258,
            longitude: 18.4232,
            created_at: new Date(Date.now() - 86400000).toISOString(),
            category_id: "2",
            categories: { name: "Street Lighting", icon: "lightbulb" },
            profiles: { full_name: "Jane Smith", email: "jane@example.com" },
            upvotes: 8,
          },
          {
            id: "3",
            title: "Illegal dumping site",
            description: "Garbage dumped in public area",
            status: "resolved",
            priority: "high",
            location: "Industrial Zone",
            latitude: -33.9267,
            longitude: 18.4223,
            created_at: new Date(Date.now() - 172800000).toISOString(),
            category_id: "3",
            categories: { name: "Waste Management", icon: "trash" },
            profiles: { full_name: "Mike Johnson", email: "mike@example.com" },
            upvotes: 23,
          },
        ],
        stats: {
          total: 47,
          pending: 18,
          inProgress: 12,
          resolved: 17,
        },
      })
    }

    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user profile to check if they're a municipal official
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*, municipalities(name)")
      .eq("id", user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    if (profile.role !== "municipal_official") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    // Fetch issues for this municipality
    const { data: issues } = await supabase
      .from("issues")
      .select(`
        *,
        categories(name, icon),
        profiles(full_name, email),
        issue_updates(count)
      `)
      .eq("municipality_id", profile.municipality_id)
      .order("created_at", { ascending: false })

    // Fetch statistics
    const { count: totalIssues } = await supabase
      .from("issues")
      .select("*", { count: "exact", head: true })
      .eq("municipality_id", profile.municipality_id)

    const { count: pendingIssues } = await supabase
      .from("issues")
      .select("*", { count: "exact", head: true })
      .eq("municipality_id", profile.municipality_id)
      .eq("status", "pending")

    const { count: inProgressIssues } = await supabase
      .from("issues")
      .select("*", { count: "exact", head: true })
      .eq("municipality_id", profile.municipality_id)
      .eq("status", "in_progress")

    const { count: resolvedIssues } = await supabase
      .from("issues")
      .select("*", { count: "exact", head: true })
      .eq("municipality_id", profile.municipality_id)
      .eq("status", "resolved")

    return NextResponse.json({
      profile,
      issues: issues || [],
      stats: {
        total: totalIssues || 0,
        pending: pendingIssues || 0,
        inProgress: inProgressIssues || 0,
        resolved: resolvedIssues || 0,
      },
    })
  } catch (error) {
    console.error("[v0] Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
