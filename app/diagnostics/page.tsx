"use client"

import * as React from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react"

interface DiagnosticResult {
  status: "success" | "error" | "unknown"
  message?: string
  value?: string
  details?: unknown
  hint?: string
  municipalityCount?: number
}

interface Diagnostics {
  envVars: {
    supabaseUrl?: DiagnosticResult
    supabaseAnonKey?: DiagnosticResult
  }
  connection: DiagnosticResult
  auth: DiagnosticResult
  database: DiagnosticResult
}

export default function DiagnosticsPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <h1 className="text-4xl font-bold">System Diagnostics</h1>
          <p className="mt-2 text-muted-foreground">Check your Supabase connection and database setup</p>
        </div>

        <DiagnosticsRunner />
      </div>
    </div>
  )
}

function DiagnosticsRunner() {
  const [results, setResults] = React.useState<Diagnostics | null>(null)
  const [isRunning, setIsRunning] = React.useState(false)

  const runDiagnostics = async () => {
    setIsRunning(true)
    const diagnostics: Diagnostics = {
      envVars: {},
      connection: { status: "unknown" },
      auth: { status: "unknown" },
      database: { status: "unknown" },
    }

    // Check environment variables
    diagnostics.envVars.supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      ? { status: "success", value: process.env.NEXT_PUBLIC_SUPABASE_URL }
      : { status: "error", message: "NEXT_PUBLIC_SUPABASE_URL not set" }

    diagnostics.envVars.supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ? { status: "success", value: "***" + process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.slice(-4) }
      : { status: "error", message: "NEXT_PUBLIC_SUPABASE_ANON_KEY not set" }

    // Test Supabase connection
    try {
      const supabase = createClient()
      console.log("[v0] Supabase client created:", supabase)

      // Test auth connection
      try {
        const { error } = await supabase.auth.getSession()
        if (error) {
          diagnostics.auth = {
            status: "error",
            message: error.message,
            details: error,
          }
        } else {
          diagnostics.auth = {
            status: "success",
            message: "Auth service is accessible",
          }
        }
      } catch (authError: Error | unknown) {
        const errorMessage = authError instanceof Error ? authError.message : String(authError)
        diagnostics.auth = {
          status: "error",
          message: errorMessage || "Failed to connect to auth service",
          details: errorMessage,
        }
      }

      // Test database connection
      try {
        const { error } = await supabase.from("municipalities").select("count")
        if (error) {
          diagnostics.database = {
            status: "error",
            message: error.message,
            hint: error.hint || "Run the SQL setup scripts to create tables",
          }
        } else {
          diagnostics.database = {
            status: "success",
            message: "Database is accessible",
            municipalityCount: 0,
          }
        }
      } catch (dbError: Error | unknown) {
        const errorMessage = dbError instanceof Error ? dbError.message : String(dbError)
        diagnostics.database = {
          status: "error",
          message: errorMessage || "Failed to connect to database",
        }
      }

      diagnostics.connection = {
        status: "success",
        message: "Supabase client initialized successfully",
      }
    } catch (error: Error | unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      diagnostics.connection = {
        status: "error",
        message: errorMessage || "Failed to create Supabase client",
      }
    }

    setResults(diagnostics)
    setIsRunning(false)
  }

  React.useEffect(() => {
    runDiagnostics()
  }, [])

  if (!results) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Environment Variables */}
      <Card>
        <CardHeader>
          <CardTitle>Environment Variables</CardTitle>
          <CardDescription>Required Supabase configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {results.envVars.supabaseUrl && <DiagnosticItem label="NEXT_PUBLIC_SUPABASE_URL" result={results.envVars.supabaseUrl} />}
          {results.envVars.supabaseAnonKey && <DiagnosticItem label="NEXT_PUBLIC_SUPABASE_ANON_KEY" result={results.envVars.supabaseAnonKey} />}
        </CardContent>
      </Card>

      {/* Connection Test */}
      <Card>
        <CardHeader>
          <CardTitle>Supabase Connection</CardTitle>
          <CardDescription>Client initialization test</CardDescription>
        </CardHeader>
        <CardContent>
          <DiagnosticItem label="Connection" result={results.connection} />
        </CardContent>
      </Card>

      {/* Auth Service */}
      <Card>
        <CardHeader>
          <CardTitle>Authentication Service</CardTitle>
          <CardDescription>Supabase Auth availability</CardDescription>
        </CardHeader>
        <CardContent>
          <DiagnosticItem label="Auth Service" result={results.auth} />
        </CardContent>
      </Card>

      {/* Database */}
      <Card>
        <CardHeader>
          <CardTitle>Database</CardTitle>
          <CardDescription>Database tables and connectivity</CardDescription>
        </CardHeader>
        <CardContent>
          <DiagnosticItem label="Database" result={results.database} />
          {results.database.status === "error" && (
            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Setup Required:</strong> Run the SQL scripts in order:
                <ol className="mt-2 ml-4 list-decimal space-y-1">
                  <li>001_create_database_schema.sql</li>
                  <li>002_seed_initial_data.sql</li>
                  <li>003_create_profile_trigger.sql</li>
                  <li>004_add_all_municipalities.sql</li>
                </ol>
                <Button asChild className="mt-4" size="sm">
                  <a href="/setup">View Setup Guide</a>
                </Button>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button onClick={runDiagnostics} disabled={isRunning}>
          {isRunning ? "Running..." : "Run Diagnostics Again"}
        </Button>
        <Button variant="outline" asChild>
          <a href="/setup">Setup Guide</a>
        </Button>
      </div>
    </div>
  )
}

function DiagnosticItem({ label, result }: { label: string; result: DiagnosticResult }) {
  const status = result?.status || "unknown"

  return (
    <div className="flex items-start gap-3">
      {status === "success" && <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />}
      {status === "error" && <XCircle className="h-5 w-5 text-red-600 mt-0.5" />}
      {status === "unknown" && <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />}

      <div className="flex-1">
        <div className="font-medium">{label}</div>
        {result.value && <div className="text-sm text-muted-foreground font-mono">{result.value}</div>}
        {result.message && (
          <div className={`text-sm ${status === "error" ? "text-red-600" : "text-muted-foreground"}`}>
            {result.message}
          </div>
        )}
        {result.hint && <div className="text-sm text-muted-foreground italic mt-1">{result.hint}</div>}
      </div>
    </div>
  )
}
