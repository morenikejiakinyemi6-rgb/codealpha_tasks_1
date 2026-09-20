import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Not logged in" }, { status: 401 })

  const body = await request.json()

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: session.user.id, orderId: null },
  })

  const readymadeTotal = cartItems.reduce(
    (sum, item) => (item.type === "READYMADE" ? sum + item.price * item.quantity : sum),
    0
  )
  const amountDue = readymadeTotal + body.deliveryFee

  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      latitude: body.latitude,
      longitude: body.longitude,
      resolvedAddress: body.resolvedAddress,
      manualAddress: body.manualAddress,
      deliveryNotes: body.deliveryNotes,
      deliveryFee: body.deliveryFee,
      totalAmount: amountDue,
    },
  })

  await prisma.cartItem.updateMany({
    where: { userId: session.user.id, orderId: null },
    data: { orderId: order.id },
  })

  if (amountDue <= 0) {
    return NextResponse.json({ orderId: order.id })
  }

  const origin = new URL(request.url).origin

  const paystackRes = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: session.user.email,
      amount: amountDue * 100,
      reference: order.id,
      callback_url: `${origin}/api/paystack/verify`,
    }),
  })

  const paystackData = await paystackRes.json()

  await prisma.payment.create({
    data: {
      orderId: order.id,
      reference: order.id,
      amount: amountDue,
      status: "PENDING",
    },
  })

  return NextResponse.json({ paystackUrl: paystackData.data.authorization_url })
}