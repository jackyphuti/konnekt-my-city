"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { saveDraft, getDrafts, deleteDraft, IssueDraft } from "@/lib/offline"
import { compressImage, formatFileSize } from "@/lib/imageCompression"
import { useRouter } from "next/navigation"
import { MapPin, Camera, AlertCircle, X } from "lucide-react"
import Link from "next/link"

interface User {
  id: string
  email?: string
}

interface IssueCategory {
  id: string
  name: string
  description: string
  icon: string
  color: string
}

interface Municipality {
  id: string
  name: string
  province: string
}

export default function ReportIssuePage() {
  const [user, setUser] = useState<User | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [municipalityId, setMunicipalityId] = useState("")
  const [address, setAddress] = useState("")
  const [latitude, setLatitude] = useState("")
  const [longitude, setLongitude] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [categories, setCategories] = useState<IssueCategory[]>([])
  const [municipalities, setMunicipalities] = useState<Municipality[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [draftSaved, setDraftSaved] = useState<null | number>(null)
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== "undefined" ? navigator.onLine : true)
  const [drafts, setDrafts] = useState<IssueDraft[]>([])
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isCompressing, setIsCompressing] = useState(false)
  const [compressionStats, setCompressionStats] = useState<{ original: number; compressed: number } | null>(null)
  const router = useRouter()
  useEffect(() => {
    const onOnline = () => setIsOnline(true)
    const onOffline = () => setIsOnline(false)

    const checkUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }
      setUser(user)

      // Get user's municipality from profile
      const { data: profile } = await supabase.from("profiles").select("municipality_id").eq("id", user.id).single()
      if (profile?.municipality_id) {
        setMunicipalityId(profile.municipality_id)
      }
    }

    const fetchData = async () => {
      const supabase = createClient()
      const [categoriesResult, municipalitiesResult] = await Promise.all([
        supabase.from("issue_categories").select("*").order("name"),
        supabase.from("municipalities").select("id, name, province").order("name"),
      ])

      if (categoriesResult.data) setCategories(categoriesResult.data)
      if (municipalitiesResult.data) setMunicipalities(municipalitiesResult.data)
    }

    // load drafts (and populate latest into form)
    ;(async () => {
      try {
        const drafts = await getDrafts()
        if (drafts && drafts.length > 0) {
          setDrafts(drafts.sort((a, b) => b.createdAt - a.createdAt))
          const latest = drafts.sort((a, b) => b.createdAt - a.createdAt)[0]
          if (latest) {
            setTitle(latest.title)
            setDescription(latest.description)
            setCategoryId(latest.categoryId)
            setMunicipalityId(latest.municipalityId)
            setAddress(latest.address || "")
            setLatitude(latest.latitude || "")
            setLongitude(latest.longitude || "")
            setDraftSaved(latest.id || null)
          }
        }
      } catch (err) {
        console.error("Error loading drafts:", err)
      }
    })()

    checkUser()
    fetchData()

    window.addEventListener("online", onOnline)
    window.addEventListener("offline", onOffline)

    return () => {
      window.removeEventListener("online", onOnline)
      window.removeEventListener("offline", onOffline)
    }
  }, [router])

  const getCurrentLocation = () => {
    setIsGettingLocation(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toString())
          setLongitude(position.coords.longitude.toString())
          setIsGettingLocation(false)
        },
        (error) => {
          console.error("Error getting location:", error)
          setError("Unable to get your location. Please enter address manually.")
          setIsGettingLocation(false)
        },
      )
    } else {
      setError("Geolocation is not supported by this browser.")
      setIsGettingLocation(false)
    }
  }

  const fileToDataUrl = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = () => reject(reader.error)
      reader.readAsDataURL(file)
    })
  }

  const dataUrlToFile = async (dataUrl: string, fileName = "image.jpg") => {
    const res = await fetch(dataUrl)
    const blob = await res.blob()
    return new File([blob], fileName, { type: blob.type })
  }

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsCompressing(true)
    try {
      const { compressedFile, originalSize, compressedSize } = await compressImage(file, {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.8,
      })

      setImageFile(compressedFile)
      setCompressionStats({ original: originalSize, compressed: compressedSize })

      // Create preview
      const reader = new FileReader()
      reader.onload = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(compressedFile)
    } catch (err) {
      console.error("Error compressing image:", err)
      setError("Failed to process image. Please try another one.")
    } finally {
      setIsCompressing(false)
    }
  }

  const refreshDrafts = async () => {
    try {
      const all = await getDrafts()
      setDrafts((all || []).sort((a, b) => b.createdAt - a.createdAt))
    } catch (err) {
      console.error("Error refreshing drafts:", err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)
    setError(null)

    try {
      // If offline, save as draft and bail out
      if (!isOnline) {
        const draft: IssueDraft = {
          title,
          description,
          categoryId,
          municipalityId,
          address,
          latitude,
          longitude,
          imageName: imageFile?.name,
          imageDataUrl: undefined,
          createdAt: Date.now(),
        }

        if (imageFile) {
          try {
            const dataUrl = await fileToDataUrl(imageFile)
            draft.imageDataUrl = dataUrl
          } catch (err) {
            console.error("Failed to read image for draft", err)
          }
        }

        const id = await saveDraft(draft)
        setDraftSaved(id)
        setIsLoading(false)
        setError("You are offline — draft saved locally and will sync when online.")
        return
      }
      const supabase = createClient()

      // Upload image if provided
      let imageUrl = null
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop()
        const fileName = `${Date.now()}.${fileExt}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("issue-images")
          .upload(fileName, imageFile)

        if (uploadError) throw uploadError
        imageUrl = uploadData.path
      }

      // Create issue
      const { error: insertError } = await supabase.from("issues").insert({
        title,
        description,
        category_id: categoryId,
        municipality_id: municipalityId,
        reporter_id: user.id,
        latitude: latitude ? Number.parseFloat(latitude) : null,
        longitude: longitude ? Number.parseFloat(longitude) : null,
        address,
        image_url: imageUrl,
      })

      if (insertError) throw insertError

      router.push("/dashboard?success=issue-reported")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveDraft = async () => {
    try {
      const draft: IssueDraft = {
        title,
        description,
        categoryId,
        municipalityId,
        address,
        latitude,
        longitude,
        imageName: imageFile?.name,
        imageDataUrl: undefined,
        createdAt: Date.now(),
      }

      if (imageFile) {
        try {
          draft.imageDataUrl = await fileToDataUrl(imageFile)
        } catch (err) {
          console.error("Failed to read image for draft", err)
        }
      }

      const id = await saveDraft(draft)
      setDraftSaved(id)
      setError(null)
      await refreshDrafts()
    } catch (err) {
      console.error("Error saving draft:", err)
      setError("Failed to save draft locally")
    }
  }

  // Attempt to sync drafts automatically when we regain connectivity
  useEffect(() => {
    if (!isOnline) return

    let mounted = true

    ;(async () => {
      try {
        const supabase = createClient()
        const localDrafts = await getDrafts()
        if (!localDrafts || localDrafts.length === 0) return

        for (const d of localDrafts) {
          try {
            let imageUrl: string | null = null
            if (d.imageDataUrl) {
              // convert data url to File
              const file = await dataUrlToFile(d.imageDataUrl, d.imageName || `draft-${d.createdAt}.jpg`)
              const fileExt = (d.imageName || "jpg").split(".").pop()
              const fileName = `${Date.now()}.${fileExt}`
              const { data: uploadData, error: uploadError } = await supabase.storage
                .from("issue-images")
                .upload(fileName, file)

              if (uploadError) throw uploadError
              imageUrl = uploadData.path
            }

            const { error: insertError } = await supabase.from("issues").insert({
              title: d.title,
              description: d.description,
              category_id: d.categoryId,
              municipality_id: d.municipalityId,
              reporter_id: user?.id,
              latitude: d.latitude ? Number.parseFloat(d.latitude) : null,
              longitude: d.longitude ? Number.parseFloat(d.longitude) : null,
              address: d.address,
              image_url: imageUrl,
            })

            if (insertError) throw insertError

            // delete local draft on success
            if (d.id) await deleteDraft(d.id)
          } catch (err) {
            console.error("Failed to sync draft", d, err)
            // leave the draft for later retry
          }
        }

        if (mounted) await refreshDrafts()
      } catch (err) {
        console.error("Error syncing drafts:", err)
      }
    })()

    return () => {
      mounted = false
    }
  }, [isOnline, user])

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-6">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>You need to be signed in to report issues</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/auth/login">
              <Button className="w-full">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
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
              <p className="text-sm text-gray-600">Report Issue</p>
            </div>
          </Link>
          <Link href="/dashboard">
            <Button variant="ghost">Dashboard</Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Report an Issue</h1>
          <p className="text-gray-600">Help improve your community by reporting infrastructure problems</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              Issue Details
            </CardTitle>
            <CardDescription>
              Provide as much detail as possible to help municipal officials address the issue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {drafts && drafts.length > 0 && (
                <div className="mb-4 p-3 border rounded-md bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium">Saved Drafts</div>
                    <div className="text-xs text-muted-foreground">{drafts.length} saved</div>
                  </div>
                  <div className="space-y-2">
                    {drafts.map((d) => (
                      <div key={d.id} className="flex items-center justify-between gap-2">
                        <div>
                          <div className="font-medium">{d.title || "(No title)"}</div>
                          <div className="text-xs text-muted-foreground">{new Date(d.createdAt).toLocaleString()}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={async () => {
                              // restore draft into form
                              setTitle(d.title)
                              setDescription(d.description)
                              setCategoryId(d.categoryId)
                              setMunicipalityId(d.municipalityId)
                              setAddress(d.address || "")
                              setLatitude(d.latitude || "")
                              setLongitude(d.longitude || "")
                              if (d.imageDataUrl) {
                                try {
                                  const file = await dataUrlToFile(d.imageDataUrl, d.imageName || "draft.jpg")
                                  setImageFile(file)
                                } catch (err) {
                                  console.error("Failed to restore image file from draft", err)
                                }
                              }
                              setDraftSaved(d.id || null)
                            }}
                          >
                            Restore
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={async () => {
                              if (!d.id) return
                              await deleteDraft(d.id)
                              await refreshDrafts()
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="title">Issue Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Large pothole on Main Street"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={categoryId} onValueChange={setCategoryId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select issue category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          <span>{category.icon}</span>
                          <span>{category.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="municipality">Municipality *</Label>
                <Select value={municipalityId} onValueChange={setMunicipalityId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select municipality" />
                  </SelectTrigger>
                  <SelectContent>
                    {municipalities.map((municipality) => (
                      <SelectItem key={municipality.id} value={municipality.id}>
                        {municipality.name}, {municipality.province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the issue in detail. Include any safety concerns or impact on the community."
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="grid gap-4">
                <Label>Location</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={getCurrentLocation}
                    disabled={isGettingLocation}
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <MapPin className="w-4 h-4" />
                    {isGettingLocation ? "Getting location..." : "Use Current Location"}
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      placeholder="-26.2041"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      placeholder="28.0473"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Address or Description</Label>
                  <Input
                    id="address"
                    placeholder="e.g., Corner of Main St and Church St, Johannesburg"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="image">Photo (Optional)</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    disabled={isCompressing}
                    className="flex-1"
                  />
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Camera className="w-3 h-3" />
                    Recommended
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">A photo helps municipal officials understand the issue better. Images are automatically compressed.</p>

                {isCompressing && <p className="text-sm text-blue-600">Compressing image...</p>}

                {compressionStats && (
                  <div className="text-xs text-muted-foreground">
                    Compressed: {formatFileSize(compressionStats.original)} → {formatFileSize(compressionStats.compressed)}
                  </div>
                )}

                {imagePreview && (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border bg-gray-100">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null)
                        setImagePreview(null)
                        setCompressionStats(null)
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="flex gap-4 items-center">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                >
                  {isLoading ? "Submitting..." : "Submit Issue Report"}
                </Button>
                <Button type="button" variant="outline" onClick={handleSaveDraft}>
                  {draftSaved ? "Draft Saved" : "Save Draft"}
                </Button>
                <Link href="/dashboard">
                  <Button type="button" variant="ghost">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
