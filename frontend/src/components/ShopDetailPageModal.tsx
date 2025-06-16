"use client"

import { useEffect, useState } from "react"
import axios from "@/lib/axios"

import ShopDetailContent from "@/components/ShopDetailContent"

type Shop = {
  _id: string
  image: string;
  name: string;
  category: string;
  isOpen: string;
  phone: string;
  openTime: string;
  closeTime: string;
  location: string;
};
type Menu = {
  _id: string;
  image: string;
  name: string;
  price: string;
}


export default function ShopDetailPageModal({
  shopId,
  onClose,
}: {
  shopId: string
  onClose: () => void
}) {
  const [shop, setShop] = useState<Shop>()
  const [menus, setMenus] = useState<Menu[]>([])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEsc)

    return () => {
      window.removeEventListener("keydown", handleEsc)
    }
  }, [onClose])

  useEffect(() => {
    if (shopId) {
      fetchShop()
      fetchMenus()
    }
  }, [shopId])

  const fetchShop = async () => {
    try {
      const res = await axios.get(`/shops/${shopId}`)
      setShop(res.data)
    } catch (err) {
      console.error("Error fetching shop:", err)
    }
  }

  const fetchMenus = async () => {
    try {
      const res = await axios.get(`/menus/by-shop/${shopId}`)
      setMenus(res.data)
    } catch (err) {
      console.error("Error fetching menus:", err)
    }
  }

  if (!shop) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="bg-white max-w-4xl w-full max-h-[100vh] overflow-y-auto shadow-lg"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-6xl z-50 hover:opacity-80 transition"
        >
          <div>&times;</div>
        </button>
        
        <ShopDetailContent shop={shop} menus={menus} />

      </div>
    </div>
  )
}
