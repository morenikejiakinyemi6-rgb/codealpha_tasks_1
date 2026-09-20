import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Nav from "../Nav"
import Footer from "../Footer"
import CheckoutForm from "./CheckoutForm"

export default async function CheckoutPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: session.user.id, orderId: null },
  })

  if (cartItems.length === 0) redirect("/cart")

  const readymadeTotal = cartItems.reduce(
    (sum, item) => (item.type === "READYMADE" ? sum + item.price * item.quantity : sum),
    0
  )
  const hasCustom = cartItems.some((item) => item.type === "CUSTOM")

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <Nav />
      <section className="px-8 py-16 flex-1 max-w-md max-w-6xl mx-auto">
        <h1 className="font-display text-2xl text-ink mb-8">Checkout</h1>
        <CheckoutForm readymadeTotal={readymadeTotal} hasCustom={hasCustom} />
      </section>
      <Footer />
    </div>
  )
}