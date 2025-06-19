"use client"

import { useEffect, useState } from "react"
import axios from "@/lib/axios"
import Link from "next/link"
import ActionDropdown from "@/components/ActionDropdown"

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

  // const handleDeleteShop = async (shopId: string) => {
  //   const confirmText = prompt('กรุณาพิมพ์คำว่า "delete" เพื่อยืนยันการลบร้านค้า')
  //   if (confirmText !== "delete") {
  //     alert("ยกเลิกการลบร้านค้า")
  //     return;
  //   }

  //   try {
  //     await axios.delete(`/shops/${shopId}`)
  //     alert("ลบร้านค้าเรียบร้อยแล้ว")
  //     // อัปเดตรายการร้านค้า
  //     if (userId) {
  //       const res = await axios.get(`/shops/by-user?userId=${userId}`)
  //       setShops(res.data)
  //     }
  //   } catch (err) {
  //     console.error("ลบร้านค้าไม่สำเร็จ", err)
  //     alert("เกิดข้อผิดพลาดในการลบร้านค้า")
  //   }
  // }

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


        <table className="w-full text-sm bg-white rounded-md shadow">
          <thead className="bg-gray-100 text-left text-gray-600 uppercase">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">ชื่อร้าน</th>
              <th className="p-3 hidden md:table-cell">หมวดหมู่</th>
              <th className="p-3 hidden md:table-cell">เบอร์โทร</th>
              <th className="p-3 text-right">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {shops.map((shop, index) => (
              <tr key={shop._id} className="border-b hover:bg-gray-50 group">
                <td className="p-3 align-top">{index + 1}</td>
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 flex-shrink-0 bg-gray-100 border rounded overflow-hidden">
                      {shop.image ? (
                        <img
                          src={shop.image}
                          alt={shop.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center text-gray-400 text-xs pt-3">ไม่มีรูป</div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{shop.name}</p>
                      <p className="text-xs text-gray-500 md:hidden">{shop.category}</p>
                      <p className="text-xs text-gray-500 md:hidden">{shop.phone || "ไม่มีเบอร์"}</p>
                    </div>
                  </div>
                </td>
                <td className="p-3 hidden md:table-cell">{shop.category}</td>
                <td className="p-3 hidden md:table-cell">{shop.phone || "ไม่มีข้อมูล"}</td>
                <td className="p-3 text-center relative">
                  <ActionDropdown shopId={shop._id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  )
}
