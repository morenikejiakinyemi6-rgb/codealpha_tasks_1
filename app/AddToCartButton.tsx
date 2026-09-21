"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AddToCartButton({ productId }: { productId: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle")
  const [needsLogin, setNeedsLogin] = useState(false)
const router = useRouter()
  async function handleClick() {
    setStatus("loading")

    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    })


   if (res.ok) {
      setStatus("done")
      router.refresh()
    } else if (res.status === 401) {
      setStatus("idle")
      setNeedsLogin(true)
    } else {
      setStatus("idle")
    }
}

  return (
    <>
    <button
      onClick={handleClick}
      disabled={status === "loading"}
      className="mt-3 w-full rounded-lg bg-indigo text-ivory py-2 text-sm font-medium hover:bg-indigo-dark transition-colors disabled:opacity-50"
    >
 {status === "done" ? "Added ✓" : status === "loading" ? "Adding..." : "Add to Cart"}
    </button>
    {needsLogin && (
      <p className="text-xs text-clay mt-2">
        <a href="/login" className="underline">Log in</a> or <a href="/signup" className="underline">sign up</a> to add items to your cart.
      </p>
    )}
    
    </>
  )

}
