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
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo_transparent.png" objectFit="objectFit" width={140} height={48} alt="โลโก้ ของอร่อยสูงเนิน" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4 mx-4">
            <Link href="/shops" className="text-nowrap text-sm text-gray-700 hover:text-orange-400 flex items-center gap-1">
              <Search size={20} />
              ค้นหาร้านอาหาร
            </Link>
            {isLoggedIn ? (
              <>
                <Link href="/dashboard" className="text-nowrap text-sm text-gray-700 hover:text-orange-400">แนะนำร้าน</Link>

                <Link href="/about" className="text-nowrap text-sm text-gray-700 hover:text-orange-400">เกี่ยวกับเรา</Link>
                <Link href="/privacy-policy" className="text-nowrap text-sm text-gray-700 hover:text-orange-400">นโยบาย</Link>
                <Link href="/contact" className="text-nowrap text-sm text-gray-700 hover:text-orange-400">ติดต่อเรา</Link>

                <Link href="/profile" className="text-nowrap text-sm text-gray-700 hover:text-orange-400">
                  โปรไฟล์ของฉัน
                </Link>
                <button onClick={handleLoggedOut} className="text-nowrap text-sm hover:text-red-500">ออกจากระบบ</button>
              </>
            ) : (
              <Link href="/login" className="text-nowrap text-sm hover:text-orange-400">เข้าสู่ระบบ</Link>
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

          <Link href="/shops" onClick={() => setMenuOpen(false)} className="block hover:text-orange-600">
            ค้นหาร้านอาหาร
          </Link>

          {isLoggedIn && (
            <>
              <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="block hover:text-orange-400">แนะนำร้าน</Link>
            </>
          )}

          <Link href="/about" onClick={() => setMenuOpen(false)} className="block hover:text-orange-600">เกี่ยวกับเรา</Link>
          <Link href="/privacy-policy" onClick={() => setMenuOpen(false)} className="block hover:text-orange-600">นโยบาย</Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)} className="block hover:text-orange-600">ติดต่อเรา</Link>

          {!isLoggedIn && (
            <>
              <Link href="/login" onClick={() => setMenuOpen(false)} className="block hover:text-orange-400">เข้าสู่ระบบ</Link>
              <Link href="/register" onClick={() => setMenuOpen(false)} className="block hover:text-orange-400">สมัครสมาชิก</Link>
            </>
          )}


          {isLoggedIn &&
            <>
              <Link href="/profile" onClick={() => setMenuOpen(false)} className="block hover:text-orange-600">
                โปรไฟล์ของฉัน
              </Link>
              <button onClick={() => { handleLoggedOut(); setMenuOpen(false) }} className="block hover:text-red-500">ออกจากระบบ</button>
            </>
          }

        </div>
      )}
    </nav>
  )
}
