import { prisma } from "@/lib/prisma"
import Nav from "../Nav"
import Footer from "../Footer"
import ProductCard from "../ProductCard"

export default async function ShopPage() {
  const products = await prisma.product.findMany({
    where: { stockQuantity: { gt: 0 } },
    orderBy: { name: "asc" },
  })

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <Nav />
      <section className="px-8 py-16 flex-1 max-w-6xl mx-auto">
        <h1 className="font-display text-2xl text-ink mb-8">Ready to Wear</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      <Footer />
    </div>
  )
}