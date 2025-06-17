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
    <div className="bg-gray-50">
      <div className="max-w-4xl mx-auto text-gray-800 space-y-4 pt-4 px-3">
        {/* หัวข้อ + ปุ่มเพิ่มร้าน */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">ร้านที่คุณแนะนำ</h1>
          <Link
            href="/dashboard/add-shop"
            className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
          >
            + เพิ่มร้าน
          </Link>
        </div>

        {shops.map((shop) => (
          // <div key={shop._id} className="border rounded p-4 mb-4 drop-shadow bg-white hover:shadow-md transition">
          <div key={shop._id} className="p-1 bg-white rounded-sm shadow overflow-hidden hover:shadow transition-shadow">
            <div className="flex gap-3 items-center md:items-start">
              {/* รูปร้าน */}
              <div className="w-24 h-24 md:w-48 md:h-48 flex-shrink-0 rounded-sm overflow-hidden border bg-gray-100">
                {shop.image ? (
                  <img
                    src={shop.image}
                    alt={shop.name}
                    className="w-full h-full object-fit"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-gray-400 text-sm">ไม่มีรูป</div>
                )}
              </div>

              {/* ข้อมูลร้าน */}
              <div className="flex-1 space-y-1 md:pt-3">
                <h2 className="text-sm md:text-lg">{shop.name}</h2>
                <div className="text-orange-600 text-xs md:text-sm">{shop.category}</div>
                <div className="text-xs md:text-sm text-gray-700">📞 {shop.phone || "ไม่มีข้อมูล"}</div>
              </div>

              {/* ปุ่ม */}
              <div className="flex flex-col items-end gap-2 ml-4 py-2 px-2">
                <Link
                  href={`/dashboard/edit-shop/${shop._id}`}
                  className="text-blue-500 text-xs md:text-lg hover:underline transition-all duration-200"
                  // className="w-20 text-center bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700"
                >
                  แก้ไข
                </Link>

                <button
                  onClick={() => handleDeleteShop(shop._id)}
                  className="text-blue-500 text-xs md:text-lg hover:underline transition-all duration-200"
                  // className="w-20 text-center bg-red-600 text-white text-xs px-3 py-1 rounded hover:bg-red-700"
                >
                  ลบร้าน
                </button>

                <Link
                  href={`/dashboard/manage-menu/${shop._id}`}
                  className="text-blue-500 text-xs md:text-lg hover:underline transition-all duration-200"
                  // className="w-20 text-center bg-gray-600 text-white text-xs px-3 py-1 rounded hover:bg-gray-700"
                >
                  จัดการเมนู
                </Link>
              </div>
              
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
