// src/app/layout.tsx
import "./globals.css"
import Navbar from "@/components/Navbar"
import { Prompt } from 'next/font/google'
import { AuthProvider } from '@/context/AuthContext'
import Head from 'next/head'
import Script from 'next/script'
import Footer from "@/components/Footer"

// import Link from "next/link"
// import { Edit } from "lucide-react"
import Providers from "./providers" // 👈 นำเข้า Providers

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
    url: "bit.ly/4l922Lc",
    siteName: "ของอร่อยสูงเนิน",
    images: [
      {
        url: "https://ของอร่อยสูงเนิน.com/og-image.jpg",
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
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7442679079181049"
          crossOrigin="anonymous"
        />
        <Providers>
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1">
                {children}

              </main>
              <Footer />
            </div>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  )
}
