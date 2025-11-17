import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

const FALLBACK_ISSUES = [
  {
    id: "1",
    title: "Large pothole on Main Street",
    description: "Dangerous pothole near the traffic light causing vehicle damage",
    status: "reported",
    priority: "urgent",
    latitude: -26.2041,
    longitude: 28.0473,
    address: "123 Main Street, Johannesburg",
    upvotes: 15,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    issue_categories: { name: "Roads & Infrastructure", icon: "🛣️", color: "#ef4444" },
    municipalities: { name: "City of Johannesburg", province: "Gauteng" },
    profiles: { full_name: "John Doe" },
  },
  {
    id: "2",
    title: "Streetlight not working",
    description: "Streetlight has been out for 2 weeks, creating safety concerns at night",
    status: "acknowledged",
    priority: "high",
    latitude: -33.9249,
    longitude: 18.4241,
    address: "45 Long Street, Cape Town",
    upvotes: 8,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    issue_categories: { name: "Electricity", icon: "⚡", color: "#f59e0b" },
    municipalities: { name: "City of Cape Town", province: "Western Cape" },
    profiles: { full_name: "Jane Smith" },
  },
  {
    id: "3",
    title: "Overflowing waste bins",
    description: "Multiple bins overflowing for days, attracting pests",
    status: "in_progress",
    priority: "medium",
    latitude: -29.8587,
    longitude: 31.0218,
    address: "78 Beach Road, Durban",
    upvotes: 12,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    issue_categories: { name: "Waste Management", icon: "🗑️", color: "#10b981" },
    municipalities: { name: "eThekwini (Durban)", province: "KwaZulu-Natal" },
    profiles: { full_name: "Mike Johnson" },
  },
]

export async function GET() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.log("[v0] Supabase not configured, using fallback issues")
      return NextResponse.json(FALLBACK_ISSUES)
    }

    const supabase = await createServerClient()

    const { data: issuesData, error } = await supabase
      .from("issues")
      .select(`
        *,
        issue_categories(name, icon, color),
        municipalities(name, province),
        profiles(full_name)
      `)
      .not("latitude", "is", null)
      .not("longitude", "is", null)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching issues:", error)
      return NextResponse.json(FALLBACK_ISSUES)
    }

    // Calculate vote counts for each issue
    const issuesWithVotes = await Promise.all(
      (issuesData || []).map(async (issue) => {
        const { count: upvoteCount } = await supabase
          .from("issue_votes")
          .select("*", { count: "exact", head: true })
          .eq("issue_id", issue.id)
          .eq("vote_type", "upvote")

        const { count: downvoteCount } = await supabase
          .from("issue_votes")
          .select("*", { count: "exact", head: true })
          .eq("issue_id", issue.id)
          .eq("vote_type", "downvote")

        return {
          ...issue,
          upvotes: (upvoteCount || 0) - (downvoteCount || 0),
        }
      }),
    )

    return NextResponse.json(issuesWithVotes)
  } catch (error) {
    console.error("Error fetching issues:", error)
    return NextResponse.json(FALLBACK_ISSUES, { status: 200 })
  }
}
