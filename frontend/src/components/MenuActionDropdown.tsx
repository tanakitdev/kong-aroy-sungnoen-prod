"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import axios from "@/lib/axios"
import { Edit, Trash2 } from "lucide-react"

export default function MenuActionDropdown({
    menuId,
    shopId,
    onDeleted,
}: {
    menuId: string
    shopId: string
    onDeleted: () => void
}) {
    const [open, setOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const handleDelete = async () => {
        const confirmText = prompt('พิมพ์ "delete" เพื่อยืนยันการลบเมนู')
        if (confirmText !== "delete") return

        try {
            await axios.delete(`/menus/${menuId}`)
            onDeleted()
        } catch {
            alert("ลบไม่สำเร็จ")
        }
    }

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <button
                onClick={() => setOpen(!open)}
                className="p-1 text-gray-500 hover:text-black rounded-full font-bold text-lg"
            >
                ⋯
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow z-50">
                    <Link
                        href={`/dashboard/edit-menu/${menuId}?from=manage-menu&shopId=${shopId}`}
                        className="flex items-center  px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                        <Edit /> <span className="pl-2">แก้ไข</span>
                    </Link>
                    <button
                        onClick={handleDelete}
                        className="flex items-center border-t w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                        <Trash2 /> <span className="pl-2">ลบ</span>
                    </button>
                </div>
            )}
        </div>
    )
}
