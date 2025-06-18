import { useEffect, useState } from "react"
import axios from "@/lib/axios"

import {
    FacebookShareButton,
    FacebookIcon,
    LineShareButton,
    LineIcon
} from 'next-share'

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

    useEffect(() => {
        const loadCheckins = async () => {
            const res = await axios.get(`/checkins/by-shop?shopId=${shop._id}`)
            setCheckins(res.data)
        }
        loadCheckins()
    }, [shop._id])

    const visibleMenus = showAllMenu ? menus : menus.slice(0, 5)
    const visibleCheckins = showAll ? checkins : checkins.slice(0, 5)

    const maskPhone = (phone: string) => {
        if (!phone || phone.length < 9) return "ไม่ระบุเบอร์"
        return `${phone.slice(0, 2)}****${phone.slice(-4)}`
    }


    return (
        <div>
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

                    {/* <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://ของอร่อยสูงเนิน.com/shop/${shop._id}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 mb-2 ml-2 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                        📤 แชร์ร้าน
                    </a> */}

                    {/* <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://ของอร่อยสูงเนิน.com/shop/${shop._id}`)}`} target="_blank" rel="noreferrer">Facebook</a> */}




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
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {visibleCheckins.map((c) => (
                                    <li key={c._id} className="border p-3 rounded shadow-sm">
                                        <img
                                            src={c.imageUrl}
                                            alt={c.caption}
                                            className="w-full h-32 object-cover rounded mb-2"
                                        />
                                        <p className="text-lg">{c.shopName || "ไม่มีคำบรรยาย"}</p>
                                        <p className="text-sm text-gray-700">{c.caption || "ไม่มีคำบรรยาย"}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            โดย {c.userName} {maskPhone(c.userPhone)} - {new Date(c.createdAt).toLocaleDateString("th-TH")}

                                        </p>
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
        </div>
    )
}

