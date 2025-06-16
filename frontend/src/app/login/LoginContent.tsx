"use client"

import { useState } from "react"
import axios from "@/lib/axios"
import { useSearchParams, useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import Link from "next/link"

export default function LoginPage() {
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const { login } = useAuth()

  const searchParams = useSearchParams()
  const from = searchParams.get("from")

  const handleLogin = async () => {
    try {
      const res = await axios.post("/auth/login", { phone, password })
      login(res.data.token, res.data.userId)
      if (from === 'checkin') {
        router.push("/checkin")
      } else {
        router.push("/shops")
      }
    } catch (err) {
      console.log(err);

      // alert(err.response?.data?.message || "เข้าสู่ระบบไม่สำเร็จ")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <h1 className="text-xl font-bold">เข้าสู่ระบบ</h1>
        <input
          type="text"
          placeholder="เบอร์โทร"
          className="border p-2 w-full"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          type="password"
          placeholder="รหัสผ่าน"
          className="border p-2 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white py-2 px-4 rounded"
          onClick={handleLogin}
        >
          เข้าสู่ระบบ
        </button>

        <Link href="/register" className="text-green-600 py-2 px-4 mx-2 rounded">
          สมัครสมาชิก
        </Link>
      </div>
    </div>
  )
}
