"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import MenuActionDropdown from "@/components/MenuActionDropdown"

interface Menu {
  _id: string;
  name: string;
  price: string;
  image: string;
}

type Shop = {
  shopId: string
}

export default function ManageMenuPage() {
  const { shopId } = useParams<Shop>();
  const [menus, setMenus] = useState<Menu[]>([]);

  const router = useRouter();

  useEffect(() => {
    if (!shopId) return;
    const fetchMenus = async () => {
      try {
        const res = await axios.get(`/menus/by-shop/${shopId}`);
        setMenus(res.data);
      } catch (err) {
        console.error("Error fetching menus:", err);
      }
    };
    fetchMenus();
  }, [shopId]);

  // const handleDelete = async (menuId: string) => {
  //   if (!confirm("คุณแน่ใจว่าต้องการลบเมนูนี้?")) return;
  //   try {
  //     await axios.delete(`/menus/${menuId}`);
  //     setMenus((prev) => prev.filter((m) => m._id !== menuId));
  //   } catch (err) {
  //     console.error("Error deleting menu:", err);
  //   }
  // };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">

        <button
          type="button"
          className="bg-gray-600 text-white py-1 px-2 rounded hover:bg-gray-700"
          onClick={() => router.back()}
        >
          <div className="flex items-center">
            <ChevronLeft />  <span>ย้อนกลับ</span>
          </div>
        </button>

        <h1 className="text-xl font-bold">เมนูของร้าน</h1>
        <Link
          href={`/dashboard/add-menu/${shopId}?from=manage-menu`}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          + เพิ่มเมนู
        </Link>
      </div>

      <table className="w-full text-sm bg-white rounded-md shadow">
        <thead className="bg-gray-100 text-left text-gray-600 uppercase">
          <tr>
            <th className="p-3">#</th>
            <th className="p-3">รูป</th>
            <th className="p-3">ชื่อเมนู</th>
            <th className="p-3">ราคา</th>
            <th className="p-3 text-center">การจัดการ</th>
          </tr>
        </thead>
        <tbody>
          {menus.map((menu, index) => (
            <tr key={menu._id} className="border-b hover:bg-gray-50">
              <td className="p-3 align-top">{index + 1}</td>
              <td className="p-3">
                <div className="w-12 h-12 overflow-hidden border rounded">
                  <img
                    src={menu.image || "/nopic.png"}
                    alt={menu.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </td>
              <td className="p-3 font-medium text-gray-800">{menu.name}</td>
              <td className="p-3 text-gray-700">{menu.price} บาท</td>
              <td className="p-3 text-center">
                <MenuActionDropdown
                  menuId={menu._id}
                  shopId={shopId}
                  onDeleted={() => setMenus(menus.filter(m => m._id !== menu._id))}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
