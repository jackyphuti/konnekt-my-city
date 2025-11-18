import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { MapPin, Users, TrendingUp, Shield, Building2, Sparkles } from "lucide-react"
import { ImpactStats } from "@/components/impact-stats"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between mb-3 sm:mb-0">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0 truncate">
                <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 truncate">Konnekt My City</h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Connecting Communities</p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-start gap-2 sm:gap-3 sm:justify-end">
            <Link href="/report" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-xs sm:text-sm py-2 h-auto sm:h-10">
                Report Issue
              </Button>
            </Link>
            <Link href="/issues" className="flex-1 sm:flex-none">
              <Button variant="ghost" className="w-full sm:w-auto text-xs sm:text-sm py-2 h-auto sm:h-10 px-2 sm:px-4">Browse</Button>
            </Link>
            <Link href="/auth/login" className="flex-1 sm:flex-none">
              <Button variant="ghost" className="w-full sm:w-auto text-xs sm:text-sm py-2 h-auto sm:h-10 px-2 sm:px-4">Sign In</Button>
            </Link>
            <Link href="/features" className="hidden md:flex flex-1 sm:flex-none">
              <Button variant="ghost" className="w-full sm:w-auto text-xs sm:text-sm py-2 h-auto sm:h-10 px-2 sm:px-4 flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Features</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-8 sm:py-12 md:py-20 px-3 sm:px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-4 sm:mb-6 bg-blue-100 text-blue-800 hover:bg-blue-100 text-xs sm:text-sm">🇿🇦 Proudly South African</Badge>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 text-balance leading-tight">Your Voice, Your City, Your Change</h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 text-pretty leading-relaxed px-2 sm:px-0">
            Report infrastructure issues, track municipal responses, and build stronger communities across South Africa.
            From potholes to power outages, make your voice heard.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link href="/report" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-base sm:text-lg px-6 sm:px-8 py-2 sm:py-3 h-auto sm:h-12"
              >
                Report an Issue
              </Button>
            </Link>
            <Link href="/issues" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-2 sm:py-3 h-auto sm:h-12 bg-transparent">
                View Issues Map
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 sm:py-16 px-3 sm:px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">How Konnekt My City Works</h2>
            <p className="text-base sm:text-lg text-gray-600">Simple, transparent, effective civic engagement</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <CardTitle className="text-base sm:text-lg">Report Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-xs sm:text-sm">
                  Snap a photo, add location, and report infrastructure problems in your community
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <CardTitle className="text-base sm:text-lg">Community Support</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-xs sm:text-sm">
                  Upvote issues that affect you and add your voice to community concerns
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                </div>
                <CardTitle className="text-base sm:text-lg">Track Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-xs sm:text-sm">Follow real-time updates from municipal officials on issue resolution</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                </div>
                <CardTitle className="text-base sm:text-lg">Transparent Process</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-xs sm:text-sm">
                  Open communication between citizens and municipalities for accountability
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Platform Access Section */}
      <section className="py-12 sm:py-16 px-3 sm:px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">Access the Platform</h2>
            <p className="text-base sm:text-lg text-gray-600">Different portals for citizens and municipal officials</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 max-w-4xl mx-auto">
            <Card className="hover:shadow-xl transition-shadow border-2">
              <CardHeader className="text-center pb-3 sm:pb-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Users className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <CardTitle className="text-xl sm:text-2xl">Citizen Portal</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Report issues and track progress in your community
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <ul className="space-y-2 text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full flex-shrink-0"></div>
                    Report infrastructure issues
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full flex-shrink-0"></div>
                    Vote on community concerns
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full flex-shrink-0"></div>
                    Track issue status and updates
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full flex-shrink-0"></div>
                    View live issues map
                  </li>
                </ul>
                <div className="flex flex-col gap-2">
                  <Link href="/dashboard" className="w-full">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-xs sm:text-sm py-2 sm:py-2.5 h-auto sm:h-10">Go to Dashboard</Button>
                  </Link>
                  <Link href="/auth/sign-up" className="w-full">
                    <Button variant="outline" className="w-full bg-transparent text-xs sm:text-sm py-2 sm:py-2.5 h-auto sm:h-10">
                      Create Account
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow border-2">
              <CardHeader className="text-center pb-3 sm:pb-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Building2 className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <CardTitle className="text-xl sm:text-2xl">Municipal Portal</CardTitle>
                <CardDescription className="text-sm sm:text-base">Manage and respond to community issues</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <ul className="space-y-2 text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full flex-shrink-0"></div>
                    View all reported issues
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full flex-shrink-0"></div>
                    Update issue status
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full flex-shrink-0"></div>
                    Post official updates
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full flex-shrink-0"></div>
                    Analytics and reporting
                  </li>
                </ul>
                <div className="flex flex-col gap-2">
                  <Link href="/municipal" className="w-full">
                    <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 text-xs sm:text-sm py-2 sm:py-2.5 h-auto sm:h-10">Municipal Dashboard</Button>
                  </Link>
                  <Link href="/auth/login?redirect=/municipal" className="w-full">
                    <Button variant="outline" className="w-full bg-transparent text-xs sm:text-sm py-2 sm:py-2.5 h-auto sm:h-10">
                      Official Sign In
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Highlight Section */}
      <section className="py-12 sm:py-16 px-3 sm:px-4 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 sm:mb-12">
            <Badge className="mb-4 sm:mb-6 bg-purple-100 text-purple-800 hover:bg-purple-100 text-xs sm:text-sm">✨ Amazing New Features</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">Smarter Civic Engagement</h2>
            <p className="text-base sm:text-lg text-gray-600">Discover cool tools to make reporting easier and more impactful</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                  <span className="text-xl sm:text-2xl">🤖</span>
                </div>
                <CardTitle className="text-base sm:text-lg">AI Chatbot</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-xs sm:text-sm">
                  Get instant help from our intelligent assistant. Ask questions about reporting, voting, and tracking issues.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                  <span className="text-xl sm:text-2xl">⚡</span>
                </div>
                <CardTitle className="text-base sm:text-lg">Quick Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-xs sm:text-sm">
                  Report issues faster with pre-made templates for common problems like potholes and water leaks.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                  <span className="text-xl sm:text-2xl">🏆</span>
                </div>
                <CardTitle className="text-base sm:text-lg">Leaderboard</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-xs sm:text-sm">
                  Earn recognition and compete with your community. Build your reputation as a civic champion.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                  <span className="text-xl sm:text-2xl">📊</span>
                </div>
                <CardTitle className="text-base sm:text-lg">Priority Levels</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-xs sm:text-sm">
                  Issues are automatically prioritized by urgency and community votes to focus on what matters most.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                  <span className="text-xl sm:text-2xl">🔍</span>
                </div>
                <CardTitle className="text-base sm:text-lg">Advanced Search</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-xs sm:text-sm">
                  Find exactly what you're looking for with powerful filters for category, priority, status, and more.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                  <span className="text-xl sm:text-2xl">📢</span>
                </div>
                <CardTitle className="text-base sm:text-lg">Social Sharing</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-xs sm:text-sm">
                  Share issues on X, Facebook, WhatsApp, and LinkedIn to amplify your voice and build support.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Link href="/features">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-2.5 h-auto sm:h-11">
                Explore All Features
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="py-12 sm:py-16 px-3 sm:px-4 bg-gradient-to-br from-sky-50 to-blue-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">Stay Informed</h2>
            <p className="text-base sm:text-lg text-gray-600">Real-time weather, news, and infrastructure updates</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
            <Card className="text-center hover:shadow-lg transition-shadow border-0 bg-white/80">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <span className="text-xl sm:text-2xl">🌤️</span>
                </div>
                <CardTitle className="text-base sm:text-lg">Live Weather</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-xs sm:text-sm">
                  Get current conditions and forecasts for cities across South Africa with real-time updates.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow border-0 bg-white/80">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <span className="text-xl sm:text-2xl">📰</span>
                </div>
                <CardTitle className="text-base sm:text-lg">Latest News</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-xs sm:text-sm">
                  Curated news from across South Africa organized by category with real-time updates.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow border-0 bg-white/80">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <span className="text-xl sm:text-2xl">⚠️</span>
                </div>
                <CardTitle className="text-base sm:text-lg">Service Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-xs sm:text-sm">
                  Critical alerts on electricity, water, and road infrastructure affecting your community.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Link href="/updates">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-2.5 h-auto sm:h-11">
                View All Updates
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="py-12 sm:py-16 px-3 sm:px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">Our Impact</h2>
            <p className="text-base sm:text-lg text-gray-600">Real change happening across South Africa</p>
          </div>
          <ImpactStats variant="compact" />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 px-3 sm:px-4 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Ready to Make a Difference?</h2>
          <p className="text-base sm:text-xl text-blue-100 mb-6 sm:mb-8 px-3 sm:px-0">
            Join thousands of South Africans working together to improve their communities
          </p>
          <Link href="/auth/sign-up">
            <Button size="lg" variant="secondary" className="text-sm sm:text-lg px-4 sm:px-8 py-2 sm:py-2.5 h-auto sm:h-12">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12 px-3 sm:px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                <span className="font-bold text-sm sm:text-base">Konnekt My City</span>
              </div>
              <p className="text-gray-400 text-xs sm:text-sm">
                Empowering South African communities through civic engagement and transparency.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Platform</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
                <li>
                  <Link href="/issues" className="hover:text-white">
                    View Issues
                  </Link>
                </li>
                <li>
                  <Link href="/report" className="hover:text-white">
                    Report Issue
                  </Link>
                </li>
                <li>
                  <Link href="/updates" className="hover:text-white">
                    News & Updates
                  </Link>
                </li>
                <li>
                  <Link href="/municipal" className="hover:text-white">
                    Municipal Portal
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Account</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
                <li>
                  <Link href="/auth/login" className="hover:text-white">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/auth/sign-up" className="hover:text-white">
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-white">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Support</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-gray-400">
            <p>&copy; 2025 Konnekt My City. Building stronger communities across South Africa.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
