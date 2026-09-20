"use client"
import { useState } from "react"

export default function CheckoutForm({ readymadeTotal, hasCustom }: { readymadeTotal: number; hasCustom: boolean }) {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [resolvedAddress, setResolvedAddress] = useState("")
  const [manualAddress, setManualAddress] = useState("")
  const [deliveryNotes, setDeliveryNotes] = useState("")
  const [locationStatus, setLocationStatus] = useState<"idle" | "loading" | "done" | "denied">("idle")
  const [deliveryFee, setDeliveryFee] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function shareLocation() {
    setLocationStatus("loading")
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        setCoords({ lat, lng })

        const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
        const geoData = await geoRes.json()
        setResolvedAddress(geoData.display_name ?? "")

        const feeRes = await fetch("/api/delivery-fee", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lat, lng }),
        })
        const feeData = await feeRes.json()
        setDeliveryFee(feeData.fee)
        setLocationStatus("done")
      },
      () => setLocationStatus("denied")
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        latitude: coords?.lat ?? null,
        longitude: coords?.lng ?? null,
        resolvedAddress,
        manualAddress,
        deliveryNotes,
        deliveryFee: deliveryFee ?? 0,
      }),
    })

    const data = await res.json()
    setSubmitting(false)

    if (data.paystackUrl) {
      window.location.href = data.paystackUrl
    } else if (data.orderId) {
      window.location.href = `/orders/${data.orderId}`
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6 border border-hairline rounded-lg p-4">
        {locationStatus === "idle" && (
          <button type="button" onClick={shareLocation} className="text-sm text-indigo hover:underline">
            Share my location for delivery
          </button>
        )}
        {locationStatus === "loading" && <p className="text-sm text-ink/60">Getting your location...</p>}
        {locationStatus === "done" && (
          <div>
            <p className="text-sm text-ink">{resolvedAddress}</p>
            {deliveryFee !== null && <p className="text-sm text-indigo font-medium mt-1">Delivery fee: ₦{deliveryFee.toLocaleString()}</p>}
          </div>
        )}
        {locationStatus === "denied" && (
          <div>
            <p className="text-sm text-clay mb-3">Location denied — enter your address manually.</p>
            <textarea value={manualAddress} onChange={(e) => setManualAddress(e.target.value)}
              placeholder="State, city, street, room"
              className="w-full rounded-lg border border-hairline bg-white px-4 py-3 text-ink" rows={3} />
          </div>
        )}
      </div>

      <label className="block text-sm font-medium text-ink mb-1">Delivery notes (optional)</label>
      <textarea value={deliveryNotes} onChange={(e) => setDeliveryNotes(e.target.value)}
        placeholder="Landmark, gate color, room number"
        className="w-full rounded-lg border border-hairline bg-white px-4 py-3 mb-6 text-ink" rows={2} />

      {hasCustom && (
        <p className="text-sm text-ink/60 mb-4">
          Your custom item(s) will be priced by Anu after review — she'll reach out before that part is charged.
        </p>
      )}

      <p className="text-lg font-medium text-ink mb-6">
        Total due now: ₦{(readymadeTotal + (deliveryFee ?? 0)).toLocaleString()}
      </p>

      <button type="submit" disabled={submitting || locationStatus === "idle"}
        className="w-full rounded-lg bg-indigo text-ivory py-3 font-medium hover:bg-indigo-dark transition-colors disabled:opacity-50">
        {submitting ? "Placing order..." : "Place Order & Pay"}
      </button>
    </form>
  )
}