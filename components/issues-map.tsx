"use client"

import { useEffect, useRef } from "react"

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

interface IssuesMapProps {
  issues: Issue[]
}

export default function IssuesMap({ issues }: IssuesMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<any[]>([])

  useEffect(() => {
    const initializeMap = async () => {
      if (typeof window === "undefined") return

      // Dynamically import Leaflet to avoid SSR issues
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const L = (await import("leaflet")).default

      // Fix for default markers in Leaflet
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      })

      if (mapRef.current && !mapInstanceRef.current) {
        // Initialize map centered on South Africa
        mapInstanceRef.current = L.map(mapRef.current).setView([-26.2041, 28.0473], 6)

        // Add OpenStreetMap tiles
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(mapInstanceRef.current)

        // Disable zoom/pan when tapping on markers (improves mobile UX)
        mapInstanceRef.current.on("popupopen", () => {
          mapInstanceRef.current.dragging.disable()
        })
        mapInstanceRef.current.on("popupclose", () => {
          mapInstanceRef.current.dragging.enable()
        })

        // Improve mobile touch behavior
        if (typeof window !== "undefined" && window.innerWidth <= 768) {
          mapInstanceRef.current.touchZoom.disable()
          mapInstanceRef.current.doubleClickZoom.enable()
        }
      }
    }

    initializeMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    const updateMarkers = async () => {
      if (!mapInstanceRef.current || typeof window === "undefined") return

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const L = (await import("leaflet")).default

      // Clear existing markers
      markersRef.current.forEach((marker) => {
        mapInstanceRef.current.removeLayer(marker)
      })
      markersRef.current = []

      // Add new markers
      issues.forEach((issue) => {
        if (issue.latitude && issue.longitude) {
          // Create custom icon based on category color and status
          const iconColor = issue.status === "resolved" ? "#10B981" : issue.issue_categories?.color || "#3B82F6"
          // Increase marker size for mobile touch targets
          const isMobile = typeof window !== "undefined" && window.innerWidth <= 768
          const markerSize = isMobile ? 40 : 30
          const fontSize = isMobile ? "18px" : "14px"
          const borderWidth = isMobile ? "4px" : "3px"

          const iconHtml = `
            <div style="
              background-color: ${iconColor};
              width: ${markerSize}px;
              height: ${markerSize}px;
              border-radius: 50%;
              border: ${borderWidth} solid white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.2);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: ${fontSize};
            ">
              ${issue.issue_categories?.icon || "📍"}
            </div>
          `

          const customIcon = L.divIcon({
            html: iconHtml,
            className: "custom-marker",
            iconSize: [markerSize, markerSize],
            iconAnchor: [markerSize / 2, markerSize / 2],
          })

          const marker = L.marker([issue.latitude, issue.longitude], { icon: customIcon }).addTo(mapInstanceRef.current)

          // Create popup content - responsive width
          const popupWidth = isMobile ? 200 : 300
          const popupContent = `
            <div style="max-width: ${popupWidth}px; font-family: system-ui, -apple-system, sans-serif;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                <span style="font-size: ${isMobile ? "16px" : "18px"};">${issue.issue_categories?.icon || "📍"}</span>
                <h3 style="margin: 0; font-size: ${isMobile ? "14px" : "16px"}; font-weight: 600; color: #1f2937; line-height: 1.3;">${issue.title}</h3>
              </div>
              
              <p style="margin: 0 0 12px 0; font-size: ${isMobile ? "12px" : "14px"}; color: #6b7280; line-height: 1.4;">
                ${issue.description.length > 80 ? issue.description.substring(0, 80) + "..." : issue.description}
              </p>
              
              <div style="display: flex; gap: 6px; margin-bottom: 8px; flex-wrap: wrap;">
                <span style="
                  background-color: ${issue.status === "resolved" ? "#dcfce7" : issue.status === "in_progress" ? "#dbeafe" : "#f3f4f6"};
                  color: ${issue.status === "resolved" ? "#166534" : issue.status === "in_progress" ? "#1e40af" : "#374151"};
                  padding: 2px 6px;
                  border-radius: 12px;
                  font-size: ${isMobile ? "11px" : "12px"};
                  font-weight: 500;
                  white-space: nowrap;
                ">
                  ${issue.status.replace("_", " ")}
                </span>
                <span style="
                  background-color: ${issue.priority === "urgent" ? "#fef2f2" : issue.priority === "high" ? "#fff7ed" : "#f3f4f6"};
                  color: ${issue.priority === "urgent" ? "#dc2626" : issue.priority === "high" ? "#ea580c" : "#374151"};
                  padding: 2px 6px;
                  border-radius: 12px;
                  font-size: ${isMobile ? "11px" : "12px"};
                  font-weight: 500;
                  white-space: nowrap;
                ">
                  ${issue.priority}
                </span>
              </div>
              
              <div style="font-size: ${isMobile ? "11px" : "12px"}; color: #6b7280; margin-bottom: 4px;">
                <strong>${issue.municipalities?.name}</strong>
              </div>
              
              ${
                issue.address
                  ? `<div style="font-size: ${isMobile ? "11px" : "12px"}; color: #6b7280; margin-bottom: 8px; word-break: break-word;">📍 ${issue.address}</div>`
                  : ""
              }
              
              <div style="display: flex; justify-content: space-between; align-items: center; font-size: ${isMobile ? "11px" : "12px"}; color: #6b7280; margin-bottom: 8px;">
                <span>👍 ${issue.upvotes} votes</span>
                <span>${new Date(issue.created_at).toLocaleDateString()}</span>
              </div>
              
              <a href="/issues/${issue.id}" style="
                display: inline-block;
                width: 100%;
                padding: ${isMobile ? "6px 8px" : "6px 12px"};
                background: linear-gradient(to right, #2563eb, #16a34a);
                color: white;
                text-decoration: none;
                border-radius: 6px;
                font-size: ${isMobile ? "12px" : "13px"};
                font-weight: 500;
                text-align: center;
                box-sizing: border-box;
              ">
                View Details
              </a>
            </div>
          `

          marker.bindPopup(popupContent, {
            maxWidth: popupWidth,
            maxHeight: isMobile ? 400 : 500,
            className: "custom-popup",
          })

          markersRef.current.push(marker)
        }
      })

      // Fit map to show all markers if there are any
      if (markersRef.current.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const group = (L.featureGroup as any)(markersRef.current)
        mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1))
      }
    }

    updateMarkers()
  }, [issues])

  return (
    <>
      <div ref={mapRef} className="w-full h-full rounded-lg" />
      <style jsx global>{`
        .leaflet-popup-content-wrapper {
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .leaflet-popup-tip {
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
    </>
  )
}
