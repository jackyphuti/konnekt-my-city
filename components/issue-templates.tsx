"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Droplets, Zap, TreePine, Trash2, Building2, Users, ArrowRight } from "lucide-react"
import Link from "next/link"

export interface IssueTemplate {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
  suggestedDetails: string[]
}

export const issueTemplates: IssueTemplate[] = [
  {
    id: "pothole",
    title: "Pothole",
    description: "Report damaged road surface",
    icon: <AlertCircle className="w-6 h-6" />,
    color: "from-red-500 to-red-600",
    suggestedDetails: ["Size of pothole", "Depth estimate", "Traffic danger level", "Street name"],
  },
  {
    id: "water-leak",
    title: "Water Leak",
    description: "Report water/sewage leak",
    icon: <Droplets className="w-6 h-6" />,
    color: "from-blue-500 to-blue-600",
    suggestedDetails: ["Type of leak", "Water volume", "Duration", "Affected area"],
  },
  {
    id: "power-outage",
    title: "Power Outage",
    description: "Report electricity issues",
    icon: <Zap className="w-6 h-6" />,
    color: "from-yellow-500 to-yellow-600",
    suggestedDetails: ["Duration of outage", "Area affected", "Traffic lights status", "Residential/Commercial"],
  },
  {
    id: "street-light",
    title: "Street Light",
    description: "Report broken street lights",
    icon: <Building2 className="w-6 h-6" />,
    color: "from-purple-500 to-purple-600",
    suggestedDetails: ["Number of lights", "Location", "When discovered", "Safety risk level"],
  },
  {
    id: "debris",
    title: "Debris/Litter",
    description: "Report roadside debris",
    icon: <Trash2 className="w-6 h-6" />,
    color: "from-green-500 to-green-600",
    suggestedDetails: ["Type of debris", "Quantity", "Environmental hazard", "Accessibility"],
  },
  {
    id: "community",
    title: "Community Issue",
    description: "Other community concerns",
    icon: <Users className="w-6 h-6" />,
    color: "from-indigo-500 to-indigo-600",
    suggestedDetails: ["Issue description", "Affected residents", "Proposed solution", "Urgency level"],
  },
]

interface IssueTemplatesProps {
  onSelect?: (template: IssueTemplate) => void
  showPreview?: boolean
}

export function IssueTemplatesGrid({ onSelect, showPreview = false }: IssueTemplatesProps) {
  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Common Issues</h2>
        <p className="text-gray-600">Quick templates to get you started</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {issueTemplates.map((template) => (
          <Card
            key={template.id}
            className="hover:shadow-lg transition-shadow cursor-pointer group"
            onClick={() => onSelect?.(template)}
          >
            <CardHeader>
              <div className={`w-12 h-12 bg-gradient-to-br ${template.color} rounded-lg flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform`}>
                {template.icon}
              </div>
              <CardTitle className="text-lg">{template.title}</CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {showPreview && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-600 uppercase">Typical Details:</p>
                  <ul className="text-sm space-y-1">
                    {template.suggestedDetails.slice(0, 2).map((detail, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-600">
                        <span className="w-1 h-1 bg-blue-600 rounded-full"></span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                  {onSelect && (
                    <Button size="sm" className="w-full mt-4 bg-blue-600 hover:bg-blue-700" onClick={() => onSelect(template)}>
                      Select Template
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function IssueTemplatesPicker() {
  return (
    <Card className="mb-8 border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-blue-600" />
          Quick Report Templates
        </CardTitle>
        <CardDescription>
          Don't know where to start? Choose a template to help you report an issue faster
        </CardDescription>
      </CardHeader>
      <CardContent>
        <IssueTemplatesGrid showPreview={true} />
      </CardContent>
    </Card>
  )
}
