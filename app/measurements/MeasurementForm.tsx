"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type Measurement = {
  chest: number | null
  waist: number | null
  hip: number | null
  shoulder: number | null
  sleeveLength: number | null
  inseam: number | null
} | null

export default function MeasurementForm({ existing }: { existing: Measurement }) {
  const [chest, setChest] = useState(existing?.chest?.toString() ?? "")
  const [waist, setWaist] = useState(existing?.waist?.toString() ?? "")
  const [hip, setHip] = useState(existing?.hip?.toString() ?? "")
  const [shoulder, setShoulder] = useState(existing?.shoulder?.toString() ?? "")
  const [sleeveLength, setSleeveLength] = useState(existing?.sleeveLength?.toString() ?? "")
  const [inseam, setInseam] = useState(existing?.inseam?.toString() ?? "")
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle")
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("loading")

    await fetch("/api/measurements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chest, waist, hip, shoulder, sleeveLength, inseam }),
    })

    setStatus("done")
    router.refresh()
  }

  const fields = [
    { label: "Chest", value: chest, set: setChest },
    { label: "Waist", value: waist, set: setWaist },
    { label: "Hip", value: hip, set: setHip },
    { label: "Shoulder", value: shoulder, set: setShoulder },
    { label: "Sleeve Length", value: sleeveLength, set: setSleeveLength },
    { label: "Inseam", value: inseam, set: setInseam },
  ]

  return (
    <form onSubmit={handleSubmit}>
      {fields.map((f) => (
        <div key={f.label} className="mb-5">
          <label className="block text-sm font-medium text-ink mb-1">{f.label} (inches)</label>
          <input
            type="number"
            step="0.1"
            value={f.value}
            onChange={(e) => f.set(e.target.value)}
            className="w-full rounded-lg border border-hairline bg-white px-4 py-3 text-ink focus:outline-none focus:border-indigo focus:ring-2 focus:ring-indigo"
          />
        </div>
      ))}

      <button type="submit" disabled={status === "loading"}
        className="w-full rounded-lg bg-indigo text-ivory py-3 font-medium hover:bg-indigo-dark transition-colors disabled:opacity-50">
        {status === "done" ? "Saved ✓" : status === "loading" ? "Saving..." : "Save Measurements"}
      </button>
    </form>
  )
}