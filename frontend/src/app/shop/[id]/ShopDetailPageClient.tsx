"use client"

import { useEffect, useState } from "react"
// import { useParams } from "next/navigation"
import axios from "@/lib/axios"
import ShopDetailContent from "@/components/ShopDetailContent"

type Shop = {
  _id: string
  image: string
  name: string
  category: string
  isOpen: string
  phone: string
  openTime: string
  closeTime: string
  location: string
}
type Menu = {
  _id: string
  image: string
  name: string
  price: string
}

// type Props = {
//   shopId: Promise<{ [key: string]: string | string[] | undefined }>
// }
type Props = {
  shopId: string
}



export default function ShopDetailPageClient({ shopId }: Props) {
  // const { id } = useParams()
  const [shop, setShop] = useState<Shop>()
  const [menus, setMenus] = useState<Menu[]>([])



  useEffect(() => {
    fetchShop()
    fetchMenus()
  }, [])

  const fetchShop = async () => {
    try {
      // const { id } = await shopId
      const res = await axios.get(`/shops/${shopId}`)
      setShop(res.data)
    } catch (err) {
      console.error("Error fetching shop:", err)
    }
  }

  const fetchMenus = async () => {
    try {
      // const { id } = await shopId
      const res = await axios.get(`/menus/by-shop/${shopId}`)
      setMenus(res.data)
    } catch (err) {
      console.error("Error fetching menus:", err)
    }
  }

  if (!shop) return <div className="p-4">กำลังโหลดข้อมูลร้าน...</div>

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <ShopDetailContent shop={shop} menus={menus} />
    </div>
  )
}