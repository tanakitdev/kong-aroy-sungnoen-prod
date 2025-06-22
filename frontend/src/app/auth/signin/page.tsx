"use client"

import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"

export default function SignInPage() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  return (
    <div className="min-h-screen flex items-center justify-center">
      
      <button
        onClick={() => signIn("facebook", { callbackUrl })}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded"
      >
        เข้าสู่ระบบด้วย Facebook
      </button>
    </div>
  )
}
