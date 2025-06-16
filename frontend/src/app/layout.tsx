// src/app/layout.tsx
import "./globals.css"
import Navbar from "@/components/Navbar"
import { Prompt } from 'next/font/google'
import { AuthProvider } from '@/context/AuthContext'

export const metadata = {
  title: "ของอร่อยสูงเนิน",
  description: "รวมร้านอาหารในอำเภอสูงเนิน",
  openGraph: {
    title: "ของอร่อยสูงเนิน",
    description: "รวมร้านเด็ดในชุมชนที่คุณไม่ควรพลาด",
    url: "https://ของอร่อยสูงเนิน.com", // เปลี่ยนให้ตรงกับโดเมนของคุณ
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
      <body className={`${prompt.className}`}>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
