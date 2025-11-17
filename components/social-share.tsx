"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Share2, Copy, Check } from "lucide-react"
import { useState } from "react"

interface SocialShareProps {
  title: string
  description?: string
  url: string
  issueId?: string
}

export function SocialShare({ title, description, url, issueId }: SocialShareProps) {
  const [copied, setCopied] = useState(false)

  const shareText = description ? `${title}\n\n${description}` : title
  const fullUrl = typeof window !== "undefined" ? `${window.location.origin}${url}` : url

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(fullUrl)
    setCopied(true)
    // Show success feedback
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShareToX = () => {
    const xUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(fullUrl)}`
    window.open(xUrl, "_blank", "width=550,height=420")
  }

  const handleShareToFacebook = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`
    window.open(fbUrl, "_blank", "width=550,height=420")
  }

  const handleShareToWhatsApp = () => {
    const waUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n\n${fullUrl}`)}`
    window.open(waUrl, "_blank")
  }

  const handleShareToLinkedIn = () => {
    const liUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`
    window.open(liUrl, "_blank")
  }

  return (
    <Card className="border-blue-100 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Share2 className="w-5 h-5" />
          Share This Issue
        </CardTitle>
        <CardDescription>Help amplify this issue by sharing it with your network</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShareToX}
            className="flex items-center justify-center gap-2 hover:bg-black hover:text-white"
            title="Share on X (Twitter)"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.6l-5.1-6.72-5.856 6.72h-3.31l7.73-8.835L.5 2.25h6.76l4.64 6.09 5.404-6.09zM17.79 20.87h1.828L5.009 3.956H3.03L17.79 20.87z" />
            </svg>
            <span className="hidden sm:inline">X</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleShareToFacebook}
            className="flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white"
            title="Share on Facebook"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span className="hidden sm:inline">FB</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleShareToWhatsApp}
            className="flex items-center justify-center gap-2 hover:bg-green-600 hover:text-white"
            title="Share on WhatsApp"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.869 1.213l-.348.202-.36-.054-1.47-.342.342 1.432.22.324-.134.383a9.9 9.9 0 001.412 4.814l.323.454-.094.372c-.255 1.017-.827 2.086-1.465 2.942.533-.058 1.252-.341 1.878-.677.296-.16.577-.325.876-.489l.428-.254.36.096c1.45.36 2.954.356 4.514 0l.36-.096.428.254c.299.164.58.329.877.488.626.336 1.345.62 1.878.678-.638-.856-1.21-1.925-1.465-2.942l-.094-.372.323-.454a9.87 9.87 0 001.412-4.814l.221-.324-.135-.383-.36.055-.347-.202a9.871 9.871 0 00-4.869-1.213z" />
            </svg>
            <span className="hidden sm:inline">WA</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleShareToLinkedIn}
            className="flex items-center justify-center gap-2 hover:bg-blue-700 hover:text-white"
            title="Share on LinkedIn"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.722-2.004 1.418-.103.249-.129.597-.129.946v5.441h-3.586V9h3.586v1.381h.05c.503-.955 1.707-1.955 3.591-1.955 3.767 0 4.461 2.48 4.461 5.711v6.315zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
            </svg>
            <span className="hidden sm:inline">In</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="flex items-center justify-center gap-2"
            title="Copy link"
          >
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
          </Button>
        </div>

        <div className="p-3 bg-white rounded-lg border border-gray-200">
          <p className="text-xs text-gray-600 mb-2 font-semibold">Preview:</p>
          <p className="text-sm text-gray-900 font-medium line-clamp-2">{title}</p>
          {description && <p className="text-xs text-gray-600 line-clamp-1 mt-1">{description}</p>}
        </div>
      </CardContent>
    </Card>
  )
}
