import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 })
  }

  const { productId } = await request.json()

  const product = await prisma.product.findUnique({ where: { id: productId } })

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 })
  }

  const cartItem = await prisma.cartItem.create({
    data: {
      type: "READYMADE",
      userId: session.user.id,
      productId: product.id,
      price: product.price,
    },
  })

  return NextResponse.json(cartItem)
}