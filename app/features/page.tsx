import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChatbotAssistant } from "@/components/chatbot-assistant"
import { IssueTemplatesGrid } from "@/components/issue-templates"
import { ImpactShowcase } from "@/components/impact-stats"
import { Leaderboard } from "@/components/leaderboard"
import { AdvancedSearch } from "@/components/advanced-search"
import { SocialShare } from "@/components/social-share"
import { PriorityBadge } from "@/components/priority-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  MessageSquare,
  Zap,
  TrendingUp,
  Trophy,
  Search,
  Share2,
  AlertTriangle,
  ArrowRight,
} from "lucide-react"

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Amazing Features</h1>
              <p className="text-sm text-gray-600">Experience the future of civic engagement</p>
            </div>
            <Button asChild className="bg-gradient-to-r from-blue-600 to-green-600">
              <a href="/dashboard">Back to Dashboard</a>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="chatbot" className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="chatbot" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Chatbot</span>
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">Templates</span>
            </TabsTrigger>
            <TabsTrigger value="impact" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Impact</span>
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">Leaderboard</span>
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Search</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">More</span>
            </TabsTrigger>
          </TabsList>

          {/* Chatbot Tab */}
          <TabsContent value="chatbot" className="space-y-6">
            <div className="max-w-2xl mx-auto">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                    Your AI Assistant
                  </CardTitle>
                  <CardDescription>
                    Meet your personal guide to reporting and tracking issues. Ask anything about the platform!
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-gray-700 mb-4">
                      <span className="font-semibold">💬 What the Assistant Does:</span>
                    </p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">→</span>
                        Answers questions about reporting issues
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">→</span>
                        Helps you navigate the platform
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">→</span>
                        Explains how voting and tracking works
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">→</span>
                        Available 24/7 to help you
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">→</span>
                        Quick replies with helpful suggestions
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg">
                    <p className="text-sm mb-2">
                      <span className="font-semibold">💡 Pro Tip:</span> Click the chat icon at the bottom right to
                      open the assistant on any page!
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Try It Out!</CardTitle>
                  <CardDescription>Click the chat bubble in the bottom right corner to get started</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button className="p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors">
                      <p className="font-medium text-sm text-gray-900">How do I report an issue?</p>
                      <p className="text-xs text-gray-600 mt-1">Learn the reporting process</p>
                    </button>
                    <button className="p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors">
                      <p className="font-medium text-sm text-gray-900">How does voting work?</p>
                      <p className="text-xs text-gray-600 mt-1">Understand community support</p>
                    </button>
                    <button className="p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors">
                      <p className="font-medium text-sm text-gray-900">Track my issues</p>
                      <p className="text-xs text-gray-600 mt-1">Monitor issue progress</p>
                    </button>
                    <button className="p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors">
                      <p className="font-medium text-sm text-gray-900">Help!</p>
                      <p className="text-xs text-gray-600 mt-1">Get general assistance</p>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-orange-600" />
                  Quick Report Templates
                </CardTitle>
                <CardDescription>
                  Speed up your reporting with pre-made templates for common issues
                </CardDescription>
              </CardHeader>
              <CardContent>
                <IssueTemplatesGrid showPreview={true} />
              </CardContent>
            </Card>

            <Card className="bg-orange-50 border-orange-200">
              <CardHeader>
                <CardTitle className="text-lg">Why Templates?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-700">
                <p>
                  <span className="font-semibold">⚡ Faster Reporting:</span> Get started in seconds, not minutes
                </p>
                <p>
                  <span className="font-semibold">✅ Better Details:</span> Suggested fields help you provide complete
                  information
                </p>
                <p>
                  <span className="font-semibold">📊 Consistent Data:</span> Makes issues easier for municipalities to
                  process
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Impact Tab */}
          <TabsContent value="impact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Community Impact & Achievements
                </CardTitle>
                <CardDescription>
                  See the real difference we're making together across South Africa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ImpactShowcase />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  Recognition & Achievements
                </CardTitle>
                <CardDescription>Celebrate our most active and impactful contributors</CardDescription>
              </CardHeader>
              <CardContent>
                <Leaderboard />
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-200">
              <CardHeader>
                <CardTitle className="text-lg">Earn Recognition</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-700">
                <p>
                  <span className="font-semibold">🏆 Community Champion:</span> 2000+ points - Lead by example
                </p>
                <p>
                  <span className="font-semibold">⭐ Active Reporter:</span> 1500+ points - Making a difference
                </p>
                <p>
                  <span className="font-semibold">📍 Local Hero:</span> 1000+ points - Your area, your voice
                </p>
                <p className="mt-4 text-xs text-gray-600">
                  Points are earned through reporting issues, receiving community votes, and helping resolve problems.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Search Tab */}
          <TabsContent value="search" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-blue-600" />
                  Advanced Search & Filters
                </CardTitle>
                <CardDescription>Find exactly what you're looking for with powerful search tools</CardDescription>
              </CardHeader>
              <CardContent>
                <AdvancedSearch isCompact={false} />
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg">Search Like a Pro</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-700">
                <p>
                  <span className="font-semibold">🔍 Keyword Search:</span> Find issues by description or location
                </p>
                <p>
                  <span className="font-semibold">📁 Filter by Category:</span> Potholes, water leaks, power, and more
                </p>
                <p>
                  <span className="font-semibold">🏷️ Priority Levels:</span> Critical issues, high priority, and more
                </p>
                <p>
                  <span className="font-semibold">📅 Date Range:</span> Last week, month, year, or all time
                </p>
                <p>
                  <span className="font-semibold">⭐ Sort Options:</span> Recent, most voted, highest priority, and more
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* More Tab */}
          <TabsContent value="advanced" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Social Share */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-pink-600" />
                    Social Sharing
                  </CardTitle>
                  <CardDescription>Amplify issues with one-click sharing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-gray-700">
                  <p>Share issues to:</p>
                  <ul className="space-y-1 ml-4">
                    <li>• X (Twitter) - Reach many followers</li>
                    <li>• Facebook - Connect with communities</li>
                    <li>• WhatsApp - Direct messaging</li>
                    <li>• LinkedIn - Professional networks</li>
                    <li>• Direct link - Copy and paste anywhere</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Priority Badges */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    Priority Levels
                  </CardTitle>
                  <CardDescription>Issues are prioritized by urgency</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs font-semibold mb-1">Critical Priority</p>
                      <PriorityBadge priority="critical" showIcon={true} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold mb-1">High Priority</p>
                      <PriorityBadge priority="high" showIcon={true} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold mb-1">Medium Priority</p>
                      <PriorityBadge priority="medium" showIcon={true} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold mb-1">Low Priority</p>
                      <PriorityBadge priority="low" showIcon={true} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-purple-200">
              <CardHeader>
                <CardTitle>Coming Soon Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-start gap-2">
                    <Badge className="bg-green-600 flex-shrink-0 mt-0.5">Coming</Badge>
                    <div>
                      <p className="font-semibold text-gray-900">Push Notifications</p>
                      <p className="text-xs text-gray-600">Get updates on your reported issues</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge className="bg-green-600 flex-shrink-0 mt-0.5">Coming</Badge>
                    <div>
                      <p className="font-semibold text-gray-900">Mobile App</p>
                      <p className="text-xs text-gray-600">Report issues on-the-go</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge className="bg-green-600 flex-shrink-0 mt-0.5">Coming</Badge>
                    <div>
                      <p className="font-semibold text-gray-900">AI Issue Analysis</p>
                      <p className="text-xs text-gray-600">Smart categorization & suggestions</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge className="bg-green-600 flex-shrink-0 mt-0.5">Coming</Badge>
                    <div>
                      <p className="font-semibold text-gray-900">Verified Badges</p>
                      <p className="text-xs text-gray-600">Show trusted community members</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <Card className="mt-12 bg-gradient-to-r from-blue-600 to-green-600 text-white border-0">
          <CardContent className="pt-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Ready to Make an Impact?</h2>
            <p className="text-blue-100 mb-6">Start reporting issues and help improve your community today!</p>
            <Button size="lg" variant="secondary" className="mb-2">
              Report Your First Issue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Chatbot Assistant - Fixed Position */}
      <ChatbotAssistant />
    </div>
  )
}
