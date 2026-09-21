"use client"

import { useState } from "react"

const ANU_WHATSAPP = "2348000000000"

type Measurement = {
  chest: number | null
  waist: number | null
  hip: number | null
  shoulder: number | null
  sleeveLength: number | null
  inseam: number | null
} | null

export default function RequestStyleForm({
  styleId,
  styleImageUrl,
  measurement,
}: {
  styleId: string
  styleImageUrl: string
  measurement: Measurement
}) {
  const [styleNotes, setStyleNotes] = useState("")
  const [chest, setChest] = useState(measurement?.chest?.toString() ?? "")
  const [waist, setWaist] = useState(measurement?.waist?.toString() ?? "")
  const [hip, setHip] = useState(measurement?.hip?.toString() ?? "")
  const [shoulder, setShoulder] = useState(measurement?.shoulder?.toString() ?? "")
  const [sleeveLength, setSleeveLength] = useState(measurement?.sleeveLength?.toString() ?? "")
  const [inseam, setInseam] = useState(measurement?.inseam?.toString() ?? "")
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle")
  const [error, setError] = useState("")

  const measurementFields = [
    { label: "Chest", value: chest, set: setChest },
    { label: "Waist", value: waist, set: setWaist },
    { label: "Hip", value: hip, set: setHip },
    { label: "Shoulder", value: shoulder, set: setShoulder },
    { label: "Sleeve Length", value: sleeveLength, set: setSleeveLength },
    { label: "Inseam", value: inseam, set: setInseam },
  ]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("loading")
    setError("")

    const measurementsSnapshot = measurementFields
      .map((f) => `${f.label}: ${f.value || "—"}`)
      .join(", ")

    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "CUSTOM", styleId, styleNotes, measurementsSnapshot }),
    })

    if (res.status === 401) {
      setError("Log in first to request a custom piece.")
      setStatus("idle")
      return
    }
    if (!res.ok) {
      setStatus("idle")
      setError("Something went wrong — try again.")
      return
    }
    setStatus("done")
    window.location.href = "/cart"
  }

  return (
    <div>
      <a href={`https://wa.me/${ANU_WHATSAPP}?text=Hi! I'd like to ask about this style: ${styleImageUrl}`}
        target="_blank" className="inline-block mb-6 text-sm text-indigo hover:underline">
        Chat with Anu on WhatsApp first →
      </a>

      <form onSubmit={handleSubmit}>
        <label className="block text-sm font-medium text-ink mb-1">Style notes (fabric, color, changes)</label>
        <textarea value={styleNotes} onChange={(e) => setStyleNotes(e.target.value)}
          className="w-full rounded-lg border border-hairline bg-white px-4 py-3 mb-6 text-ink" rows={3} />

        <p className="text-sm font-medium text-ink mb-3">
          Your measurements {measurement && <span className="text-ink/50 font-normal">(Edit if needed)</span>}
        </p>
        <div className="grid grid-cols-2 gap-4 mb-2">
          {measurementFields.map((f) => (
            <div key={f.label}>
              <label className="block text-xs text-ink/60 mb-1">{f.label}</label>
              <input type="number" step="0.1" value={f.value} onChange={(e) => f.set(e.target.value)}
                className="w-full rounded-lg border border-hairline bg-white px-3 py-2 text-ink text-sm focus:outline-none focus:border-indigo focus:ring-2 focus:ring-indigo" />
            </div>
          ))}
        </div>
        {!measurement && (
          <p className="text-xs text-ink/50 mb-6">
            No saved profile yet — fill these in now, or save them once under &quot;My Measurements&quot; so future orders pre-fill automatically.
          </p>
        )}

        {error && <p className="text-sm text-clay mb-4 mt-4">{error}</p>}

        <button type="submit" disabled={status === "loading" || status === "done"}
          className="w-full rounded-lg bg-indigo text-ivory py-3 font-medium hover:bg-indigo-dark transition-colors disabled:opacity-50 mt-2">
          {status === "done" ? "Request sent ✓" : status === "loading" ? "Sending..." : "Request this Style"}
        </button>
      </form>
    </div>
  )
}