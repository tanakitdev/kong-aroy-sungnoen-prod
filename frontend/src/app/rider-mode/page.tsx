'use client'

import { useState } from "react"

const mockShops = [
  { id: "1", name: "ร้านป้าแดง", area: "หมู่ 1", isOpen: true },
  { id: "2", name: "ร้านลุงสมชาย", area: "หมู่ 2", isOpen: false },
  { id: "3", name: "ร้านตาแสง", area: "หมู่ 1", isOpen: true },
]

export default function RiderModePage() {
  const [selectedArea, setSelectedArea] = useState("")
  const [pinnedIds, setPinnedIds] = useState<string[]>([])

  const togglePin = (id: string) => {
    setPinnedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const filteredShops = mockShops.filter(
    (shop) => (!selectedArea || shop.area === selectedArea) && shop.isOpen
  )

  const sortedShops = [
    ...filteredShops.filter((shop) => pinnedIds.includes(shop.id)),
    ...filteredShops.filter((shop) => !pinnedIds.includes(shop.id)),
  ]

  return (
    <main className="min-h-screen p-4 bg-white">
      <h1 className="text-xl font-bold mb-4 text-center">🛵 โหมดไรเดอร์</h1>

      <select
        className="w-full border p-2 rounded mb-4"
        value={selectedArea}
        onChange={(e) => setSelectedArea(e.target.value)}
      >
        <option value="">เลือกพื้นที่ทั้งหมด</option>
        <option value="หมู่ 1">หมู่ 1</option>
        <option value="หมู่ 2">หมู่ 2</option>
      </select>

      <div className="flex flex-col gap-3">
        {sortedShops.map((shop) => (
          <div
            key={shop.id}
            className={`border p-4 rounded shadow-sm ${pinnedIds.includes(shop.id) ? "bg-yellow-100 border-yellow-400" : ""
              }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{shop.name}</p>
                <p className="text-sm text-gray-500">{shop.area}</p>
              </div>
              <button
                onClick={() => togglePin(shop.id)}
                className="text-blue-600 text-sm underline"
              >
                {pinnedIds.includes(shop.id) ? "เลิกปักหมุด" : "📌 ปักหมุด"}
              </button>
            </div>
            <a
              href={`/shop/${shop.id}`}
              className="block text-sm text-green-600 mt-1 underline"
            >
              🍴 ดูเมนู
            </a>
          </div>
        ))}
      </div>
    </main>
  )
}
