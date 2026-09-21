import { prisma } from "@/lib/prisma"
import Image from "next/image"
import Nav from "../Nav"
import Footer from "../Footer"
import Link from "next/link"

export default async function StylesPage() {
  const styles = await prisma.productCatalog.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <Nav />
      <section className="px-8 w-full py-16 flex-1 max-w-6xl mx-auto">
        <h1 className="font-display text-2xl text-ink mb-8">Custom Styles</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {styles.map((style) => (
            <Link key={style.id} href={`/styles/${style.id}`} className="block border border-hairline rounded-lg overflow-hidden">
              <div className="relative h-64 bg-hairline/20">
                <Image src={style.imageUrl} alt={style.caption ?? "Custom style"} fill sizes="(max-width: 768px) 50vw, 33vw" className="object-contain" />
              </div>
              <div className="p-3">
                {style.caption && <p className="text-sm text-ink font-medium">{style.caption}</p>}
                <p className="text-sm text-indigo mt-1">Order this Style →</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  )
}