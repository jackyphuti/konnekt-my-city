"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, SlidersHorizontal, X } from "lucide-react"

interface AdvancedSearchFilters {
  query: string
  category: string
  status: string
  priority: string
  dateRange: string
  sortBy: string
}

interface AdvancedSearchProps {
  onSearch?: (filters: AdvancedSearchFilters) => void
  isCompact?: boolean
}

export function AdvancedSearch({ onSearch, isCompact = false }: AdvancedSearchProps) {
  const [showFilters, setShowFilters] = useState(!isCompact)
  const [filters, setFilters] = useState<AdvancedSearchFilters>({
    query: "",
    category: "all",
    status: "all",
    priority: "all",
    dateRange: "30",
    sortBy: "recent",
  })

  const handleChange = (field: keyof AdvancedSearchFilters, value: string) => {
    const updated = { ...filters, [field]: value }
    setFilters(updated)
  }

  const handleSearch = () => {
    onSearch?.(filters)
  }

  const handleReset = () => {
    setFilters({
      query: "",
      category: "all",
      status: "all",
      priority: "all",
      dateRange: "30",
      sortBy: "recent",
    })
  }

  const hasActiveFilters = Object.values(filters).some((v) => v !== "all" && v !== "" && v !== "30" && v !== "recent")

  if (isCompact && !showFilters) {
    return (
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Input
              placeholder="Search issues..."
              value={filters.query}
              onChange={(e) => handleChange("query", e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
              <Search className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => setShowFilters(true)}
              variant="outline"
              className={hasActiveFilters ? "border-blue-600" : ""}
            >
              <SlidersHorizontal className="w-4 h-4" />
              {hasActiveFilters && <span className="ml-2 text-xs font-semibold">Active</span>}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5" />
              Advanced Search
            </CardTitle>
            <CardDescription>Filter and find issues that matter to you</CardDescription>
          </div>
          {isCompact && (
            <Button
              onClick={() => setShowFilters(false)}
              variant="ghost"
              size="sm"
              className="hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">Search Query</label>
          <Input
            placeholder="Enter keywords..."
            value={filters.query}
            onChange={(e) => handleChange("query", e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Category</label>
            <Select value={filters.category} onValueChange={(v) => handleChange("category", v)}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="pothole">Pothole</SelectItem>
                <SelectItem value="water-leak">Water Leak</SelectItem>
                <SelectItem value="power">Power Outage</SelectItem>
                <SelectItem value="street-light">Street Light</SelectItem>
                <SelectItem value="debris">Debris</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Status</label>
            <Select value={filters.status} onValueChange={(v) => handleChange("status", v)}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="acknowledged">Acknowledged</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Priority</label>
            <Select value={filters.priority} onValueChange={(v) => handleChange("priority", v)}>
              <SelectTrigger>
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Date Range</label>
            <Select value={filters.dateRange} onValueChange={(v) => handleChange("dateRange", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Last 30 days" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Sort By</label>
            <Select value={filters.sortBy} onValueChange={(v) => handleChange("sortBy", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Most Recent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="votes">Most Votes</SelectItem>
                <SelectItem value="priority">Highest Priority</SelectItem>
                <SelectItem value="comments">Most Commented</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button onClick={handleSearch} className="flex-1 bg-blue-600 hover:bg-blue-700">
            <Search className="w-4 h-4 mr-2" />
            Search Issues
          </Button>
          {hasActiveFilters && (
            <Button onClick={handleReset} variant="outline" className="flex-1">
              <X className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
