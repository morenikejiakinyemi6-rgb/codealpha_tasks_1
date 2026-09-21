"use client"
import Image from "next/image"
import { useRouter } from "next/navigation"

type Item = { id: string; imageUrl: string; label: string }

export default function ManageList({ title, items, deleteEndpoint }: { title: string; items: Item[]; deleteEndpoint: string }) {
  const router = useRouter()

  async function remove(id: string) {
    const confirmed = confirm("Delete this item?")
    if (!confirmed) return

    await fetch(`${deleteEndpoint}/${id}`, { method: "DELETE" })
    router.refresh()
  }

  return (
    <div className="mt-8">
      <h3 className="font-medium text-ink mb-3">{title}</h3>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 border border-hairline rounded-lg p-2">
            <div className="relative w-12 h-12 bg-hairline/20 rounded flex-shrink-0">
              <Image src={item.imageUrl} alt={item.label} fill sizes="48px" className="object-contain" />
            </div>
            <span className="text-sm text-ink flex-1">{item.label}</span>
            <button onClick={() => remove(item.id)} className="text-xs text-clay hover:underline">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}