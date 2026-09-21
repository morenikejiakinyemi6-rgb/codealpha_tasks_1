import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 })
  }

  const { productId } = await request.json()

  const product = await prisma.product.findUnique({ where: { id: productId } })

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 })
  }

  const existing = await prisma.cartItem.findFirst({
    where: { 
      userId: session.user.id, 
      productId: product.id, 
      orderId: null 
    },
  })

  if (existing) {
    const updated = await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + 1 },
    })
    return NextResponse.json(updated)
  }

  const cartItem = await prisma.cartItem.create({
    data: {
      type: "READYMADE",
      userId: session.user.id,
      productId: product.id,
      price: product.price,
      quantity: 1,
    },
  })

  return NextResponse.json(cartItem)
}