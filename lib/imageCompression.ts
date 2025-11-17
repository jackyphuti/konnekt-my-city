// Client-side image compression utility
// Uses Canvas API to resize and compress images before upload

export interface CompressionOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number // 0.1-1.0
  mimeType?: string
}

const DEFAULT_OPTIONS: CompressionOptions = {
  maxWidth: 1200,
  maxHeight: 1200,
  quality: 0.8,
  mimeType: "image/jpeg",
}

export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<{ compressedFile: File; originalSize: number; compressedSize: number }> {
  const opts = { ...DEFAULT_OPTIONS, ...options }

  // Read file as data URL
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })

  // Create image element and wait for load
  const img = new Image()
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve()
    img.onerror = () => reject(new Error("Failed to load image"))
    img.src = dataUrl
  })

  // Calculate new dimensions (maintain aspect ratio)
  let { width, height } = img
  if (width > (opts.maxWidth || 1200) || height > (opts.maxHeight || 1200)) {
    const aspectRatio = width / height
    if (width > height) {
      width = opts.maxWidth || 1200
      height = width / aspectRatio
    } else {
      height = opts.maxHeight || 1200
      width = height * aspectRatio
    }
  }

  // Draw to canvas and compress
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Failed to get canvas context")

  ctx.drawImage(img, 0, 0, width, height)

  // Convert canvas to blob
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new Error("Failed to compress image"))
      },
      opts.mimeType || "image/jpeg",
      opts.quality || 0.8
    )
  })

  // Create new File from blob
  const ext = (opts.mimeType || "image/jpeg").split("/")[1] || "jpg"
  const compressedFile = new File([blob], `compressed-${Date.now()}.${ext}`, {
    type: opts.mimeType || "image/jpeg",
  })

  return {
    compressedFile,
    originalSize: file.size,
    compressedSize: compressedFile.size,
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
}
