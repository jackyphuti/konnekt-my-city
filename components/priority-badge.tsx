"use client"

import { Badge } from "@/components/ui/badge"
import { AlertCircle, AlertTriangle, Info } from "lucide-react"

export type PriorityLevel = "critical" | "high" | "medium" | "low"

interface PriorityBadgeProps {
  priority: PriorityLevel
  showIcon?: boolean
}

export function PriorityBadge({ priority, showIcon = true }: PriorityBadgeProps) {
  const config = {
    critical: {
      label: "Critical",
      className: "bg-red-100 text-red-800 hover:bg-red-200 border-red-300",
      icon: <AlertCircle className="w-4 h-4" />,
      description: "Urgent - Immediate attention needed",
    },
    high: {
      label: "High",
      className: "bg-orange-100 text-orange-800 hover:bg-orange-200 border-orange-300",
      icon: <AlertTriangle className="w-4 h-4" />,
      description: "Important - Should be addressed soon",
    },
    medium: {
      label: "Medium",
      className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-300",
      icon: <Info className="w-4 h-4" />,
      description: "Moderate - Normal processing",
    },
    low: {
      label: "Low",
      className: "bg-green-100 text-green-800 hover:bg-green-200 border-green-300",
      icon: <Info className="w-4 h-4" />,
      description: "Low - Can be scheduled",
    },
  }

  const { label, className, icon, description } = config[priority]

  return (
    <Badge className={`${className} border flex items-center gap-1.5`} title={description}>
      {showIcon && icon}
      <span>{label}</span>
    </Badge>
  )
}

export function getPriorityFromIssue(
  category?: string,
  votes?: number,
  daysSinceReport?: number
): PriorityLevel {
  if (daysSinceReport && daysSinceReport > 30) return "critical"
  if (votes && votes > 50) return "high"
  if (category?.toLowerCase().includes("pothole") || category?.toLowerCase().includes("power")) return "high"
  if (votes && votes > 20) return "medium"
  return "low"
}
