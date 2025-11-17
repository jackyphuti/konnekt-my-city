"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  MapPin,
  Search,
  TrendingUp,
  User,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Mail,
  MessageSquare,
  Phone,
  Copy,
  CheckCircle,
} from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { NotificationsPanel } from "@/components/notifications-panel"
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface IssueCategory {
  name: string
}

interface Municipality {
  name: string
}

interface Profile {
  id: string
  full_name: string
  municipalities?: Municipality
}

interface IssueProfile {
  full_name: string
  email?: string
  phone?: string
}

interface Issue {
  id: string
  title: string
  description: string
  location: string
  status: string
  priority: string
  created_at: string
  image_url?: string
  urgency?: string
  categories?: IssueCategory
  profiles?: IssueProfile
  [key: string]: unknown
}

interface MunicipalDashboardProps {
  profile: Profile
  issues: Issue[]
  stats: {
    total: number
    pending: number
    inProgress: number
    resolved: number
  }
}

export function MunicipalDashboard({ profile, issues: initialIssues, stats }: MunicipalDashboardProps) {
  const [issues] = useState(initialIssues)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)
  const [updateText, setUpdateText] = useState("")
  const [newStatus, setNewStatus] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(true)
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [copiedPhone, setCopiedPhone] = useState(false)
  const router = useRouter()
  const supabase = createBrowserClient()

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || issue.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleUpdateIssue = async () => {
    if (!selectedIssue || !updateText.trim()) return

    setIsSubmitting(true)
    try {
      // Add update to issue_updates table
      const { error: updateError } = await supabase.from("issue_updates").insert({
        issue_id: selectedIssue.id,
        user_id: profile.id,
        update_text: updateText,
        is_official: true,
      })

      if (updateError) throw updateError

      // Update issue status if changed
      if (newStatus && newStatus !== selectedIssue.status) {
        const { error: statusError } = await supabase
          .from("issues")
          .update({ status: newStatus })
          .eq("id", selectedIssue.id)

        if (statusError) throw statusError
      }

      // Reset form
      setUpdateText("")
      setNewStatus("")
      setSelectedIssue(null)

      // Refresh the page to show updated data
      router.refresh()
    } catch (error) {
      console.error("Error updating issue:", error)
      alert("Failed to update issue. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyToClipboard = (text: string, type: "email" | "phone") => {
    navigator.clipboard.writeText(text)
    if (type === "email") {
      setCopiedEmail(true)
      setTimeout(() => setCopiedEmail(false), 2000)
    } else {
      setCopiedPhone(true)
      setTimeout(() => setCopiedPhone(false), 2000)
    }
  }

  const getStatusBadge = (status: string) => {
    type BadgeConfig = { variant: "secondary" | "default" | "destructive"; icon: React.ComponentType<{ className?: string }> }
    const variants: Record<string, BadgeConfig> = {
      pending: { variant: "secondary", icon: Clock },
      in_progress: { variant: "default", icon: TrendingUp },
      resolved: { variant: "default", icon: CheckCircle2 },
      rejected: { variant: "destructive", icon: AlertCircle },
    }

    const config = variants[status] || variants.pending
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {status.replace("_", " ")}
      </Badge>
    )
  }

  interface CategoryData {
    name: string
    count: number
  }

  const categoryData = issues
    .reduce((acc: CategoryData[], issue: Issue) => {
      const category = issue.categories?.name || "Other"
      const existing = acc.find((item) => item.name === category)
      if (existing) {
        existing.count += 1
      } else {
        acc.push({ name: category, count: 1 })
      }
      return acc
    }, [])
    .sort((a, b) => b.count - a.count)

  const statusData = [
    { name: "Pending", value: stats.pending, color: "hsl(var(--chart-1))" },
    { name: "In Progress", value: stats.inProgress, color: "hsl(var(--chart-2))" },
    { name: "Resolved", value: stats.resolved, color: "hsl(var(--chart-3))" },
  ].filter((item) => item.value > 0)

  interface PriorityData {
    name: string
    count: number
  }

  const priorityData = issues.reduce((acc: PriorityData[], issue: Issue) => {
    const priority = (issue.priority as string) || "medium"
    const existing = acc.find((item) => item.name === priority)
    if (existing) {
      existing.count += 1
    } else {
      acc.push({ name: priority, count: 1 })
    }
    return acc
  }, [])

  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Municipal Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                {profile.municipalities?.name} - {profile.full_name}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Analytics and Notifications */}
              <Link href="/analytics">
                <Button variant="outline" size="icon">
                  <BarChart3 className="h-5 w-5" />
                </Button>
              </Link>
              <NotificationsPanel />
              <Button variant="outline" onClick={() => router.push("/auth/signout")}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inProgress}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.resolved}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Analytics Overview</CardTitle>
                <CardDescription>Visual breakdown of issues by category, status, and priority</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowAnalytics(!showAnalytics)}>
                {showAnalytics ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
          {showAnalytics && (
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Issues by Category */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Issues by Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        count: {
                          label: "Issues",
                          color: "hsl(var(--chart-1))",
                        },
                      }}
                      className="h-[250px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={categoryData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="count" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Issues by Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Issues by Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        pending: { label: "Pending", color: "hsl(var(--chart-1))" },
                        inProgress: { label: "In Progress", color: "hsl(var(--chart-2))" },
                        resolved: { label: "Resolved", color: "hsl(var(--chart-3))" },
                      }}
                      className="h-[250px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={statusData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {statusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Issues by Priority */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Issues by Priority</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        count: {
                          label: "Issues",
                          color: "hsl(var(--chart-2))",
                        },
                      }}
                      className="h-[250px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={priorityData} layout="horizontal">
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis dataKey="name" type="category" />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="count" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]}>
                            {priorityData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Issue Management</CardTitle>
            <CardDescription>View and manage reported issues in your municipality</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search issues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Issues List */}
        <div className="space-y-4">
          {filteredIssues.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No issues found matching your criteria.</p>
              </CardContent>
            </Card>
          ) : (
            filteredIssues.map((issue) => (
              <Card key={issue.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-4">
                    {/* Issue Image */}
                    {issue.image_url && (
                      <div className="lg:w-48 h-48 flex-shrink-0 relative rounded-lg overflow-hidden">
                        <Image
                          src={issue.image_url || "/placeholder.svg"}
                          alt={issue.title}
                          fill
                          sizes="(max-width: 1024px) 12rem, 12rem"
                          className="object-cover"
                        />
                      </div>
                    )}

                    {/* Issue Details */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-1">{issue.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{issue.description}</p>
                        </div>
                        {getStatusBadge(issue.status)}
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {issue.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {issue.profiles?.full_name || "Anonymous"}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {new Date(issue.created_at).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{issue.categories?.name}</Badge>
                        {issue.urgency && (
                          <Badge variant={issue.urgency === "high" ? "destructive" : "secondary"}>
                            {issue.urgency} urgency
                          </Badge>
                        )}
                      </div>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedIssue(issue)
                              setNewStatus(issue.status)
                            }}
                          >
                            Manage Issue
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Manage Issue</DialogTitle>
                            <DialogDescription>
                              Update the status, add official comments, and contact the reporter if needed.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-6">
                            {/* Issue Details */}
                            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                              <h3 className="font-semibold text-foreground">Issue Details</h3>
                              <div className="grid gap-2 text-sm">
                                <div>
                                  <p className="text-muted-foreground">Title</p>
                                  <p className="font-medium">{selectedIssue?.title}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Description</p>
                                  <p className="font-medium">{selectedIssue?.description}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Location</p>
                                  <p className="font-medium">{selectedIssue?.location}</p>
                                </div>
                              </div>
                            </div>

                            {/* Reporter Contact Information */}
                            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg space-y-3">
                              <h3 className="font-semibold text-foreground flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 text-blue-600" />
                                Contact Reporter
                              </h3>
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-between p-2 bg-white rounded border">
                                  <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">{selectedIssue?.profiles?.full_name || "Anonymous"}</span>
                                  </div>
                                </div>
                                
                                {selectedIssue?.profiles?.email && (
                                  <div className="flex items-center justify-between p-2 bg-white rounded border hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-2 min-w-0">
                                      <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                      <span className="truncate text-muted-foreground">{selectedIssue.profiles.email}</span>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        if (selectedIssue.profiles?.email) {
                                          copyToClipboard(selectedIssue.profiles.email, "email")
                                        }
                                      }}
                                      className="flex-shrink-0"
                                    >
                                      {copiedEmail ? (
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                      ) : (
                                        <Copy className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </div>
                                )}

                                {selectedIssue?.profiles?.phone && (
                                  <div className="flex items-center justify-between p-2 bg-white rounded border hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-2 min-w-0">
                                      <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                      <span className="truncate text-muted-foreground">{selectedIssue.profiles.phone}</span>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        if (selectedIssue.profiles?.phone) {
                                          copyToClipboard(selectedIssue.profiles.phone, "phone")
                                        }
                                      }}
                                      className="flex-shrink-0"
                                    >
                                      {copiedPhone ? (
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                      ) : (
                                        <Copy className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </div>
                                )}

                                {!selectedIssue?.profiles?.email && !selectedIssue?.profiles?.phone && (
                                  <p className="text-xs text-muted-foreground p-2">Reporter contact information not available</p>
                                )}
                              </div>
                            </div>

                            {/* Update Status */}
                            <div>
                              <Label htmlFor="status">Update Status</Label>
                              <Select value={newStatus} onValueChange={setNewStatus}>
                                <SelectTrigger id="status" className="mt-2">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="in_progress">In Progress</SelectItem>
                                  <SelectItem value="resolved">Resolved</SelectItem>
                                  <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Official Update */}
                            <div>
                              <Label htmlFor="update">Official Update</Label>
                              <Textarea
                                id="update"
                                placeholder="Add an official update or comment that the reporter will see..."
                                value={updateText}
                                onChange={(e) => setUpdateText(e.target.value)}
                                rows={4}
                                className="mt-2"
                              />
                              <p className="text-xs text-muted-foreground mt-1">
                                This update will be visible to the reporter and the community
                              </p>
                            </div>

                            <Button
                              onClick={handleUpdateIssue}
                              disabled={isSubmitting || !updateText.trim()}
                              className="w-full"
                            >
                              {isSubmitting ? "Updating..." : "Submit Update & Status Change"}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
