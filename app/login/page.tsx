'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import Image from 'next/image';
import PasswordSwitch from "@/app/password";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter()

    async function handleSubmit (e: React.FormEvent) {
        e.preventDefault()
        setError("")

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        })

        if (res?.error) {
            setError("Invalid email or password.")
            return
        }

        router.push("/")
    }

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:flex md:w-2/5 bg-indigo flex-col justify-between p-12 text-ivory">
        <div className="flex items-end gap-1">
          <Image src="/images/logoicon.png" alt="Regal Exquisite Logo" width={64} height={64} priority className="object-contain -mr-2" />
          <div className="flex flex-col text-white font-16 text-xs tracking-widest leading-tight pb-1">
            <span>REGAL</span>
            <span>EXQUISITE</span>
          </div>
        </div>

        <div className="relative flex-1 my-6 rounded-xl overflow-hidden border border-white/10">
          <Image src="/images/hero.jfif" alt="Fashion designer packaging custom garments" fill priority sizes="(max-width: 768px) 100vw, 40vw" className="object-cover" />
        </div>

        <span className="text-l text-ivory/70">&copy; 2026 StoreFashion</span>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-white z-10">
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <h1 className="font-display text-3xl text-ink mb-2">Log in</h1>
          <div className="w-12 h-0.5 bg-indigo mb-8" />

          <div className="mb-5">
            <label htmlFor="email" className="block text-sm font-medium text-ink mb-1">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-hairline bg-white px-4 py-3 text-ink focus:outline-none focus:border-indigo focus:ring-2 focus:ring-indigo transition-all" />
          </div>

          <div className="mb-8">
            <label htmlFor="password" className="block text-sm font-medium text-ink mb-1">Password</label>
            <PasswordSwitch id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-hairline bg-white px-4 py-3 text-ink focus:outline-none focus:border-indigo focus:ring-2 focus:ring-indigo transition-all" />
          </div>

          {error && <p className="text-sm text-gold mb-4">{error}</p>}

          <button type="submit" className="w-full rounded-lg bg-indigo text-ivory py-3 font-medium hover:bg-indigo-dark transition-colors">
            Log in
          </button>

        <p className="text-sm text-ink/60 mt-4 text-center">
            Don&apos;t have an account? <a href="/signup" className="text-indigo hover:underline">Sign up</a>
          </p>
        </form>
      </div>
    </div>
  )
}