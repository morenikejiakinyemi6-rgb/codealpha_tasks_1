"use client"
import { useState } from "react"
import Link from "next/link"
import LogoutButton from "./LogoutButton"

export default function MobileMenu({
  isLoggedIn,
  isAdmin,
  cartCount,
}: {
  isLoggedIn: boolean
  isAdmin: boolean
  cartCount: number
}) {
  const [open, setOpen] = useState(false)

  const linkClass = "block py-3 text-ink border-b border-hairline"

  return (
    <div className="md:hidden">
      <button onClick={() => setOpen(!open)} className="text-ink text-2xl leading-none">
        {open ? "✕" : "☰"}
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full bg-white border-b border-hairline px-8 py-2 z-50">
          <Link href="/shop" className={linkClass} onClick={() => setOpen(false)}>Shop</Link>
          <Link href="/styles" className={linkClass} onClick={() => setOpen(false)}>Custom Styles</Link>
          <Link href="/measurements" className={linkClass} onClick={() => setOpen(false)}>My Measurements</Link>
          <Link href="/orders" className={linkClass} onClick={() => setOpen(false)}>My Orders</Link>
          <Link href="/cart" className={linkClass} onClick={() => setOpen(false)}>
            Cart {cartCount > 0 && `(${cartCount})`}
          </Link>
          {isAdmin && (
            <Link href="/admin" className={linkClass} onClick={() => setOpen(false)}>Admin</Link>
          )}
          {isLoggedIn ? (
            <div className={linkClass}><LogoutButton /></div>
          ) : (
            <>
              <Link href="/login" className={linkClass} onClick={() => setOpen(false)}>Log in</Link>
              <Link href="/signup" className="block py-3 text-ink" onClick={() => setOpen(false)}>Sign up</Link>
            </>
          )}
        </div>
      )}
    </div>
  )
}