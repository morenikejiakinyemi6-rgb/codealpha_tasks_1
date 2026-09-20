"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import ImageUpload from "./ImageUpload"

export default function AdminForms() {
  const [tab, setTab] = useState<"product" | "style">("product")
  const [imageUrl, setImageUrl] = useState("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [size, setSize] = useState("")
  const [color, setColor] = useState("")
  const [stockQuantity, setStockQuantity] = useState("")
  const [caption, setCaption] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle")
  const router = useRouter()

  async function submitProduct(e: React.FormEvent) {
    e.preventDefault()
    setStatus("loading")
    await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, price, size, color, imageUrl, stockQuantity }),
    })
    setStatus("done")
    router.refresh()
  }

  async function submitStyle(e: React.FormEvent) {
    e.preventDefault()
    setStatus("loading")
    await fetch("/api/admin/styles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl, caption }),
    })
    setStatus("done")
    router.refresh()
  }

  return (
    <div className="border border-hairline rounded-lg p-6 max-w-md">
      <div className="flex gap-4 mb-6 text-sm">
        <button onClick={() => setTab("product")} className={tab === "product" ? "text-indigo font-medium" : "text-ink/50"}>Add Ready-Made Product</button>
        <button onClick={() => setTab("style")} className={tab === "style" ? "text-indigo font-medium" : "text-ink/50"}>Add Custom Style</button>
      </div>

      {tab === "product" && (
        <form onSubmit={submitProduct}>
          <ImageUpload onUploaded={setImageUrl} />
          <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-hairline px-4 py-2 mb-3 text-sm" />
          <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-lg border border-hairline px-4 py-2 mb-3 text-sm" />
          <input placeholder="Price (₦)" type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-lg border border-hairline px-4 py-2 mb-3 text-sm" />
          <input placeholder="Size" value={size} onChange={(e) => setSize(e.target.value)} className="w-full rounded-lg border border-hairline px-4 py-2 mb-3 text-sm" />
          <input placeholder="Color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full rounded-lg border border-hairline px-4 py-2 mb-3 text-sm" />
          <input placeholder="Stock quantity" type="number" value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value)} className="w-full rounded-lg border border-hairline px-4 py-2 mb-4 text-sm" />
          <button type="submit" disabled={status === "loading" || !imageUrl} className="w-full rounded-lg bg-indigo text-ivory py-2 text-sm font-medium disabled:opacity-50">
            {status === "loading" ? "Saving..." : "Add Product"}
          </button>
        </form>
      )}

      {tab === "style" && (
        <form onSubmit={submitStyle}>
          <ImageUpload onUploaded={setImageUrl} />
          <input placeholder="Caption (optional)" value={caption} onChange={(e) => setCaption(e.target.value)} className="w-full rounded-lg border border-hairline px-4 py-2 mb-4 text-sm" />
          <button type="submit" disabled={status === "loading" || !imageUrl} className="w-full rounded-lg bg-indigo text-ivory py-2 text-sm font-medium disabled:opacity-50">
            {status === "loading" ? "Saving..." : "Add Style"}
          </button>
        </form>
      )}
    </div>
  )
}