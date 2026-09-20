import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const reference = new URL(request.url).searchParams.get("reference")

  if (!reference) {
    return NextResponse.json({ error: "Missing reference" }, { status: 400 })
  }

  const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
  })
  const verifyData = await verifyRes.json()

  if (verifyData.data.status === "success") {
    await prisma.payment.update({
      where: { reference },
      data: { status: "SUCCESS", paidAt: new Date() },
    })
  } else {
    await prisma.payment.update({
      where: { reference },
      data: { status: "FAILED" },
    })
  }

  const origin = new URL(request.url).origin
  return NextResponse.redirect(`${origin}/orders/${reference}`)
}