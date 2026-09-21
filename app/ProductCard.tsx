import Image from "next/image"
import AddToCartButton from "./AddToCartButton"

type Product = {
  id: string
  name: string
  size: string
  color: string
  price: number
  imageUrl: string
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="border border-hairline rounded-lg overflow-hidden flex flex-col h-full">
      <div className="relative h-56 bg-hairline/20">
        <Image src={product.imageUrl} alt={product.name} fill className="object-contain" />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <p className="text-ink font-medium">{product.name}</p>
        <p className="text-ink/60 text-sm">{product.size} · {product.color}</p>
        <p className="text-indigo font-semibold">₦{product.price.toLocaleString()}</p>
        <div className="mt-auto pt-3">
          <AddToCartButton productId={product.id} />
        </div>
      </div>
    </div>
  )
}