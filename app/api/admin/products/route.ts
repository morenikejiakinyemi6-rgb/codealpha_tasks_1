import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const body = await request.json()
  const product = await prisma.product.create({
    data: {
      name: body.name,
      description: body.description || null,
      price: parseInt(body.price),
      size: body.size,
      color: body.color,
      imageUrl: body.imageUrl,
      stockQuantity: parseInt(body.stockQuantity),
    },
  })
  return NextResponse.json(product)
}