"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { MapPin, Filter, Search, TrendingUp, Clock } from "lucide-react"
import dynamic from "next/dynamic"

// Dynamically import the map component to avoid SSR issues
const IssuesMap = dynamic(() => import("@/components/issues-map"), { ssr: false })

interface Issue {
  id: string
  title: string
  description: string
  status: string
  priority: string
  latitude: number
  longitude: number
  address: string
  upvotes: number
  created_at: string
  issue_categories: {
    name: string
    icon: string
    color: string
  }
  municipalities: {
    name: string
    province: string
  }
  profiles: {
    full_name: string
  }
}

interface IssueCategory {
  id: string
  name: string
  icon: string
  color: string
}

interface Municipality {
  id: string
  name: string
  province: string
}

export default function IssuesMapPage() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([])
  const [categories, setCategories] = useState<IssueCategory[]>([])
  const [municipalities, setMunicipalities] = useState<Municipality[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch issues
        const issuesResponse = await fetch("/api/issues")
        if (issuesResponse.ok) {
          const issuesData = await issuesResponse.json()
          setIssues(issuesData)
          setFilteredIssues(issuesData)
        }

        // Fetch categories and municipalities
        const [categoriesResponse, municipalitiesResponse] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/municipalities"),
        ])

        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json()
          setCategories(categoriesData)
        }

        if (municipalitiesResponse.ok) {
          const municipalitiesData = await municipalitiesResponse.json()
          setMunicipalities(municipalitiesData)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    let filtered = issues

    if (selectedCategory !== "all") {
      filtered = filtered.filter((issue) => issue.issue_categories?.name === selectedCategory)
    }

    if (selectedMunicipality !== "all") {
      filtered = filtered.filter((issue) => issue.municipalities?.name === selectedMunicipality)
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((issue) => issue.status === selectedStatus)
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (issue) =>
          issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          issue.address?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredIssues(filtered)
  }, [issues, selectedCategory, selectedMunicipality, selectedStatus, searchTerm])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "acknowledged":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Konnekt My City</h1>
              <p className="text-sm text-gray-600">Issues Map</p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link href="/report">
              <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                Report Issue
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Issues Map</h1>
          <p className="text-gray-600">Explore infrastructure issues reported across South African communities</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filter Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search issues..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        <div className="flex items-center gap-2">
                          <span>{category.icon}</span>
                          <span>{category.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Municipality</label>
                <Select value={selectedMunicipality} onValueChange={setSelectedMunicipality}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Municipalities</SelectItem>
                    {municipalities.map((municipality) => (
                      <SelectItem key={municipality.id} value={municipality.name}>
                        {municipality.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="reported">Reported</SelectItem>
                    <SelectItem value="acknowledged">Acknowledged</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Results</label>
                <div className="flex items-center h-10 px-3 bg-gray-50 rounded-md">
                  <span className="text-sm font-medium">{filteredIssues.length} issues</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Map and Issues List */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2">
            <Card className="h-[600px]">
              <CardContent className="p-0 h-full">
                {!isLoading && <IssuesMap issues={filteredIssues} />}
                {isLoading && (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading map...</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Issues List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Issues</h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {filteredIssues.slice(0, 20).map((issue) => (
                <Card key={issue.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <Link href={`/issues/${issue.id}`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{issue.issue_categories?.icon}</span>
                          <h3 className="font-medium text-sm line-clamp-1">{issue.title}</h3>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <TrendingUp className="w-3 h-3" />
                          {issue.upvotes}
                        </div>
                      </div>

                      <p className="text-xs text-gray-600 mb-3 line-clamp-2">{issue.description}</p>

                      <div className="flex items-center justify-between mb-2">
                        <Badge className={`text-xs ${getStatusColor(issue.status)}`}>
                          {issue.status.replace("_", " ")}
                        </Badge>
                        <Badge className={`text-xs ${getPriorityColor(issue.priority)}`}>{issue.priority}</Badge>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{issue.municipalities?.name}</span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(issue.created_at).toLocaleDateString()}
                        </div>
                      </div>

                      {issue.address && (
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {issue.address}
                        </p>
                      )}
                    </Link>
                  </CardContent>
                </Card>
              ))}

              {filteredIssues.length === 0 && !isLoading && (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No issues found matching your filters</p>
                  <Link href="/report">
                    <Button>Report an Issue</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
