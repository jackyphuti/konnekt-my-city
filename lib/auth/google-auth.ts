/**
 * Google OAuth Handler Utility
 * Centralized handler for Google authentication across the application
 * Used in: Login, Sign-up, Municipal Sign-up pages
 */

export async function handleGoogleSignIn(
  supabaseClient: any,
  options?: {
    onError?: (error: Error) => void
    customRedirect?: string
    additionalData?: Record<string, any>
  }
) {
  try {
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: options?.customRedirect || `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
        scopes: "openid email profile",
        ...(options?.additionalData && { data: options.additionalData }),
      },
    })

    if (error) {
      throw error
    }
  } catch (error: unknown) {
    console.error("Google OAuth error:", error)

    if (options?.onError) {
      if (error instanceof Error) {
        options.onError(error)
      } else {
        options.onError(new Error("An unexpected error occurred during Google authentication"))
      }
    }

    throw error
  }
}

/**
 * Handle Google Sign Up
 * Special variant for sign-up pages that may need different handling
 */
export async function handleGoogleSignUp(
  supabaseClient: any,
  options?: {
    onError?: (error: Error) => void
    userType?: "citizen" | "municipal_official"
    customRedirect?: string
  }
) {
  const userTypeData = options?.userType ? { user_type: options.userType } : {}

  return handleGoogleSignIn(supabaseClient, {
    ...options,
    additionalData: userTypeData,
  })
}

/**
 * Utility to determine if Google OAuth is properly configured
 * Returns true if Supabase appears to have Google provider configured
 */
export function isGoogleOAuthConfigured(): boolean {
  // Check if we have required environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return !!(supabaseUrl && supabaseKey)
}

/**
 * Get user-friendly error messages for Google OAuth
 */
export function getGoogleAuthErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes("Supabase is not configured")) {
      return "Database connection not configured. Please contact the administrator."
    }

    if (error.message.includes("OAuth")) {
      return "Google authentication is not yet configured. Please try signing up with email instead."
    }

    if (error.message.includes("Failed to fetch")) {
      return "Unable to connect to authentication service. Please check your internet connection."
    }

    return error.message
  }

  return "An unexpected error occurred during authentication. Please try again."
}
