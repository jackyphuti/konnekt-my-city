import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

const FALLBACK_MUNICIPALITIES = [
  { id: "1", name: "City of Cape Town", province: "Western Cape" },
  { id: "2", name: "City of Johannesburg", province: "Gauteng" },
  { id: "3", name: "eThekwini (Durban)", province: "KwaZulu-Natal" },
  { id: "4", name: "City of Tshwane (Pretoria)", province: "Gauteng" },
  { id: "5", name: "Nelson Mandela Bay", province: "Eastern Cape" },
  { id: "6", name: "Buffalo City", province: "Eastern Cape" },
  { id: "7", name: "Ekurhuleni", province: "Gauteng" },
  { id: "8", name: "Mangaung", province: "Free State" },
]

export async function GET() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.log("[v0] Supabase not configured, using fallback municipalities")
      return NextResponse.json(FALLBACK_MUNICIPALITIES)
    }

    const supabase = await createClient()

    const { data, error } = await supabase.from("municipalities").select("id, name, province").order("name")

    if (error) {
      console.error("[v0] Error fetching municipalities:", error)
      return NextResponse.json(FALLBACK_MUNICIPALITIES)
    }

    return NextResponse.json(data || FALLBACK_MUNICIPALITIES)
  } catch (error) {
    console.error("[v0] Unexpected error:", error)
    return NextResponse.json(FALLBACK_MUNICIPALITIES)
  }
}
