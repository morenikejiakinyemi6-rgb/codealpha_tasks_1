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
            <Link key={style.id} href={`/styles/${style.id}`} className="relative w-full aspect-[3/4] bg-hairline/20 rounded-lg overflow-hidden block">
              <Image src={style.imageUrl} alt={style.caption ?? "Custom style"} fill className="object-contain" />
            </Link>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  )
}