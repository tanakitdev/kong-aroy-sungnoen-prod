"use client"

import { useSession, signIn, signOut } from "next-auth/react"

export default function AuthButtons() {
  const { data: session } = useSession()

  if (session?.user) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">{session.user.name}</span>
        <button
          onClick={() => signOut()}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          ออกจากระบบ
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => signIn()}
      className="px-3 py-1 bg-blue-500 text-white rounded"
    >
      เข้าสู่ระบบ
    </button>
  )
}
