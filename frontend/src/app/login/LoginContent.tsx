"use client"

// import { useState } from "react"
import { useSearchParams } from "next/navigation"
// import Link from "next/link"

import { signIn } from "next-auth/react"
// import { FacebookIcon } from "next-share"
import {SocialIcon} from 'react-social-icons'



export default function LoginPage() {
  // const [phone, setPhone] = useState("")
  // const [password, setPassword] = useState("")


  const searchParams = useSearchParams()

  const from = searchParams.get("from") || "/shops"
  const fromCheckinByShopId = searchParams.get("shopId")

  const handleLoginFacebook = () => {
    if (from) {
      if (from && fromCheckinByShopId) {
        signIn("facebook", {
          callbackUrl: `/checkin?shopId=${fromCheckinByShopId}`
        })
      } else {
        signIn("facebook", {
          callbackUrl: `/${from}`
        })
      }

    } else {
      signIn("facebook", {
        callbackUrl: '/'
      })
    }

  }

  const handleLoginGoogle = () => {
    // 
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-4">
      {/* <div className="max-w-4xl text-center mx-auto space-y-4">
        <h1 className="text-xl font-bold">เข้าสู่ระบบ</h1>
        <div className="flex flex-col items-center space-y-4">
          <input
            type="text"
            placeholder="เบอร์โทร"
            className="border p-2 w-[300px]"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            type="password"
            placeholder="รหัสผ่าน"
            className="border p-2 w-[300px]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white py-2 px-4 rounded"
            onClick={handleLogin}
          >
            เข้าสู่ระบบ
          </button>
        </div>
      </div> */}

      <div className="flex flex-col items-center">
        {/* <Link href="/register" className="text-green-600 py-2 px-4 mx-2 rounded">
          สมัครสมาชิก
        </Link> */}

        <button
          onClick={handleLoginFacebook}
          className="flex items-center w-[260px] bg-blue-800 hover:bg-blue-900 text-white px-3 py-1 mt-6 rounded"
        >
          {/* <FacebookIcon size={40} />  <span className="pl-2">เข้าสู่ระบบด้วย Facebook</span> */}
          <SocialIcon network="facebook" />  <span className="pl-2">เข้าสู่ระบบด้วย Facebook</span>
        </button>

        <button
          onClick={handleLoginGoogle}
          className="flex items-center w-[260px] bg-orange-800 hover:bg-orange-900 text-white px-3 py-1 mt-6 rounded"
        >
          <SocialIcon network="google" />  <span className="pl-2">เข้าสู่ระบบด้วย Google</span>
        </button>
      </div>
    </div>
  )
}
