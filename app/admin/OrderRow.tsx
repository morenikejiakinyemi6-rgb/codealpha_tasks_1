"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function OrderRow({ order }: { order: any }) {
  const [status, setStatus] = useState(order.status)
  const router = useRouter()

  async function updateStatus(newStatus: string) {
    setStatus(newStatus)
    await fetch(`/api/admin/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
    router.refresh()
  }

  return (
    <div className="border border-hairline rounded-lg p-4 flex justify-between items-center">
      <div>
        <p className="text-sm font-medium text-ink">{order.user.name} — {order.user.phone}</p>
        <p className="text-xs text-ink/60">₦{order.totalAmount.toLocaleString()} · {order.items.length} item(s)</p>
      </div>
      <select value={status} onChange={(e) => updateStatus(e.target.value)} className="text-sm border border-hairline rounded-lg px-3 py-2">
        <option value="PENDING">Pending</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="READY">Ready</option>
        <option value="DELIVERED">Delivered</option>
      </select>
    </div>
  )
}