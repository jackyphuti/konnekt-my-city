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
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Konnekt My City</h1>
              <p className="text-sm text-gray-600">Connecting Communities</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/issues">
              <Button variant="ghost">Browse Issues</Button>
            </Link>
            <Link href="/updates">
              <Button variant="ghost">Updates</Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/features">
              <Button variant="ghost" className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Features
              </Button>
            </Link>
            <Link href="/report">
              <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                Report Issue
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-6 bg-blue-100 text-blue-800 hover:bg-blue-100">🇿🇦 Proudly South African</Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 text-balance">Your Voice, Your City, Your Change</h1>
          <p className="text-xl text-gray-600 mb-8 text-pretty leading-relaxed">
            Report infrastructure issues, track municipal responses, and build stronger communities across South Africa.
            From potholes to power outages, make your voice heard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/report">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-lg px-8"
              >
                Report an Issue
              </Button>
            </Link>
            <Link href="/issues">
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
                View Issues Map
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How Konnekt My City Works</h2>
            <p className="text-lg text-gray-600">Simple, transparent, effective civic engagement</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Report Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Snap a photo, add location, and report infrastructure problems in your community
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">Community Support</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Upvote issues that affect you and add your voice to community concerns
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle className="text-lg">Track Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Follow real-time updates from municipal officials on issue resolution</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Transparent Process</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Open communication between citizens and municipalities for accountability
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Platform Access Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Access the Platform</h2>
            <p className="text-lg text-gray-600">Different portals for citizens and municipal officials</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="hover:shadow-xl transition-shadow border-2">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Citizen Portal</CardTitle>
                <CardDescription className="text-base">
                  Report issues and track progress in your community
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-sm text-gray-600 mb-6">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    Report infrastructure issues
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    Vote on community concerns
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    Track issue status and updates
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    View live issues map
                  </li>
                </ul>
                <div className="flex flex-col gap-2">
                  <Link href="/dashboard" className="w-full">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700">Go to Dashboard</Button>
                  </Link>
                  <Link href="/auth/sign-up" className="w-full">
                    <Button variant="outline" className="w-full bg-transparent">
                      Create Account
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow border-2">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Municipal Portal</CardTitle>
                <CardDescription className="text-base">Manage and respond to community issues</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-sm text-gray-600 mb-6">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                    View all reported issues
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                    Update issue status
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                    Post official updates
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                    Analytics and reporting
                  </li>
                </ul>
                <div className="flex flex-col gap-2">
                  <Link href="/municipal" className="w-full">
                    <Button className="w-full bg-gradient-to-r from-green-600 to-green-700">Municipal Dashboard</Button>
                  </Link>
                  <Link href="/auth/login?redirect=/municipal" className="w-full">
                    <Button variant="outline" className="w-full bg-transparent">
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
      <section className="py-16 px-4 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Badge className="mb-6 bg-purple-100 text-purple-800 hover:bg-purple-100">✨ Amazing New Features</Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Smarter Civic Engagement</h2>
            <p className="text-lg text-gray-600">Discover cool tools to make reporting easier and more impactful</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🤖</span>
                </div>
                <CardTitle className="text-lg">AI Chatbot</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get instant help from our intelligent assistant. Ask questions about reporting, voting, and tracking issues.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <CardTitle className="text-lg">Quick Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Report issues faster with pre-made templates for common problems like potholes and water leaks.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🏆</span>
                </div>
                <CardTitle className="text-lg">Leaderboard</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Earn recognition and compete with your community. Build your reputation as a civic champion.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <CardTitle className="text-lg">Priority Levels</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Issues are automatically prioritized by urgency and community votes to focus on what matters most.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🔍</span>
                </div>
                <CardTitle className="text-lg">Advanced Search</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Find exactly what you're looking for with powerful filters for category, priority, status, and more.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">📢</span>
                </div>
                <CardTitle className="text-lg">Social Sharing</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Share issues on X, Facebook, WhatsApp, and LinkedIn to amplify your voice and build support.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Link href="/features">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                Explore All Features
                <Sparkles className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-sky-50 to-blue-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Stay Informed</h2>
            <p className="text-lg text-gray-600">Real-time weather, news, and infrastructure updates</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="text-center hover:shadow-lg transition-shadow border-0 bg-white/80">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌤️</span>
                </div>
                <CardTitle className="text-lg">Live Weather</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get current conditions and forecasts for cities across South Africa with real-time updates.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow border-0 bg-white/80">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📰</span>
                </div>
                <CardTitle className="text-lg">Latest News</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Curated news from across South Africa organized by category with real-time updates.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow border-0 bg-white/80">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚠️</span>
                </div>
                <CardTitle className="text-lg">Service Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Critical alerts on electricity, water, and road infrastructure affecting your community.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Link href="/updates">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                View All Updates
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Impact</h2>
            <p className="text-lg text-gray-600">Real change happening across South Africa</p>
          </div>
          <ImpactStats variant="compact" />
        </div>
      </section>

      {/* Features Highlight Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Make a Difference?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of South Africans working together to improve their communities
          </p>
          <Link href="/auth/sign-up">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-6 h-6 text-blue-400" />
                <span className="font-bold">Konnekt My City</span>
              </div>
              <p className="text-gray-400 text-sm">
                Empowering South African communities through civic engagement and transparency.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-400">
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
              <h4 className="font-semibold mb-4">Account</h4>
              <ul className="space-y-2 text-sm text-gray-400">
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
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
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
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 Konnekt My City. Building stronger communities across South Africa.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
