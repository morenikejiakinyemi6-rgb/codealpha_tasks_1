"use client"
import { signOut } from "next-auth/react"

export default function LogoutButton() {
  return (
    <button onClick={() => signOut({ callbackUrl: "/" })} className="hover:text-indigo hover:underline underline-offset-4 transition-colors">
      Log out
    </button>
  )
}