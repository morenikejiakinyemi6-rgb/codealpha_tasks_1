import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import Image from "next/image"
import Nav from "../../Nav"
import Footer from "../../Footer"
import RequestStyleForm from "./RequestStyleForm"

export default async function StyleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const style = await prisma.productCatalog.findUnique({ where: { id } })
  const session = await auth()

  const measurement = session?.user?.id
    ? await prisma.measurement.findUnique({ where: { userId: session.user.id } })
    : null

  if (!style) {
    return <div className="p-8">Style not found.</div>
  }

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <Nav />
      <section className="px-8 py-16 w-full flex-1 grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
        <div className="relative h-[28rem] bg-hairline/20 rounded-lg overflow-hidden">
          <Image src={style.imageUrl} alt={style.caption ?? "Custom style"} fill className="object-contain" />
        </div>
        <div>
          <h1 className="font-display text-2xl text-ink mb-4">{style.caption ?? "Custom Style"}</h1>
          <RequestStyleForm styleId={style.id} styleImageUrl={style.imageUrl} measurement={measurement} />
        </div>
      </section>
      <Footer />
    </div>
  )
}