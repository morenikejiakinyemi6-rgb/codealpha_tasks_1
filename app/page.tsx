import { prisma } from "@/lib/prisma"
import Image from "next/image"
import Link from "next/link"
import Nav from "./Nav"
import Footer from "./Footer"
import ProductCard from "./ProductCard"

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { stockQuantity: { gt: 0 } },
    orderBy: { name: "asc" },
    take: 4,
  })

  const styles = await prisma.productCatalog.findMany({
    orderBy: { createdAt: "desc" },
    take: 3,
  })

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <Nav />

      <section className="relative h-[28rem]">
        <Image src="/images/hero.jfif" alt="Regal Exquisite" fill className="object-cover object-[center_25%]" priority />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-8">
          <h1 className="font-display text-4xl md:text-5xl text-white max-w-xl">Made-to-fit pieces, without the wait.</h1>
          <p className="mt-4 text-white/90 max-w-md">Browse ready-to-wear pieces, or request something made just for you.</p>
        </div>
      </section>

      <section className="px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl text-ink">Ready to Wear</h2>
          <Link href="/shop" className="text-sm text-indigo hover:underline">View all</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="px-8 py-16 bg-hairline/20 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl text-ink">Custom Styles</h2>
          <Link href="/styles" className="text-sm text-indigo hover:underline">View all</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {styles.map((style) => (
            <Link key={style.id} href={`/styles/${style.id}`} className="relative h-64 bg-hairline/20 rounded-lg overflow-hidden block">
              <Image src={style.imageUrl} alt={style.caption ?? "Custom style"} fill className="object-contain" />
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}