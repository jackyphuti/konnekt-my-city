"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Building2, Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface Municipality {
  id: string
  name: string
  province: string
}

export default function MunicipalSignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [position, setPosition] = useState("")
  const [department, setDepartment] = useState("")
  const [municipalityId, setMunicipalityId] = useState("")
  const [manualMunicipality, setManualMunicipality] = useState("")
  const [municipalities, setMunicipalities] = useState<Municipality[]>([])
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [dbError, setDbError] = useState(false)
  const [loadingMunicipalities, setLoadingMunicipalities] = useState(true)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchMunicipalities = async () => {
      try {
        const response = await fetch("/api/municipalities")
        const data = await response.json()

        if (data.error) {
          console.error("[v0] Error fetching municipalities:", data.error)
          setDbError(true)
          setLoadingMunicipalities(false)
          return
        }

        if (data.municipalities && data.municipalities.length > 0) {
          setMunicipalities(data.municipalities)
          setDbError(false)
        } else {
          setDbError(true)
        }
      } catch (err) {
        console.error("[v0] Error fetching municipalities:", err)
        setDbError(true)
      } finally {
        setLoadingMunicipalities(false)
      }
    }
    fetchMunicipalities()
  }, [])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (!dbError && !municipalityId) {
      setError("Please select your municipality")
      setIsLoading(false)
      return
    }

    if (dbError && !manualMunicipality.trim()) {
      setError("Please enter your municipality name")
      setIsLoading(false)
      return
    }

    if (!position.trim()) {
      setError("Please enter your official position")
      setIsLoading(false)
      return
    }

    try {
      const supabase = createClient()

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/municipal`,
          data: {
            position: position,
            department: department,
            municipality_id: municipalityId || null,
            municipality_name: dbError ? manualMunicipality : null,
            user_type: "municipal_official",
          },
        },
      })

      if (authError) throw authError

      // Create or update the user profile with municipal_official role
      if (authData.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .upsert({
            id: authData.user.id,
            full_name: position,
            municipality_id: municipalityId || null,
            user_type: "municipal_official",
          })

        if (profileError) {
          console.error("Profile creation error:", profileError)
          // Don't throw - user is still created, just profile might have issues
        }
      }

      router.push("/auth/sign-up-success")
    } catch (error: unknown) {
      console.error("[v0] Municipal sign up error:", error)

      if (error instanceof Error) {
        if (error.message.includes("Supabase is not configured")) {
          setError("Database connection not configured. Please contact the administrator or check the setup guide.")
        } else if (error.message.includes("Failed to fetch") || error.message.includes("fetch")) {
          setError("Unable to connect to database. Please contact the administrator.")
        } else {
          setError(error.message)
        }
      } else {
        setError("An unexpected error occurred. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
          scopes: "openid email profile",
        },
      })
      if (error) throw error
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes("Supabase is not configured")) {
        setError("Database connection not configured. Please contact the administrator or check the setup guide.")
      } else {
        setError(error instanceof Error ? error.message : "An error occurred")
      }
      setIsGoogleLoading(false)
    }
  }

  const selectedMunicipality = municipalities.find((m) => m.id === municipalityId)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Konnekt My City</span>
          </div>
          <p className="text-gray-600">Municipal Official Portal</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Municipal Official Account</CardTitle>
            <CardDescription>Register to manage and respond to community issues</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp}>
              <div className="flex flex-col gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                  <p className="font-medium mb-1">Municipal Official Registration</p>
                  <p className="text-xs">Complete your municipal details to manage issues in your jurisdiction.</p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={handleGoogleSignUp}
                  disabled={isGoogleLoading || isLoading}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  {isGoogleLoading ? "Connecting..." : "Continue with Google"}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Official Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="official@municipality.gov.za"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="position">Official Position</Label>
                  <Input
                    id="position"
                    type="text"
                    placeholder="e.g., Infrastructure Manager, Service Coordinator"
                    required
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="department">Department (Optional)</Label>
                  <Input
                    id="department"
                    type="text"
                    placeholder="e.g., Infrastructure & Services"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="municipality">Municipality</Label>
                  {!dbError ? (
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className="w-full justify-between bg-transparent"
                          disabled={loadingMunicipalities}
                        >
                          {loadingMunicipalities
                            ? "Loading municipalities..."
                            : selectedMunicipality
                              ? `${selectedMunicipality.name}, ${selectedMunicipality.province}`
                              : "Search for your municipality..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                        <Command shouldFilter={true}>
                          <CommandInput placeholder="Search municipality..." className="h-9" />
                          <CommandList className="max-h-[300px]">
                            <CommandEmpty>No municipality found.</CommandEmpty>
                            <CommandGroup>
                              {municipalities.map((municipality) => (
                                <CommandItem
                                  key={municipality.id}
                                  value={`${municipality.name} ${municipality.province}`}
                                  onSelect={() => {
                                    setMunicipalityId(municipality.id)
                                    setOpen(false)
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      municipalityId === municipality.id ? "opacity-100" : "opacity-0",
                                    )}
                                  />
                                  {municipality.name}, {municipality.province}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <Input
                      id="municipality"
                      type="text"
                      placeholder="e.g., City of Johannesburg, Gauteng"
                      required
                      value={manualMunicipality}
                      onChange={(e) => setManualMunicipality(e.target.value)}
                    />
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="repeat-password">Confirm Password</Label>
                  <Input
                    id="repeat-password"
                    type="password"
                    required
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                  />
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                  disabled={isLoading || isGoogleLoading}
                >
                  {isLoading ? "Creating account..." : "Register as Official"}
                </Button>
              </div>

              <div className="mt-6 text-center text-sm space-y-2">
                <p>
                  Already have an account?{" "}
                  <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
                    Sign in
                  </Link>
                </p>
                <p>
                  Register as a citizen instead?{" "}
                  <Link href="/auth/sign-up" className="text-green-600 hover:underline font-medium">
                    Regular Account
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
