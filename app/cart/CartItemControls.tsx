"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function CartItemControls({ id, quantity, editable }: { id: string; quantity: number; editable: boolean }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function updateQuantity(next: number) {
    if (next < 1) return
    setLoading(true)
    await fetch(`/api/cart/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: next }),
    })
    router.refresh()
    setLoading(false)
  }

  async function removeItem() {
    setLoading(true)
    await fetch(`/api/cart/${id}`, { method: "DELETE" })
    router.refresh()
    setLoading(false)
  }

  return (
    <div className="flex items-center gap-3">
      {editable && (
        <div className="flex items-center border border-hairline rounded-lg">
          <button type="button" disabled={loading} onClick={() => updateQuantity(quantity - 1)} className="px-3 py-1 text-ink hover:bg-hairline/30">−</button>
          <span className="px-3 text-sm text-ink">{quantity}</span>
          <button type="button" disabled={loading} onClick={() => updateQuantity(quantity + 1)} className="px-3 py-1 text-ink hover:bg-hairline/30">+</button>
        </div>
      )}
      <button type="button" disabled={loading} onClick={removeItem} className="text-xs text-clay hover:underline">Remove</button>
    </div>
  )
}