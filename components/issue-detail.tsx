"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft,
  MapPin,
  Clock,
  User,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Shield,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
} from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface IssueCategory {
  name: string
  icon: string
}

interface IssueProfile {
  full_name: string
}

interface Municipality {
  name: string
}

interface IssueUpdate {
  id: string
  created_at: string
  is_official: boolean
  profiles?: { full_name: string }
  update_text: string
}

export interface Issue {
  id: string
  title: string
  description: string
  status: string
  location: string
  created_at: string
  image_url?: string
  categories?: IssueCategory
  profiles?: IssueProfile
  municipalities?: Municipality
  issue_updates?: IssueUpdate[]
  [key: string]: unknown
}

interface IssueDetailProps {
  issue: Issue
  upvotes: number
  downvotes: number
  userVote: string | null
  currentUserId?: string
}

export function IssueDetail({
  issue,
  upvotes: initialUpvotes,
  downvotes: initialDownvotes,
  userVote: initialUserVote,
  currentUserId,
}: IssueDetailProps) {
  const [upvotes, setUpvotes] = useState(initialUpvotes)
  const [downvotes, setDownvotes] = useState(initialDownvotes)
  const [userVote, setUserVote] = useState(initialUserVote)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const supabase = createBrowserClient()

  const handleVote = async (voteType: "upvote" | "downvote") => {
    if (!currentUserId) {
      router.push("/auth/login?redirect=/issues/" + issue.id)
      return
    }

    try {
      // If user already voted the same way, remove the vote
      if (userVote === voteType) {
        await supabase.from("issue_votes").delete().eq("issue_id", issue.id).eq("user_id", currentUserId)

        if (voteType === "upvote") {
          setUpvotes(upvotes - 1)
        } else {
          setDownvotes(downvotes - 1)
        }
        setUserVote(null)
      } else {
        // Remove existing vote if any
        if (userVote) {
          await supabase.from("issue_votes").delete().eq("issue_id", issue.id).eq("user_id", currentUserId)

          if (userVote === "upvote") {
            setUpvotes(upvotes - 1)
          } else {
            setDownvotes(downvotes - 1)
          }
        }

        // Add new vote
        await supabase.from("issue_votes").insert({
          issue_id: issue.id,
          user_id: currentUserId,
          vote_type: voteType,
        })

        if (voteType === "upvote") {
          setUpvotes(upvotes + 1)
        } else {
          setDownvotes(downvotes + 1)
        }
        setUserVote(voteType)
      }
    } catch (error) {
      console.error("Error voting:", error)
      alert("Failed to vote. Please try again.")
    }
  }

  const handleAddComment = async () => {
    if (!currentUserId) {
      router.push("/auth/login?redirect=/issues/" + issue.id)
      return
    }

    if (!comment.trim()) return

    setIsSubmitting(true)
    try {
      const { error } = await supabase.from("issue_updates").insert({
        issue_id: issue.id,
        user_id: currentUserId,
        update_text: comment,
        is_official: false,
      })

      if (error) throw error

      setComment("")
      router.refresh()
    } catch (error) {
      console.error("Error adding comment:", error)
      alert("Failed to add comment. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusInfo = (status: string) => {
    type StatusInfo = { variant: "secondary" | "default" | "destructive"; label: string; icon: React.ComponentType<{ className?: string }>; color: string }
    const statusMap: Record<string, StatusInfo> = {
      pending: { variant: "secondary", label: "Pending Review", icon: Clock, color: "text-gray-600" },
      in_progress: { variant: "default", label: "In Progress", icon: TrendingUp, color: "text-blue-600" },
      resolved: { variant: "default", label: "Resolved", icon: CheckCircle2, color: "text-green-600" },
      rejected: { variant: "destructive", label: "Rejected", icon: AlertCircle, color: "text-red-600" },
    }

    return statusMap[status] || statusMap.pending
  }

  const statusInfo = getStatusInfo(issue.status)
  const StatusIcon = statusInfo.icon
  const netVotes = upvotes - downvotes
  const isVerified = netVotes >= 5

  // Sort updates by date, most recent first
  const sortedUpdates = issue.issue_updates
    ? [...issue.issue_updates].sort(
        (a: IssueUpdate, b: IssueUpdate) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
    : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Link href="/issues">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Issues Map
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Issue Card */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-3xl">{issue.categories?.icon}</span>
                      <CardTitle className="text-2xl">{issue.title}</CardTitle>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant={statusInfo.variant} className="gap-1">
                        <StatusIcon className="h-3 w-3" />
                        {statusInfo.label}
                      </Badge>
                      <Badge variant="outline">{issue.categories?.name}</Badge>
                      {isVerified && (
                        <Badge variant="default" className="gap-1 bg-green-600">
                          <Shield className="h-3 w-3" />
                          Community Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Issue Image */}
                {issue.image_url && (
                  <div className="w-full h-96 rounded-lg overflow-hidden border relative">
                    <Image
                      src={issue.image_url || "/placeholder.svg"}
                      alt={issue.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 800px"
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Description */}
                <div>
                  <h3 className="font-semibold text-lg mb-2">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">{issue.description}</p>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span>{issue.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4 flex-shrink-0" />
                    <span>Reported by {issue.profiles?.full_name || "Anonymous"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 flex-shrink-0" />
                    <span>
                      {new Date(issue.created_at).toLocaleDateString("en-ZA", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span>{issue.municipalities?.name}</span>
                  </div>
                </div>

                {/* Voting */}
                <div className="flex items-center gap-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Button
                      variant={userVote === "upvote" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleVote("upvote")}
                      className="gap-2"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      {upvotes}
                    </Button>
                    <Button
                      variant={userVote === "downvote" ? "destructive" : "outline"}
                      size="sm"
                      onClick={() => handleVote("downvote")}
                      className="gap-2"
                    >
                      <ThumbsDown className="h-4 w-4" />
                      {downvotes}
                    </Button>
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold text-lg">{netVotes}</span>
                    <span className="text-muted-foreground ml-1">net votes</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Updates and Comments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Updates & Comments ({sortedUpdates.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add Comment */}
                <div className="space-y-2">
                  <Textarea
                    placeholder="Add a comment or update..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    className="resize-none"
                  />
                  <Button onClick={handleAddComment} disabled={isSubmitting || !comment.trim()}>
                    {isSubmitting ? "Posting..." : "Post Comment"}
                  </Button>
                </div>

                {/* Existing Updates */}
                <div className="space-y-4 pt-4 border-t">
                  {sortedUpdates.length > 0 ? (
                    sortedUpdates.map((update: IssueUpdate) => (
                      <div
                        key={update.id}
                        className={`p-4 rounded-lg border ${update.is_official ? "bg-blue-50 border-blue-200" : "bg-gray-50"}`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-sm">{update.profiles?.full_name || "Anonymous"}</span>
                          {update.is_official && (
                            <Badge variant="default" className="text-xs bg-blue-600">
                              Official Update
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground ml-auto">
                            {new Date(update.created_at).toLocaleDateString("en-ZA", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed">{update.update_text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No updates yet. Be the first to comment!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Status Timeline */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Current Status */}
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 p-2 rounded-full ${statusInfo.color} bg-opacity-10`}>
                      <StatusIcon className={`h-4 w-4 ${statusInfo.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{statusInfo.label}</p>
                      <p className="text-xs text-muted-foreground">Current status</p>
                    </div>
                  </div>

                  {/* Status History from Updates */}
                  {sortedUpdates.filter((u: IssueUpdate) => u.is_official).length > 0 && (
                    <div className="border-l-2 border-gray-200 ml-5 pl-4 space-y-4">
                      {sortedUpdates
                        .filter((u: IssueUpdate) => u.is_official)
                        .map((update: IssueUpdate) => (
                          <div key={update.id} className="relative">
                            <div className="absolute -left-[1.4rem] top-1 w-3 h-3 rounded-full bg-blue-600 border-2 border-white"></div>
                            <p className="text-xs font-medium text-foreground">
                              {update.update_text.substring(0, 50)}...
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(update.created_at).toLocaleDateString("en-ZA", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        ))}
                    </div>
                  )}

                  {/* Initial Report */}
                  <div className="flex items-start gap-3 pt-4 border-t">
                    <div className="mt-1 p-2 rounded-full bg-gray-100">
                      <Clock className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">Issue Reported</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(issue.created_at).toLocaleDateString("en-ZA", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Community Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Community Engagement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Votes</span>
                  <span className="font-semibold">{upvotes + downvotes}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Net Score</span>
                  <span className={`font-semibold ${netVotes >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {netVotes >= 0 ? "+" : ""}
                    {netVotes}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Comments</span>
                  <span className="font-semibold">{sortedUpdates.filter((u: IssueUpdate) => !u.is_official).length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Official Updates</span>
                  <span className="font-semibold">{sortedUpdates.filter((u: IssueUpdate) => u.is_official).length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
