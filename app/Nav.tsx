import Image from "next/image"
import Link from "next/link"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import LogoutButton from "./LogoutButton"


export default async function Nav() {
  const session = await auth()

  const cartCount = session?.user?.id
    ? await prisma.cartItem.count({ where: { userId: session.user.id, orderId: null } })
    : 0
    

  return (
    <nav className="flex items-center justify-between px-8 py-6 border-b border-hairline">
      <Link href="/" className="flex items-end gap-2">
        <Image src="/images/logoicon.png" alt="Regal Exquisite" width={40} height={40} style={{ height: "auto" }} className="object-contain" />
        <span className="font-display text-xl text-ink leading-none">REGAL EXQUISITE</span>
      </Link>
      <div className="flex items-center gap-6 text-sm text-ink">
        <Link href="/shop" className="hover:text-indigo hover:underline underline-offset-4 transition-colors">Shop</Link>
        <Link href="/styles" className="hover:text-indigo hover:underline underline-offset-4 transition-colors">Custom Styles</Link>
        <Link href="/measurements" className="hover:text-indigo hover:underline underline-offset-4 transition-colors">My Measurements</Link>
        <Link href="/cart" className="hover:text-indigo hover:underline underline-offset-4 transition-colors relative">
          Cart
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-4 bg-clay text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>
        
        {session?.user ? (
          <LogoutButton />
        ) : (
          <>
            <Link href="/login" className="hover:text-indigo hover:underline underline-offset-4 transition-colors">Log in</Link>
            <Link href="/signup" className="hover:text-indigo hover:underline underline-offset-4 transition-colors">Sign up</Link>
          </>
        )}
      </div>
    </nav>
  )
}