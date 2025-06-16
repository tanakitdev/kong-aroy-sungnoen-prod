"use client"

import { useEffect, useState } from "react"
import axios from "@/lib/axios"
import Link from "next/link"

interface Menu {
  _id: string
  name: string
  price: string
}

interface Shop {
  _id: string
  name: string
  image: string
  category: string
  phone: string
  menus: Menu[]
}

export default function DashboardPage() {
  const [shops, setShops] = useState<Shop[]>([])
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const id = localStorage.getItem("userId")
    if (id) {
      setUserId(id)
    }
  }, [])

  useEffect(() => {
    if (userId) {
      axios.get(`/shops/by-user?userId=${userId}`).then((res) => {
        setShops(res.data)
      })
    }
  }, [userId])

  const handleDeleteShop = async (shopId: string) => {
    const confirmText = prompt('กรุณาพิมพ์คำว่า "delete" เพื่อยืนยันการลบร้านค้า')
    if (confirmText !== "delete") {
      alert("ยกเลิกการลบร้านค้า")
      return;
    }

    try {
      await axios.delete(`/shops/${shopId}`)
      alert("ลบร้านค้าเรียบร้อยแล้ว")
      // อัปเดตรายการร้านค้า
      if (userId) {
        const res = await axios.get(`/shops/by-user?userId=${userId}`)
        setShops(res.data)
      }
    } catch (err) {
      console.error("ลบร้านค้าไม่สำเร็จ", err)
      alert("เกิดข้อผิดพลาดในการลบร้านค้า")
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 pt-4 px-3">
      {/* หัวข้อ + ปุ่มเพิ่มร้าน */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">ร้านของคุณ</h1>
        <Link
          href="/dashboard/add-shop"
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          + เพิ่มร้าน
        </Link>
      </div>

      {shops.map((shop) => (
        <div key={shop._id} className="border rounded p-4 mb-4 shadow-sm bg-white hover:shadow-md transition">
          <div className="flex gap-4 items-start">
            {/* รูปร้าน */}
            <div className="w-32 h-32 flex-shrink-0 rounded overflow-hidden bg-gray-100 border">
              {shop.image ? (
                <img
                  src={shop.image}
                  alt={shop.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-gray-400 text-sm">ไม่มีรูป</div>
              )}
            </div>

            {/* ข้อมูลร้าน */}
            <div className="flex-1 space-y-1">
              <h2 className="text-lg font-semibold">{shop.name}</h2>
              <div className="text-orange-600 text-sm">{shop.category}</div>
              <div className="text-sm text-gray-700">📞 {shop.phone || "ไม่มีข้อมูล"}</div>
            </div>

            {/* ปุ่ม */}
            <div className="flex flex-col items-end gap-2 ml-4">
              <Link
                href={`/dashboard/edit-shop/${shop._id}`}
                className="w-24 text-center border text-xs bg-blue-100 border-blue-500 hover:bg-blue-500 hover:text-white rounded-md px-2 py-1 transition"
              >
                ✏️ แก้ไข
              </Link>

              <button
                onClick={() => handleDeleteShop(shop._id)}
                className="w-24 text-center border text-xs bg-red-100 border-red-500 hover:bg-red-500 hover:text-white rounded-md px-2 py-1 transition"
              >
                🗑️ ลบร้าน
              </button>

              <Link
                href={`/dashboard/manage-menu/${shop._id}`}
                className="bg-gray-700 text-white text-xs px-3 py-2 rounded hover:bg-gray-800"
              >
                จัดการเมนู
              </Link>
            </div>
          </div>
        </div>
      ))}


    </div>
  )
}
