"use client"

import { useEffect, useState } from "react"
import axios from "@/lib/axios"
import Image from "next/image"
import Link from "next/link"
import { MapPinPlus } from "lucide-react"

type CheckIn = {
    _id: string
    imageUrl: string
    caption?: string
    createdAt: string
    shopId: string
    shopName: string
}

export default function ProfilePage() {
    const [checkins, setCheckins] = useState<CheckIn[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCheckIns = async () => {
            try {
                const res = await axios.get("/checkins")
                setCheckins(res.data)
            } catch (err) {
                console.error("Error loading check-ins", err)
            } finally {
                setLoading(false)
            }
        }

        fetchCheckIns()
    }, [])

    return (
        <div className="relative max-w-3xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold mb-6 text-center">เช็คอินของฉัน</h1>

            {loading ? (
                <p className="text-center text-gray-500">กำลังโหลด...</p>
            ) : checkins.length === 0 ? (
                <p className="text-center text-gray-500">คุณยังไม่ได้เช็คอินร้านค้าใดเลย</p>
            ) : (
                <ul className="space-y-6">
                    {checkins.map((checkin) => (
                        <li key={checkin._id} className="bg-white rounded-xl shadow overflow-hidden">
                            <Link href={`/shop/${checkin.shopId}`}>
                                <Image
                                    src={checkin.imageUrl}
                                    alt="Check-in"
                                    width={800}
                                    height={400}
                                    priority
                                    className="w-full h-48 object-cover transition hover:scale-[1.01]"
                                />
                            </Link>
                            <div className="p-4">
                                <h2 className="text-lg font-semibold text-blue-600">
                                    <Link href={`/shop/${checkin.shopId}`} className="hover:underline">
                                        {checkin.shopName}
                                    </Link>
                                </h2>
                                <Link
                                    href={`/checkin/${checkin._id}`}
                                >
                                    <p className="text-sm text-gray-500 hover:underline">
                                        เช็คอินเมื่อ {new Date(checkin.createdAt).toLocaleDateString("th-TH")}
                                    </p>
                                </Link>

                                {checkin.caption && (
                                    <p className="mt-2 text-gray-700">{checkin.caption}</p>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {/* Floating Action Button */}
            <Link
                href="/checkin"
                className="fixed bottom-6 right-6 bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-lg transition"
                title="เช็คอินร้านใหม่"
            >
                <div className="flex flex-col items-center">
                    <MapPinPlus size={28} />
                    <span className="text-[10px]">Check In</span>
                </div>

            </Link>
        </div>
    )
}
