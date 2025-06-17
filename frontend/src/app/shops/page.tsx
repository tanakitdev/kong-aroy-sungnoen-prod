// src/app/shops/page.tsx
import { Suspense } from "react"
import ShopPage from "./ShopsContent"

import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  try {
    return {
      title: 'ของอร่อยสูงเนิน',
      description: `รวมร้านเด็ดในชุมชนที่คุณไม่ควรพลาด`,
      openGraph: {
        title: "ของอร่อยสูงเนิน",
        description: "รวมร้านเด็ดในชุมชนที่คุณไม่ควรพลาด",
        url: "https://ของอร่อยสูงเนิน.com", // เปลี่ยนให้ตรงกับโดเมนของคุณ
        images: [
          {
            url: "https://ของอร่อยสูงเนิน.com/og-image.jpg", // URL ของภาพ OG
            width: 1200,
            height: 630,
            alt: "ของอร่อยสูงเนิน",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "ของอร่อยสูงเนิน",
        description: "รวมร้านเด็ดในชุมชนที่คุณไม่ควรพลาด",
        images: ["https://ของอร่อยสูงเนิน.com/og-image.jpg"],
      },
    }
  } catch (e) {
    console.error("generateMetadata error", e)
    return {
      title: "ของอร่อยสูงเนิน",
      description: "รวมร้านเด็ดในชุมชนที่คุณไม่ควรพลาด",
    }
  }
}


export default async function ShopsWrapper() {

  const API = process.env.NEXT_PUBLIC_API_BASE_URL

  const res = await fetch(`${API}/api/shops`, { cache: "no-store" });

  // ✅ เช็คสถานะก่อน parse JSON
  if (!res.ok) throw new Error(`HTTP error ${res.status}`)

  const shops = await res.json()

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ShopPage shopLists={shops.data} />
    </Suspense>
  )
}
