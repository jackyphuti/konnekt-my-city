import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const error = requestUrl.searchParams.get("error")
  const errorDescription = requestUrl.searchParams.get("error_description")
  const origin = requestUrl.origin

  // Handle OAuth errors
  if (error) {
    console.error("OAuth Error:", error, errorDescription)
    // Redirect to sign-up with error message
    return NextResponse.redirect(
      `${origin}/auth/sign-up?error=${encodeURIComponent(errorDescription || error)}`
    )
  }

  // Handle successful code exchange
  if (code) {
    try {
      const supabase = await createServerClient()
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error("Code exchange error:", exchangeError)
        return NextResponse.redirect(
          `${origin}/auth/sign-up?error=${encodeURIComponent("Authentication failed. Please try again.")}`
        )
      }

      // Check user type to redirect appropriately
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Get user profile to check user_type
        const { data: profile } = await supabase
          .from("profiles")
          .select("user_type")
          .eq("id", user.id)
          .single()

        if (profile?.user_type === "municipal_official") {
          return NextResponse.redirect(`${origin}/municipal`)
        }
      }

      return NextResponse.redirect(`${origin}/dashboard`)
    } catch (err) {
      console.error("Callback error:", err)
      return NextResponse.redirect(
        `${origin}/auth/sign-up?error=${encodeURIComponent("An error occurred. Please try again.")}`
      )
    }
  }

  // No code or error, redirect to sign-up
  return NextResponse.redirect(`${origin}/auth/sign-up`)
}
