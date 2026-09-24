import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { NextResponse } from "next/server"

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Not logged in" }, { status: 401 })

  const { id } = await context.params
  const { quantity } = await request.json()

  const item = await prisma.cartItem.findUnique({ where: { id } })
  if (!item || item.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const updated = await prisma.cartItem.update({
    where: { id },
    data: { quantity: Math.max(1, quantity) },
  })
  return NextResponse.json(updated)
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Not logged in" }, { status: 401 })

  const { id } = await context.params
  const item = await prisma.cartItem.findUnique({ where: { id } })
  if (!item || item.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  await prisma.cartItem.delete({ where: { id } })
  return NextResponse.json({ success: true })
}