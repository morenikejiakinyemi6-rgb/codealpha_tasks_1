'use client'

import { useState } from "react"

interface PasswordSwitchProps {
  id?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
  type?: string
}

export default function PasswordSwitch({
  id = "password",
  value,
  onChange,
  className = "",
}: PasswordSwitchProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="relative flex items-center">
      <input
        id={id}
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        
        className={className}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 text-xs font-medium text-ink/60 hover:text-ink transition-colors"
      >
        {showPassword ? "Hide" : "Show"}
      </button>
    </div>
  )
}