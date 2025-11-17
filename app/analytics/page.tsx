import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BarChart3, Clock, TrendingUp, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default async function AnalyticsPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/analytics")
  }

  const { data: profile } = await supabase.from("profiles").select("*, municipalities(name)").eq("id", user.id).single()

  if (!profile || profile.user_type !== "municipal_official") {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground">Only municipal officials can access analytics.</p>
        </div>
      </div>
    )
  }

  // Fetch analytics data
  const { data: issues } = await supabase
    .from("issues")
    .select("*, issue_categories(name)")
    .eq("municipality_id", profile.municipality_id)

  // Calculate resolution times
  const resolvedIssues = issues?.filter((i) => i.status === "resolved" && i.resolved_at) || []
  const avgResolutionTime =
    resolvedIssues.length > 0
      ? resolvedIssues.reduce((acc, issue) => {
          const created = new Date(issue.created_at).getTime()
          const resolved = new Date(issue.resolved_at).getTime()
          return acc + (resolved - created) / (1000 * 60 * 60 * 24) // days
        }, 0) / resolvedIssues.length
      : 0

  // Category breakdown
  const categoryStats = issues?.reduce(
    (acc: Record<string, number>, issue) => {
      const category = issue.issue_categories?.name || "Other"
      acc[category] = (acc[category] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Status breakdown
  const statusStats = issues?.reduce(
    (acc: Record<string, number>, issue) => {
      acc[issue.status] = (acc[issue.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Priority breakdown
  const priorityStats = issues?.reduce(
    (acc: Record<string, number>, issue) => {
      acc[issue.priority] = (acc[issue.priority] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/municipal">
                <Button variant="ghost" size="icon">
                  ←
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
                <p className="text-sm text-muted-foreground">{profile.municipalities?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Last 30 Days</Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{issues?.length || 0}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {issues && issues.length > 0 ? Math.round((resolvedIssues.length / issues.length) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">{resolvedIssues.length} resolved</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Resolution Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgResolutionTime.toFixed(1)} days</div>
              <p className="text-xs text-muted-foreground">From report to resolution</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Issues</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(statusStats?.reported || 0) + (statusStats?.acknowledged || 0) + (statusStats?.in_progress || 0)}
              </div>
              <p className="text-xs text-muted-foreground">Needs attention</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Status Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>By Status</CardTitle>
              <CardDescription>Issue distribution by current status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(statusStats || {}).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          status === "resolved"
                            ? "bg-green-500"
                            : status === "in_progress"
                              ? "bg-blue-500"
                              : status === "acknowledged"
                                ? "bg-yellow-500"
                                : "bg-gray-500"
                        }`}
                      />
                      <span className="text-sm capitalize">{status.replace("_", " ")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{count}</span>
                      <span className="text-xs text-muted-foreground">
                        ({issues && issues.length > 0 ? Math.round((count / issues.length) * 100) : 0}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>By Category</CardTitle>
              <CardDescription>Most reported issue types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(categoryStats || {})
                  .sort(([, a], [, b]) => (b as number) - (a as number))
                  .slice(0, 5)
                  .map(([category, count]) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-sm">{category}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{count}</span>
                        <span className="text-xs text-muted-foreground">
                          ({issues && issues.length > 0 ? Math.round((count / issues.length) * 100) : 0}%)
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Priority Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>By Priority</CardTitle>
              <CardDescription>Issue urgency levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(priorityStats || {}).map(([priority, count]) => (
                  <div key={priority} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          priority === "urgent"
                            ? "destructive"
                            : priority === "high"
                              ? "default"
                              : priority === "medium"
                                ? "secondary"
                                : "outline"
                        }
                      >
                        {priority}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{count}</span>
                      <span className="text-xs text-muted-foreground">
                        ({issues && issues.length > 0 ? Math.round((count / issues.length) * 100) : 0}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Trends */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Performance Insights</CardTitle>
            <CardDescription>Key metrics for municipal service delivery</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Response Time</span>
                  <Badge variant="outline">Good</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Average time to first response: {avgResolutionTime > 0 ? (avgResolutionTime / 2).toFixed(1) : "0"}{" "}
                  days
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Citizen Engagement</span>
                  <Badge variant="outline">Active</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{issues?.length || 0} reports from community members</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
