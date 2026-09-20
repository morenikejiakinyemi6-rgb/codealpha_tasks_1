"use client"
import { useState } from "react"

export default function ImageUpload({ onUploaded }: { onUploaded: (url: string) => void }) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState("")

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!)

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData }
    )
    const data = await res.json()
    setPreview(data.secure_url)
    onUploaded(data.secure_url)
    setUploading(false)
  }

    return (
    <div className="mb-5">
      <label className="block text-sm font-medium text-ink mb-1">Image</label>
      <label className="flex flex-col items-center justify-center h-32 rounded-lg border-2 border-dashed border-hairline hover:border-indigo hover:bg-hairline/10 transition-colors cursor-pointer">
        <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
        <span className="text-sm text-ink/60">{uploading ? "Uploading..." : "Click to choose an image"}</span>
      </label>
      {preview && <img src={preview} alt="Preview" className="mt-3 h-32 rounded-lg object-contain bg-hairline/20" />}
    </div>
  )
}