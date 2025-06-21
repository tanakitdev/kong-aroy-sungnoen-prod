import { useEffect, useState } from "react"
import axios from "@/lib/axios"

import {
    FacebookShareButton,
    FacebookIcon,
    LineShareButton,
    LineIcon
} from 'next-share'
import { ChevronLeft, Heart, MapPinPlus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

type Checkin = {
    _id: string
    imageUrl: string
    caption?: string
    createdAt: string
    userName: string
    userPhone: string
    shopName: string
}


type Props = {
    shop: {
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
    menus: {
        _id: string
        image: string
        name: string
        price: string
    }[]
}

export default function ShopDetailContent({ shop, menus }: Props) {
    const [checkins, setCheckins] = useState<Checkin[]>([])
    const [showAll, setShowAll] = useState(false)
    const [showAllMenu, setShowAllMenu] = useState(false)

    const router = useRouter();

    useEffect(() => {
        const loadCheckins = async () => {
            const res = await axios.get(`/checkins/by-shop?shopId=${shop._id}`)
            setCheckins(res.data)
        }
        loadCheckins()
    }, [shop._id])

    const visibleMenus = showAllMenu ? menus : menus.slice(0, 5)
    const visibleCheckins = showAll ? checkins : checkins.slice(0, 5)

    // const maskPhone = (phone: string) => {
    //     if (!phone || phone.length < 9) return "ไม่ระบุเบอร์"
    //     return `******${phone.slice(-4)}`
    // }


    return (
        <div>

            <button
                onClick={() => {
                    router.back()
                    document.body.classList.remove("overflow-y-hidden")
                }}
                className="fixed top-16 left-4 bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 rounded-full shadow-lg transition "
            >
                <div className="flex items-center">
                    <ChevronLeft size={24} />
                    <span className="text-[16px]">ย้อนกลับ</span>
                </div>

            </button>

            <img
                src={shop.image}
                alt={shop.name}
                className="w-full h-64 object-cover"
            />



            <div className="px-4">
                <div className="border-b pb-4 mt-4">
                    <div className="flex items-center justify-between gap-2">
                        <div>
                            <h1 className="text-2xl font-bold">{shop.name}</h1>

                            {shop.isOpen ? (
                                <span className="text-green-600 font-medium">เปิดอยู่</span>
                            ) : (
                                <span className="text-red-600 font-medium">ปิดแล้ว</span>
                            )}
                        </div>

                        <div>

                            <FacebookShareButton
                                blankTarget={true}
                                url={`https://ของอร่อยสูงเนิน.com/shop/${shop._id}`}
                                hashtag={'#ของอร่อยสูงเนิน #ร้านอร่อยสูงเนิน'}
                            >
                                <FacebookIcon size={32} round />
                            </FacebookShareButton>

                            <LineShareButton
                                url={`https://ของอร่อยสูงเนิน.com/shop/${shop._id}`}
                                title={'ของอร่อยสูงเนิน รวมร้านเด็ดในชุมชนที่คุณไม่ควรพลาด'}
                            >
                                <LineIcon size={32} round />
                            </LineShareButton>
                        </div>


                    </div>

                    {shop.phone && (
                        <a
                            href={`tel:${shop.phone}`}
                            className="mt-4 mb-2 inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                        >
                            📞 โทรหาร้าน
                        </a>
                    )}

                    <button
                        onClick={() => {
                            if (navigator.share) {
                                navigator.share({
                                    title: shop.name,
                                    url: `https://ของอร่อยสูงเนิน.com/shop/${shop._id}`,
                                })
                            } else {
                                window.open(
                                    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                                        `https://ของอร่อยสูงเนิน.com/shop/${shop._id}`
                                    )}`,
                                    '_blank'
                                )
                            }
                        }}
                        className="mt-2 mb-2 ml-2 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                        📤 แชร์ร้าน
                    </button>

                    <p className="text-sm text-gray-500">{shop.category}</p>
                    <p className="text-sm text-gray-600 mt-1">
                        🕐 {shop.openTime} - {shop.closeTime}
                    </p>

                    {shop.location && (
                        <a
                            href={`https://www.google.com/maps?q=${shop.location}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline text-sm mt-2 inline-block"
                        >
                            📍 ดูแผนที่
                        </a>
                    )}


                    {/* แสดง menus ตรงนี้ */}
                    {menus.length === 0 ? (
                        <p className="text-gray-500 mt-4">ร้านนี้ยังไม่มีเมนู</p>
                    ) : (
                        <div className="mt-4">
                            <h2 className="text-md font-semibold mb-2">เมนูอาหาร</h2>
                            <ul className="grid grid-cols-1 gap-2">
                                {visibleMenus.map((menu) => (
                                    <li key={menu._id} className="flex items-center gap-3">
                                        <img
                                            src={menu.image}
                                            alt={menu.name}
                                            className="w-10 h-10 object-cover rounded"
                                        />
                                        <div className="text-sm">{menu.name} - {menu.price} บาท</div>
                                    </li>
                                ))}
                            </ul>

                            {menus.length > 5 && !showAllMenu && (
                                <button
                                    onClick={() => setShowAllMenu(true)}
                                    className="mt-4 text-blue-600 underline"
                                >
                                    ดูเมนูเพิ่มเติม {menus.length - 5} รายการ
                                </button>
                            )}
                            {showAllMenu && (
                                <button
                                    onClick={() => setShowAllMenu(false)}
                                    className="mt-4 text-blue-600 underline"
                                >
                                    ซ่อนเมนู
                                </button>
                            )}
                        </div>
                    )}


                </div>

                <div className="mt-4">
                    <h2 className="text-xl font-semibold mb-2">
                        Check-ins ล่าสุดของร้าน
                    </h2>

                    {checkins.length === 0 ? (
                        <p className="text-gray-500">ร้านนี้ยังไม่มีการ Check-in</p>
                    ) : (
                        <>
                            <ul className="grid grid-cols-1 gap-2">
                                {visibleCheckins.map((c) => (
                                    <li key={c._id} className="border-b p-3 ">

                                        <p className="text-lg">{c.userName || "ผู้ใช้ไม่ระบุตัวตน"}</p>
                                        <p className="text-sm text-gray-700">{c.caption || "ไม่มีคำบรรยาย"}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {new Date(c.createdAt).toLocaleDateString("th-TH")} {new Date(c.createdAt).getHours()}:{new Date(c.createdAt).getMinutes()} น.
                                        </p>

                                        <img
                                            src={c.imageUrl}
                                            alt={c.caption}
                                            className="w-32 h-32 object-cover rounded pt-4"
                                        />
                                        <button>
                                            <div className="flex items-center text-orange-500 mt-4">
                                                <Heart size={20} /> <span className="pl-1">0</span>
                                            </div>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            {checkins.length > 5 && !showAll && (
                                <button
                                    onClick={() => setShowAll(true)}
                                    className="mt-4 text-blue-600 underline"
                                >
                                    ดู Check-ins เพิ่มเติม
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Floating Action Button */}
            <Link
                href={`/checkin?shopId=${shop._id}`}
                className="fixed bottom-6 right-6 bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-lg transition "
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

