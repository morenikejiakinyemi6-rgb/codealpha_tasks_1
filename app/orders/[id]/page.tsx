import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Nav from "../../Nav"
import Footer from "../../Footer"

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, payments: true },
  })

  if (!order || order.userId !== session.user.id) {
    return <div className="p-8">Order not found.</div>
  }

  const latestPayment = order.payments[order.payments.length - 1]

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <Nav />
      <section className="px-8 py-16 flex-1 max-w-md max-w-6xl mx-auto">
        <h1 className="font-display text-2xl text-ink mb-2">Order Confirmed</h1>
        <p className="text-sm text-ink/60 mb-8">Order #{order.id.slice(-8)}</p>

        <div className="border border-hairline rounded-lg p-4 mb-6">
          {order.items.map((item) => (
            <p key={item.id} className="text-sm text-ink mb-1">
              {item.type === "READYMADE" ? `Ready-made item x${item.quantity}` : "Custom piece (pending quote)"}
            </p>
          ))}
        </div>

        <p className="text-sm text-ink/60 mb-1">
          Payment status: <span className="font-medium text-ink">{latestPayment?.status ?? "No payment required"}</span>
        </p>
        <p className="text-lg font-medium text-ink mt-4">Total: ₦{order.totalAmount.toLocaleString()}</p>
      </section>
      <Footer />
    </div>
  )
}