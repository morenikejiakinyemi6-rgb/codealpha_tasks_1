import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 })
  }

  const body = await request.json()

  function toFloat(value: string) {
    return value === "" ? null : parseFloat(value)
  }

  const measurement = await prisma.measurement.upsert({
    where: { userId: session.user.id },
    update: {
      chest: toFloat(body.chest),
      waist: toFloat(body.waist),
      hip: toFloat(body.hip),
      shoulder: toFloat(body.shoulder),
      sleeveLength: toFloat(body.sleeveLength),
      inseam: toFloat(body.inseam),
    },
    create: {
      userId: session.user.id,
      chest: toFloat(body.chest),
      waist: toFloat(body.waist),
      hip: toFloat(body.hip),
      shoulder: toFloat(body.shoulder),
      sleeveLength: toFloat(body.sleeveLength),
      inseam: toFloat(body.inseam),
    },
  })

  return NextResponse.json(measurement)
}