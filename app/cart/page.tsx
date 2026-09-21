import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import Nav from "../Nav"
import Footer from "../Footer"
import Image from "next/image"
import CartItemControls from "./CartItemControls"
import Link from "next/link"

export default async function CartPage() {
  const session = await auth()

  if (!session?.user?.id) {
    return <div className="p-8">Please log in to view your cart.</div>
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: session.user.id, orderId: null },
    include: { product: true, style: true },
  })
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <Nav />
      <section className="px-8 py-16 flex-1 max-w-6xl mx-auto">
        <h1 className="font-display text-2xl text-ink mb-8">Your Cart</h1>

        {cartItems.length === 0 && <p className="text-ink/60">Your cart is empty.</p>}

        <div className="flex flex-col gap-4 max-w-2xl">
          {cartItems.map((item) => (
            <div key={item.id} className="flex gap-4 border border-hairline rounded-lg p-4">
              <div className="relative w-20 h-20 bg-hairline/20 rounded flex-shrink-0">
                {item.product && <Image src={item.product.imageUrl} alt={item.product.name} fill className="object-contain" />}
                {item.style && <Image src={item.style.imageUrl} alt={item.style.caption ?? "Custom style"} fill className="object-contain" />}
              </div>
              <div className="flex-1">
                <p className="font-medium text-ink">{item.type === "READYMADE" ? item.product?.name : (item.style?.caption ?? "Custom Piece")}</p>
                <CartItemControls id={item.id} quantity={item.quantity} editable={item.type === "READYMADE"} />
                {item.type === "CUSTOM" && <p className="text-sm text-ink/60">{item.styleNotes}</p>}
                <p className="text-indigo font-semibold mt-1">
                  {item.type === "CUSTOM" ? "Priced after review" : `₦${item.price.toLocaleString()}`}
                </p>
              </div>
            </div>
          ))}
        </div>

        {cartItems.length > 0 && (
          <>
            <p className="mt-8 text-lg font-medium text-ink">Total: ₦{total.toLocaleString()}</p>
            <Link href="/checkout" className="inline-block mt-4 rounded-lg bg-indigo text-ivory px-6 py-3 font-medium hover:bg-indigo-dark transition-colors">
              Proceed to Checkout
            </Link>
          </>
        )}
      </section>
      <Footer />
    </div>
  )
}