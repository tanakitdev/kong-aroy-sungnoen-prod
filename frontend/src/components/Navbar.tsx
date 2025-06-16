'use client'

import Link from "next/link"
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useState } from 'react'
import { Menu, X, Search } from 'lucide-react'
import Image from "next/image"

export default function Navbar() {
  const router = useRouter()
  const { isLoggedIn, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLoggedOut = () => {
    router.push("/")
    // alert('logout')
    logout()
    // location.reload();
  }

  return (
    <nav className="bg-white border-b">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center h-16">
          {/* โลโก้ */}
          {/* <Link href="/" className="text-2xl font-bold text-orange-500">ของอร่อยสูงเนิน</Link> */}
          <Link href="/" className="flex items-center gap-2">
            {/* <Image
              src="/logo-sungnoen.png"
              alt="ของอร่อยสูงเนิน"
              width={80}
              height={48}
              className="object-contain"
            /> */}
            <Image src="/logo_transparent.png" objectFit="objectFit" width={140} height={48} alt="โลโก้ ของอร่อยสูงเนิน"/>
            {/* <span className="text-md font-bold text-[24px] text-gray-700 whitespace-nowrap">
              ของอร่อย<span className="text-orange-500 underline">สูงเนิน</span>
            </span> */}
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4 mx-4">
            <Link href="/shops" className="hover:text-orange-400 flex items-center gap-1">
              <Search size={20} />
              ค้นหาร้านอาหาร
            </Link>
            {isLoggedIn ? (
              <>
                <Link href="/dashboard" className="hover:text-orange-400">จัดการร้าน</Link>
                <Link href="/profile" className="hover:underline">
                  โปรไฟล์ของฉัน
                </Link>
                <button onClick={handleLoggedOut} className="hover:text-red-500">ออกจากระบบ</button>
              </>
            ) : (
              <Link href="/login" className="hover:text-orange-400">เข้าสู่ระบบ</Link>
            )}
          </div>

          {/* Mobile Menu Toggle + Search */}
          <div className="md:hidden flex items-center gap-3 mx-4">
            <Link href="/shops" className="hover:text-orange-400 flex items-center gap-1">
              <Search size={22} />
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3 pt-6">
          {isLoggedIn ? (
            <>
              <Link href="/profile" onClick={() => setMenuOpen(false)} className="block hover:text-orange-600">
                โปรไฟล์ของฉัน
              </Link>
              <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="block hover:text-orange-400">จัดการร้าน</Link>
              <button onClick={() => { handleLoggedOut(); setMenuOpen(false) }} className="block hover:text-red-500">ออกจากระบบ</button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setMenuOpen(false)} className="block hover:text-orange-400">เข้าสู่ระบบ</Link>
              <Link href="/register" onClick={() => setMenuOpen(false)} className="block hover:text-orange-400">สมัครสมาชิก</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
