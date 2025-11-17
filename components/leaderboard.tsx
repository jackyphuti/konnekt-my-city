"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Target, Zap } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface LeaderboardEntry {
  rank: number
  name: string
  avatar?: string
  score: number
  badge?: string | null
  contribution: string
}

interface LeaderboardProps {
  title?: string
  variant?: "reporters" | "communities" | "officials"
}

const reportersData: LeaderboardEntry[] = [
  {
    rank: 1,
    name: "Thabo M.",
    score: 2450,
    badge: "🏆 Community Champion",
    contribution: "127 issues reported",
  },
  {
    rank: 2,
    name: "Amahle K.",
    score: 2180,
    badge: "⭐ Active Reporter",
    contribution: "98 issues reported",
  },
  {
    rank: 3,
    name: "Sipho T.",
    score: 1950,
    badge: "📍 Local Hero",
    contribution: "84 issues reported",
  },
  {
    rank: 4,
    name: "Naledi S.",
    score: 1820,
    badge: undefined,
    contribution: "76 issues reported",
  },
  {
    rank: 5,
    name: "Mandla J.",
    score: 1650,
    badge: undefined,
    contribution: "68 issues reported",
  },
]

const communitiesData: LeaderboardEntry[] = [
  {
    rank: 1,
    name: "Soweto Community",
    score: 15680,
    badge: "🏆 Most Active",
    contribution: "1,247 votes, 89 issues",
  },
  {
    rank: 2,
    name: "Cape Town Civic Alliance",
    score: 14200,
    badge: "⭐ Highly Engaged",
    contribution: "1,128 votes, 76 issues",
  },
  {
    rank: 3,
    name: "Johannesburg Watch",
    score: 12950,
    badge: "📍 Top Supporters",
    contribution: "987 votes, 64 issues",
  },
  {
    rank: 4,
    name: "Durban City Voice",
    score: 11780,
    badge: undefined,
    contribution: "856 votes, 52 issues",
  },
  {
    rank: 5,
    name: "Pretoria United",
    score: 10650,
    badge: undefined,
    contribution: "745 votes, 48 issues",
  },
]

const officialsData: LeaderboardEntry[] = [
  {
    rank: 1,
    name: "City of Cape Town",
    score: 9840,
    badge: "🏆 Most Responsive",
    contribution: "892 issues resolved",
  },
  {
    rank: 2,
    name: "Ekurhuleni Metropolitan",
    score: 8920,
    badge: "⭐ Fast Responders",
    contribution: "756 issues resolved",
  },
  {
    rank: 3,
    name: "Johannesburg City",
    score: 8450,
    badge: "📍 Efficient Team",
    contribution: "687 issues resolved",
  },
  {
    rank: 4,
    name: "Durban Metro",
    score: 7820,
    badge: undefined,
    contribution: "598 issues resolved",
  },
  {
    rank: 5,
    name: "Tshwane Metropolitan",
    score: 7150,
    badge: undefined,
    contribution: "534 issues resolved",
  },
]

function LeaderboardItem({ entry }: { entry: LeaderboardEntry }) {
  const rankConfig = {
    1: { icon: <Trophy className="w-5 h-5 text-yellow-500" />, color: "bg-yellow-50" },
    2: { icon: <Medal className="w-5 h-5 text-gray-400" />, color: "bg-gray-50" },
    3: { icon: <Medal className="w-5 h-5 text-orange-400" />, color: "bg-orange-50" },
  }

  const config = rankConfig[entry.rank as keyof typeof rankConfig] || { icon: null, color: "" }

  return (
    <div className={`flex items-center gap-4 p-4 rounded-lg ${config.color} hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-center w-8 h-8 font-bold text-gray-900 flex-shrink-0">
        {config.icon ? config.icon : `#${entry.rank}`}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 truncate">{entry.name}</p>
        <p className="text-sm text-gray-600 truncate">{entry.contribution}</p>
        {entry.badge && (
          <Badge className="mt-2 bg-purple-100 text-purple-800 hover:bg-purple-100 text-xs">
            {entry.badge}
          </Badge>
        )}
      </div>

      <div className="flex flex-col items-end flex-shrink-0">
        <p className="text-lg font-bold text-gray-900">{entry.score.toLocaleString()}</p>
        <p className="text-xs text-gray-500">Points</p>
      </div>
    </div>
  )
}

export function Leaderboard({ title = "Community Leaderboard", variant = "reporters" }: LeaderboardProps) {
  const dataMap = {
    reporters: reportersData,
    communities: communitiesData,
    officials: officialsData,
  }

  const data = dataMap[variant]

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          {title}
        </CardTitle>
        <CardDescription>Celebrating our most active and impactful contributors</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={variant} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="reporters" className="flex items-center gap-1">
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">Reporters</span>
            </TabsTrigger>
            <TabsTrigger value="communities" className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Communities</span>
            </TabsTrigger>
            <TabsTrigger value="officials" className="flex items-center gap-1">
              <Medal className="w-4 h-4" />
              <span className="hidden sm:inline">Officials</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reporters" className="space-y-3">
            {reportersData.map((entry) => (
              <LeaderboardItem key={entry.rank} entry={entry} />
            ))}
          </TabsContent>

          <TabsContent value="communities" className="space-y-3">
            {communitiesData.map((entry) => (
              <LeaderboardItem key={entry.rank} entry={entry} />
            ))}
          </TabsContent>

          <TabsContent value="officials" className="space-y-3">
            {officialsData.map((entry) => (
              <LeaderboardItem key={entry.rank} entry={entry} />
            ))}
          </TabsContent>
        </Tabs>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-700 mb-2">
            <span className="font-semibold">💡 How to earn points:</span>
          </p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Report an issue: +50 points</li>
            <li>• Issue resolved: +100 bonus points</li>
            <li>• Receive votes: +10 points per vote</li>
            <li>• Official response: +75 points</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
