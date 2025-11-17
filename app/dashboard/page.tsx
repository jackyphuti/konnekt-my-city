import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { MapPin, Plus, TrendingUp, Clock, CheckCircle, Sparkles } from "lucide-react"
import { NotificationsPanel } from "@/components/notifications-panel"
import { ImpactStats } from "@/components/impact-stats"

interface IssueCategory {
  name: string
  icon: string
  color: string
}

interface Municipality {
  name: string
}

interface Issue {
  id: string
  title: string
  created_at: string
  status: string
  issue_categories: IssueCategory
  municipalities: Municipality
  upvotes: number
}

export default async function DashboardPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Get user's reported issues
  const { data: userIssues } = await supabase
    .from("issues")
    .select(
      `
      *,
      issue_categories(name, icon, color),
      municipalities(name)
    `,
    )
    .eq("reporter_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  // Get issue stats
  const { count: totalIssues } = await supabase
    .from("issues")
    .select("*", { count: "exact", head: true })
    .eq("reporter_id", user.id)

  const { count: resolvedIssues } = await supabase
    .from("issues")
    .select("*", { count: "exact", head: true })
    .eq("reporter_id", user.id)
    .eq("status", "resolved")

  // Calculate vote counts for each issue
  const issuesWithVotes = userIssues
    ? await Promise.all(
        userIssues.map(async (issue) => {
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
    : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <Link href="/" className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Konnekt My City</h1>
              <p className="text-xs sm:text-sm text-gray-600">Dashboard</p>
            </div>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto flex-wrap sm:flex-nowrap justify-end">
            <NotificationsPanel />
            <Link href="/features" className="hidden sm:block">
              <Button variant="outline" size="sm" className="flex items-center gap-2 text-xs sm:text-sm">
                <Sparkles className="w-4 h-4" />
                <span className="hidden md:inline">Features</span>
              </Button>
            </Link>
            <Link href="/report" className="flex-1 sm:flex-none">
              <Button size="sm" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-xs sm:text-sm">
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden xs:inline">Report</span>
                <span className="sm:hidden">Report</span>
              </Button>
            </Link>
            <form action="/auth/signout" method="post" className="hidden sm:block">
              <Button variant="ghost" size="sm" type="submit" className="text-xs sm:text-sm">
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Welcome back, {profile?.full_name || "Citizen"}!</h1>
          <p className="text-sm sm:text-base text-gray-600">Track your reported issues and community impact</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Issues Reported</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold">{totalIssues || 0}</div>
              <p className="text-xs text-muted-foreground">Total issues you&apos;ve reported</p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Resolved Issues</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold">{resolvedIssues || 0}</div>
              <p className="text-xs text-muted-foreground">Issues that have been resolved</p>
            </CardContent>
          </Card>

          <Card className="bg-white col-span-1 sm:col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Success Rate</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold">
                {totalIssues && totalIssues > 0 ? Math.round(((resolvedIssues || 0) / totalIssues) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">Issues successfully resolved</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Issues */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="text-lg sm:text-xl">Your Recent Issues</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Track the status of your reported issues</CardDescription>
              </CardHeader>
              <CardContent>
                {issuesWithVotes && issuesWithVotes.length > 0 ? (
                  <div className="space-y-2 sm:space-y-4">
                    {issuesWithVotes.map((issue: Issue) => (
                      <Link key={issue.id} href={`/issues/${issue.id}`}>
                        <div className="flex items-start sm:items-center justify-between gap-2 sm:gap-4 p-3 sm:p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                          <div className="flex items-start sm:items-center gap-2 sm:gap-4 min-w-0">
                            <div className="text-lg sm:text-2xl flex-shrink-0">{issue.issue_categories?.icon}</div>
                            <div className="min-w-0">
                              <h3 className="font-medium text-sm sm:text-base truncate">{issue.title}</h3>
                              <p className="text-xs sm:text-sm text-gray-600 truncate">{issue.municipalities?.name}</p>
                              <p className="text-xs text-gray-500">{new Date(issue.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-3 flex-shrink-0">
                            <Badge
                              variant={
                                issue.status === "resolved"
                                  ? "default"
                                  : issue.status === "in_progress"
                                    ? "secondary"
                                    : "outline"
                              }
                              className="text-xs sm:text-sm whitespace-nowrap"
                            >
                              {issue.status.replace("_", " ")}
                            </Badge>
                            <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                              {issue.upvotes}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 sm:py-12">
                    <p className="text-sm sm:text-base text-gray-500 mb-4">You haven&apos;t reported any issues yet</p>
                    <Link href="/report">
                      <Button size="sm" className="text-xs sm:text-sm">Report Your First Issue</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200 h-full">
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                  <span className="truncate">Explore Features</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3">
                <p className="text-xs sm:text-sm text-gray-700">
                  We've added amazing new tools to improve your experience!
                </p>
                <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <span className="text-base sm:text-lg flex-shrink-0">🤖</span>
                    <div className="min-w-0">
                      <p className="font-medium text-xs sm:text-sm">AI Chatbot</p>
                      <p className="text-xs">Get instant help</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-base sm:text-lg flex-shrink-0">⚡</span>
                    <div className="min-w-0">
                      <p className="font-medium text-xs sm:text-sm">Quick Templates</p>
                      <p className="text-xs">Report faster</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-base sm:text-lg flex-shrink-0">🏆</span>
                    <div className="min-w-0">
                      <p className="font-medium text-xs sm:text-sm">Leaderboard</p>
                      <p className="text-xs">Earn recognition</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-base sm:text-lg flex-shrink-0">🔍</span>
                    <div className="min-w-0">
                      <p className="font-medium text-xs sm:text-sm">Advanced Search</p>
                      <p className="text-xs">Find anything</p>
                    </div>
                  </div>
                </div>
                <Link href="/features" className="block w-full pt-2">
                  <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700 text-xs sm:text-sm">
                    Explore All Features
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Impact Stats */}
        <Card className="mb-8">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-lg sm:text-xl">Community Impact</CardTitle>
            <CardDescription className="text-xs sm:text-sm">See the real change we&apos;re making together</CardDescription>
          </CardHeader>
          <CardContent>
            <ImpactStats variant="compact" />
          </CardContent>
        </Card>

        {/* Recent Issues */}
      </div>
    </div>
  )
}
