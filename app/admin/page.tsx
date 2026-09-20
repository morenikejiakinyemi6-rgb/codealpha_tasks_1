import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Nav from "../Nav"
import Footer from "../Footer"
import AdminForms from "./AdminForms"
import OrderRow from "./OrderRow"

export default async function AdminPage() {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") redirect("/")

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true, items: true, payments: true },
  })

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <Nav />
      <section className="px-8 py-16 max-w-6xl mx-auto flex-1 w-full">
        <h1 className="font-display text-2xl text-ink mb-8">Admin Dashboard</h1>
        <AdminForms />

        <h2 className="font-display text-xl text-ink mt-16 mb-6">Orders</h2>
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <OrderRow key={order.id} order={order} />
          ))}
        </div>
      </section>
      <Footer />
    </div>
  )
}