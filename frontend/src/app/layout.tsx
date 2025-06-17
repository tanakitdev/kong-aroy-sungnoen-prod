// src/app/layout.tsx
import "./globals.css"
import Navbar from "@/components/Navbar"
import { Prompt } from 'next/font/google'
import { AuthProvider } from '@/context/AuthContext'
import Head from 'next/head'
// import Link from "next/link"
// import { Edit } from "lucide-react"

export const metadata = {
  title: "ของอร่อยสูงเนิน",
  description: "รวมร้านอาหารในอำเภอสูงเนิน",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico"
  },
  openGraph: {
    title: "ของอร่อยสูงเนิน",
    description: "รวมร้านเด็ดในชุมชนที่คุณไม่ควรพลาด",
    url: "bit.ly/4l922Lc", // เปลี่ยนให้ตรงกับโดเมนของคุณ
    siteName: "ของอร่อยสูงเนิน",
    images: [
      {
        url: "https://ของอร่อยสูงเนิน.com/og-image.jpg", // URL ของภาพ OG
        width: 1200,
        height: 630,
        alt: "ของอร่อยสูงเนิน",
      },
    ],
    locale: "th_TH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ของอร่อยสูงเนิน",
    description: "รวมร้านเด็ดในชุมชนที่คุณไม่ควรพลาด",
    images: ["https://ของอร่อยสูงเนิน.com/og-image.jpg"],
  },
}

const prompt = Prompt({
  subsets: ['thai'],
  weight: ['400', '500', '700'],
  display: 'swap',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <Head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
      </Head>
      <body className={`${prompt.className}`}>
        <AuthProvider>
          <Navbar />
          {children}

          {/* Floating Action Button */}
          {/* <Link
            href="/checkin"
            className="fixed bottom-6 right-6 bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-lg transition"
            title="เช็คอินร้านใหม่"
          >
            <div className="flex flex-col items-center">
              <Edit size={28} />
              <span className="text-[10px]">เพิ่มโพสต์</span>
            </div>

          </Link> */}
        </AuthProvider>
      </body>
    </html>
  )
}
