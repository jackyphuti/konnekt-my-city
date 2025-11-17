import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle, Database, Play, Stethoscope, XCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SetupPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  const hasMissingCredentials = searchParams.error === "missing-credentials"

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Database Setup Guide</h1>
          <p className="text-gray-600">Follow these steps to set up your Konnekt My City database</p>
        </div>

        {hasMissingCredentials && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-900">Missing Supabase Credentials</AlertTitle>
            <AlertDescription className="text-red-800">
              <p className="mb-2">
                Your Supabase credentials are not configured. You need to create a{" "}
                <code className="bg-red-100 px-1 rounded">.env.local</code> file with your Supabase URL and API key.
              </p>
              <ol className="list-decimal list-inside space-y-1 mt-2">
                <li>
                  Copy <code className="bg-red-100 px-1 rounded">.env.local.example</code> to{" "}
                  <code className="bg-red-100 px-1 rounded">.env.local</code>
                </li>
                <li>
                  Get your credentials from{" "}
                  <a
                    href="https://supabase.com/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-medium"
                  >
                    Supabase Dashboard
                  </a>
                </li>
                <li>
                  Fill in the values in your <code className="bg-red-100 px-1 rounded">.env.local</code> file
                </li>
                <li>Restart your development server</li>
              </ol>
            </AlertDescription>
          </Alert>
        )}

        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-900">Important</AlertTitle>
          <AlertDescription className="text-blue-800">
            You must complete these setup steps before using the application. The database tables and initial data need
            to be created first.
          </AlertDescription>
        </Alert>

        <Card className="mb-6 border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-900">
              <AlertCircle className="w-5 h-5" />
              Step 0: Configure Environment Variables
            </CardTitle>
            <CardDescription className="text-orange-700">
              Set up your local environment before running database scripts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-orange-200">
              <p className="text-sm font-medium mb-2">Create your .env.local file:</p>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                <li>
                  Copy <code className="bg-gray-100 px-1 rounded">.env.local.example</code> to{" "}
                  <code className="bg-gray-100 px-1 rounded">.env.local</code>
                </li>
                <li>
                  Go to your{" "}
                  <a
                    href="https://supabase.com/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Supabase Dashboard
                  </a>
                </li>
                <li>Navigate to Project Settings → API</li>
                <li>Copy your Project URL and anon/public key</li>
                <li>
                  Paste them into your <code className="bg-gray-100 px-1 rounded">.env.local</code> file
                </li>
                <li>
                  Restart your development server (<code className="bg-gray-100 px-1 rounded">npm run dev</code>)
                </li>
              </ol>
            </div>
            <p className="text-sm text-orange-800 font-medium">
              ⚠️ Without these credentials, the app cannot connect to your database.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6 border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-900">
              <Stethoscope className="w-5 h-5" />
              Check Your Setup
            </CardTitle>
            <CardDescription className="text-purple-700">
              Run diagnostics to verify your Supabase connection and database setup
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="border-purple-300 hover:bg-purple-100 bg-transparent">
              <Link href="/diagnostics">Run System Diagnostics</Link>
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Step 1: Create Database Schema
              </CardTitle>
              <CardDescription>Set up the core database tables and security policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border">
                <p className="text-sm font-medium mb-2">Run this script:</p>
                <code className="text-sm bg-gray-900 text-green-400 p-2 rounded block">
                  scripts/001_create_database_schema.sql
                </code>
              </div>
              <p className="text-sm text-gray-600">
                This script creates all necessary tables including municipalities, profiles, issues, categories, and
                sets up Row Level Security policies.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                Step 2: Seed Initial Data
              </CardTitle>
              <CardDescription>Add sample municipalities and issue categories</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border">
                <p className="text-sm font-medium mb-2">Run this script:</p>
                <code className="text-sm bg-gray-900 text-green-400 p-2 rounded block">
                  scripts/002_seed_initial_data.sql
                </code>
              </div>
              <p className="text-sm text-gray-600">
                This adds sample municipalities and issue categories to get you started.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Step 3: Create Profile Trigger
              </CardTitle>
              <CardDescription>Automatically create user profiles on signup</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border">
                <p className="text-sm font-medium mb-2">Run this script:</p>
                <code className="text-sm bg-gray-900 text-green-400 p-2 rounded block">
                  scripts/003_create_profile_trigger.sql
                </code>
              </div>
              <p className="text-sm text-gray-600">
                This creates a database trigger that automatically creates a user profile when someone signs up.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Step 4: Add All Municipalities (Optional)
              </CardTitle>
              <CardDescription>Load all 257 South African municipalities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border">
                <p className="text-sm font-medium mb-2">Run this script:</p>
                <code className="text-sm bg-gray-900 text-green-400 p-2 rounded block">
                  scripts/004_add_all_municipalities.sql
                </code>
              </div>
              <p className="text-sm text-gray-600">
                This adds all South African municipalities organized by province. This is optional but recommended for
                production use.
              </p>
            </CardContent>
          </Card>

          <Alert className="border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-900">How to Run Scripts</AlertTitle>
            <AlertDescription className="text-green-800">
              <ol className="list-decimal list-inside space-y-1 mt-2">
                <li>Click the &quot;Run Script&quot; button that appears above each script file in the chat</li>
                <li>Or copy the SQL code and run it in your Supabase SQL editor</li>
                <li>Run the scripts in order (001, 002, 003, 004)</li>
              </ol>
            </AlertDescription>
          </Alert>

          <div className="flex justify-center gap-4 pt-4">
            <Button asChild variant="outline">
              <Link href="/diagnostics">Run Diagnostics</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-blue-600 to-green-600">
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
