import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 })
  }

  const body = await request.json()

  if (body.type === "CUSTOM") {
    const cartItem = await prisma.cartItem.create({
      data: {
        type: "CUSTOM",
        userId: session.user.id,
        styleNotes: body.styleNotes,
        measurementsSnapshot: body.measurementsSnapshot,
        price: 0, // Anu sets real custom pricing manually for now — no fixed price list for bespoke work
      },
    })
    return NextResponse.json(cartItem)
  }

    const product = await prisma.product.findUnique({ where: { id: body.productId } })
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 })
  }

  const existing = await prisma.cartItem.findFirst({
    where: { userId: session.user.id, productId: product.id, orderId: null },
  })

  if (existing) {
    const updated = await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + 1 },
    })
    return NextResponse.json(updated)
  }

  const cartItem = await prisma.cartItem.create({
    data: { type: "READYMADE", userId: session.user.id, productId: product.id, price: product.price },
  })
  return NextResponse.json(cartItem)
}