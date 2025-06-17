"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface Menu {
  _id: string;
  name: string;
  price: string;
  image: string;
}

export default function ManageMenuPage() {
  const { shopId } = useParams();
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

  const handleDelete = async (menuId: string) => {
    if (!confirm("คุณแน่ใจว่าต้องการลบเมนูนี้?")) return;
    try {
      await axios.delete(`/menus/${menuId}`);
      setMenus((prev) => prev.filter((m) => m._id !== menuId));
    } catch (err) {
      console.error("Error deleting menu:", err);
    }
  };

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

      {menus.length === 0 ? (
        <p className="text-gray-500 text-center">ยังไม่มีเมนูในร้านนี้</p>
      ) : (
        <ul className="space-y-2">
          {menus.map((menu) => (
            <li
              key={menu._id}
              className="flex items-center gap-4 border rounded-sm p-1"
            >
              {menu.image ? (
                <img
                  src={menu.image}
                  alt={menu.name}
                  className="w-24 h-24 object-cover rounded-sm border"
                />
              ) : (
                <img
                  src="/nopic.png"
                  alt="ไม่มีรูปเมนู"
                  className="w-24 h-24 object-cover rounded-sm border"
                />
              )}
              <div className="flex-1">
                <h2 className="text-base font-semibold">{menu.name}</h2>
                <p className="text-sm text-gray-600">{menu.price} บาท</p>
              </div>
              <div className="block space-x-4">
                {/* <div className="flex flex-col gap-2 items-end"> */}
                <Link
                  href={`/dashboard/edit-menu/${menu._id}?from=manage-menu&shopId=${shopId}`}
                  className="text-sm text-blue-600 hover:text-blue-500 hover:underline"
                >
                  แก้ไข
                </Link>
                <button
                  onClick={() => handleDelete(menu._id)}
                  className="text-sm text-red-600 hover:text-red-500 hover:underline"
                >
                  ลบออก
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
