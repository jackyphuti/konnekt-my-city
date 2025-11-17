"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, CheckCircle, Zap } from "lucide-react"

interface ImpactStat {
  label: string
  value: string | number
  change?: string
  icon: React.ReactNode
  color: string
}

interface ImpactStatsProps {
  stats?: ImpactStat[]
  variant?: "compact" | "detailed"
}

const defaultStats: ImpactStat[] = [
  {
    label: "Issues Reported",
    value: "2,847",
    change: "+156 this month",
    icon: <TrendingUp className="w-5 h-5" />,
    color: "text-blue-600",
  },
  {
    label: "Community Members",
    value: "12,453",
    change: "+892 joined this month",
    icon: <Users className="w-5 h-5" />,
    color: "text-green-600",
  },
  {
    label: "Issues Resolved",
    value: "1,923",
    change: "67% resolution rate",
    icon: <CheckCircle className="w-5 h-5" />,
    color: "text-emerald-600",
  },
  {
    label: "Active Municipalities",
    value: "98",
    change: "Out of 257 in SA",
    icon: <Zap className="w-5 h-5" />,
    color: "text-orange-600",
  },
]

export function ImpactStats({ stats = defaultStats, variant = "detailed" }: ImpactStatsProps) {
  if (variant === "compact") {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color}`}>{stat.icon}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{stat.label}</CardTitle>
              <div className={`${stat.color} bg-opacity-10 p-2 rounded-lg`}>{stat.icon}</div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              {stat.change && <p className="text-sm text-gray-600">{stat.change}</p>}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function ImpactShowcase() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Community Impact</h2>
        <p className="text-gray-600">See the real change we're making together</p>
      </div>
      <ImpactStats />

      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Success Stories
          </CardTitle>
          <CardDescription>Recent victories from our communities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {[
              {
                title: "500+ Potholes Fixed",
                municipality: "City of Cape Town",
                description: "Community members reported 2,341 potholes, 500+ already repaired",
              },
              {
                title: "Water Crisis Awareness",
                municipality: "Ekurhuleni Metropolitan",
                description: "1,200 water leak reports helped identify critical infrastructure issues",
              },
              {
                title: "Street Lighting Initiative",
                municipality: "Johannesburg",
                description: "Community voted on 234 street light repairs, 189 completed",
              },
            ].map((story, i) => (
              <div key={i} className="p-3 bg-white rounded-lg border border-green-100">
                <p className="font-semibold text-gray-900">{story.title}</p>
                <p className="text-sm text-green-700 font-medium">{story.municipality}</p>
                <p className="text-sm text-gray-600 mt-1">{story.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
