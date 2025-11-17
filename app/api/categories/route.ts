import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

const FALLBACK_CATEGORIES = [
  { id: "1", name: "Roads & Infrastructure", icon: "🛣️", color: "#ef4444" },
  { id: "2", name: "Electricity", icon: "⚡", color: "#f59e0b" },
  { id: "3", name: "Water & Sanitation", icon: "💧", color: "#3b82f6" },
  { id: "4", name: "Waste Management", icon: "🗑️", color: "#10b981" },
  { id: "5", name: "Public Safety", icon: "🚨", color: "#dc2626" },
  { id: "6", name: "Parks & Recreation", icon: "🌳", color: "#16a34a" },
]

export async function GET() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.log("[v0] Supabase not configured, using fallback categories")
      return NextResponse.json(FALLBACK_CATEGORIES)
    }

    const supabase = await createServerClient()

    const { data, error } = await supabase.from("issue_categories").select("*").order("name")

    if (error) {
      console.error("[v0] Error fetching categories:", error)
      return NextResponse.json(FALLBACK_CATEGORIES)
    }

    return NextResponse.json(data || FALLBACK_CATEGORIES)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json(FALLBACK_CATEGORIES, { status: 200 })
  }
}
