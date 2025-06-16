
// src/app/shop/[id]/page.tsx
import type { Metadata, ResolvingMetadata } from 'next'
import ShopDetailPageClient from "./ShopDetailPageClient"

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params

  const API = process.env.NEXT_PUBLIC_API_BASE_URL
  const SITE = process.env.NEXT_PUBLIC_SITE_URL

  try {
    const res = await fetch(`${API}/api/shops/${id}`, { cache: "no-store" });
    // const res = await fetch(`https://kong-aroy-backend-1.onrender.com/api/shops/${id}`, { cache: "no-store" });

    // ✅ เช็คสถานะก่อน parse JSON
    if (!res.ok) throw new Error(`HTTP error ${res.status}`)

    const shop = await res.json()

    const imageUrl = shop.image?.startsWith("http")
      ? shop.image
      : `${SITE}${shop.image}`

    // optionally access and extend (rather than replace) parent metadata
    const previousImages = (await parent).openGraph?.images || []

    return {
      title: shop.name,
      description: `รวมเมนูจากร้าน ${shop.name}`,
      openGraph: {
        title: shop.name,
        description: shop.category || "ร้านอาหาร",
        url: `${SITE}/shop/${shop._id}`,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
          },
          ...previousImages
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: shop.name,
        description: shop.category || "ร้านอาหาร",
        images: [imageUrl],
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

// ✅ Page function
export default async function Page({ params }: Props) {
  const { id } = await params
  const API = process.env.NEXT_PUBLIC_API_BASE_URL


  try {
    const res = await fetch(`${API}/api/shops/${id}`, { cache: "no-store" });

    // ✅ เช็คสถานะก่อน parse JSON
    if (!res.ok) throw new Error(`HTTP error ${res.status}`)

    const shop = await res.json()
    return <ShopDetailPageClient shopId={shop._id} />
  } catch {
    return {
      title: "ของอร่อยสูงเนิน",
      description: "รวมร้านเด็ดในชุมชนที่คุณไม่ควรพลาด",
    }
  }
}
