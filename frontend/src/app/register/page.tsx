"use client"

import { useState } from "react"
import axios from "@/lib/axios"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function RegisterPage() {
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleRegister = async () => {
    try {
      const res = await axios.post("/auth/register", { phone, password })
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("userId", res.data.userId)
      router.push("/dashboard")
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <h1 className="text-xl font-bold">สมัครสมาชิก</h1>
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
          className="bg-green-600 text-white py-2 px-4 rounded"
          onClick={handleRegister}
        >
          สมัครสมาชิก
        </button>

        <Link href="/login" className="text-blue-600 py-2 px-4 mx-2 rounded">
          เข้าสู่ระบบ
        </Link>
      </div>
    </div>
  )
}
