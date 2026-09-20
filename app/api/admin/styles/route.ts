import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const body = await request.json()
  const style = await prisma.productCatalog.create({
    data: { imageUrl: body.imageUrl, caption: body.caption || null },
  })
  return NextResponse.json(style)
}