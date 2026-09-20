import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  const { name, email, phone, password } = await request.json()

  const hashedPassword = await bcrypt.hash(password, 10)

    try {
    const user = await prisma.user.create({
      data: { name, email, phone, password: hashedPassword, role: "CUSTOMER" },
    })
    return NextResponse.json({ id: user.id, email: user.email })
  } catch {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 })
  }
}