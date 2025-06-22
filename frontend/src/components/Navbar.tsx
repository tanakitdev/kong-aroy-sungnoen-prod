'use client'

import Link from "next/link"
// import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, X, Search } from 'lucide-react'
import Image from "next/image"
import { signOut, useSession } from 'next-auth/react'

export default function Navbar() {
  // const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    if (window.location.hash === "#_=_") {
      history.replaceState(null, "", window.location.pathname)
    }
  }, [])

  const handleLoggedOut = () => {
    signOut({ callbackUrl: "/" })
  }

  const isLoggedIn = !!session

  return (
    <nav className="bg-white border-b">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="relative w-40 h-20">
            <Image
              src="/logo_transparent.png"
              alt="โลโก้ ของอร่อยสูงเนิน"
              fill
              className="object-contain"
              priority
              sizes="160px"
            />
          </Link>

          <div className="hidden md:flex items-center space-x-4 mx-4">
            <Link href="/shops" className="text-nowrap text-sm text-gray-700 hover:text-orange-400 flex items-center gap-1">
              <Search size={20} />
              ค้นหาร้านอาหาร
            </Link>

            {isLoggedIn && (
              <Link href="/dashboard" className="text-nowrap text-sm text-gray-700 hover:text-orange-400">แนะนำร้าน</Link>
            )}

            <Link href="/about" className="text-nowrap text-sm text-gray-700 hover:text-orange-400">เกี่ยวกับเรา</Link>
            <Link href="/privacy-policy" className="text-nowrap text-sm text-gray-700 hover:text-orange-400">นโยบาย</Link>
            <Link href="/contact" className="text-nowrap text-sm text-gray-700 hover:text-orange-400">ติดต่อเรา</Link>

            {isLoggedIn ? (
              <>
                {session?.user?.image && (
                  <Link href="/profile" className="text-nowrap text-sm text-gray-700 hover:text-orange-400">
                    <div className="flex items-center">
                      <Image
                        src={session.user.image}
                        alt="Profile"
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                        unoptimized // สำคัญ! เพราะ Facebook CDN อาจไม่อยู่ใน domains ที่อนุญาต
                      />
                      {/* <span className="pl-1">{session.user?.name?.split(" ")[0] || "โปรไฟล์"}</span> */}
                    </div>

                  </Link>

                )}

                <button onClick={handleLoggedOut} className="text-nowrap text-sm hover:text-red-500">ออกจากระบบ</button>
              </>
            ) : (
              <Link href="/login" className="text-nowrap text-sm hover:text-orange-400">เข้าสู่ระบบ</Link>
            )}
          </div>

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

      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3 pt-6">
          <Link href="/shops" onClick={() => setMenuOpen(false)} className="block hover:text-orange-600">
            ค้นหาร้านอาหาร
          </Link>

          {isLoggedIn && (
            <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="block hover:text-orange-400">แนะนำร้าน</Link>
          )}

          <Link href="/about" onClick={() => setMenuOpen(false)} className="block hover:text-orange-600">เกี่ยวกับเรา</Link>
          <Link href="/privacy-policy" onClick={() => setMenuOpen(false)} className="block hover:text-orange-600">นโยบาย</Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)} className="block hover:text-orange-600">ติดต่อเรา</Link>

          {!isLoggedIn ? (
            <>
              <Link href="/login" onClick={() => setMenuOpen(false)} className="block hover:text-orange-400">เข้าสู่ระบบ</Link>
              <Link href="/register" onClick={() => setMenuOpen(false)} className="block hover:text-orange-400">สมัครสมาชิก</Link>
            </>
          ) : (
            <>
              <Link href="/profile" onClick={() => setMenuOpen(false)} className="block hover:text-orange-600">
                {session.user?.name || "โปรไฟล์"}
              </Link>
              <button onClick={() => { handleLoggedOut(); setMenuOpen(false) }} className="block hover:text-red-500">ออกจากระบบ</button>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
