import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Nav from "../Nav"
import Footer from "../Footer"
import Link from "next/link"

export default async function OrdersPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  })

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <Nav />
      <section className="px-8 py-16 flex-1 max-w-2xl mx-auto w-full">
        <h1 className="font-display text-2xl text-ink mb-8">Your Orders</h1>

        {orders.length === 0 && <p className="text-ink/60">You haven&apos;t placed any orders yet.</p>}

        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <Link key={order.id} href={`/orders/${order.id}`} className="block border border-hairline rounded-lg p-4 hover:border-indigo transition-colors">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-ink">Order #{order.id.slice(-8)}</p>
                  <p className="text-xs text-ink/60">{order.items.length} item(s) · {order.status}</p>
                </div>
                <p className="text-indigo font-semibold">₦{order.totalAmount.toLocaleString()}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  )
}