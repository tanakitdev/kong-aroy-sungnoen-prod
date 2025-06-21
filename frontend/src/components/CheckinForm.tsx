"use client"

import { useState, useEffect, Fragment } from "react"
import axios from "@/lib/axios"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { Combobox, Transition } from "@headlessui/react"
import { Check, ChevronDown, Edit, MoveLeft } from "lucide-react"

interface Shop {
    _id: string
    name: string
    category: string
}

export default function CheckinForm() {
    const [allShops, setAllShops] = useState<Shop[]>([])
    const [selectedShop, setSelectedShop] = useState<Shop | null>(null)
    const [query, setQuery] = useState("")
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imageUrl, setImageUrl] = useState("")
    const [caption, setCaption] = useState("")
    const [uploading, setUploading] = useState(false)

    const router = useRouter()
    const searchParams = useSearchParams()
    const shopIdFromUrl = searchParams.get("shopId")

    useEffect(() => {
        fetchShops();
    }, [])

    useEffect(() => {
        const fetchSelectedShop = async () => {
            if (!shopIdFromUrl) return

            try {
                const res = await axios.get(`/shops/${shopIdFromUrl}`)
                if (res.data) {
                    setSelectedShop(res.data)
                }
            } catch (err) {
                console.error("ไม่พบร้านจาก shopId", err)
            }
        }

        fetchSelectedShop()
    }, [shopIdFromUrl])

    const fetchShops = async () => {
        try {
            const res = await axios.get("/shops/search", {
                params: { q: query }
            });
            setAllShops(res.data.data || []);
        } catch (err) {
            console.error("load shop error", err);
        }
    };

    // useEffect(() => {
    //     if (query.length >= 1) {
    //         fetchShops();
    //     } else {
    //         setAllShops([]);
    //     }
    // }, [query]);

    // ตั้ง delay
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchShops();
        }, 500); // ← ดีเลย์ 500 มิลลิวินาที

        return () => clearTimeout(delayDebounce); // ล้าง timeout ถ้าผู้ใช้ยังพิมพ์อยู่
    }, [query]);

    const filteredShops =
        query === ""
            ? allShops
            : allShops.filter((shop) =>
                shop.name.toLowerCase().includes(query.toLowerCase())
            )

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImageFile(file)
            setImageUrl(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedShop || !imageFile) {
            alert("กรุณาเลือกร้านและรูปภาพ")
            return
        }

        setUploading(true)
        try {
            // ตรวจสอบการเช็คอินซ้ำ
            const validate = await axios.post("/checkins/validate", {
                shopId: selectedShop._id,
            })

            if (validate.data.alreadyCheckedIn) {
                alert("คุณเช็คอินร้านนี้แล้วในวันนี้")
                setUploading(false)
                return
            }

            // อัปโหลดรูป
            const formData = new FormData()
            formData.append("file", imageFile)
            formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!)
            formData.append("folder", "checkins")
            const resUpload = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            )
            const data = await resUpload.json()
            const finalImageUrl = data.secure_url

            // บันทึก check-in
            await axios.post("/checkins", {
                shopId: selectedShop._id,
                imageUrl: finalImageUrl,
                caption,
            })

            alert("✅ เช็คอินสำเร็จแล้ว")
            router.push("/profile")
        } catch (err) {
            console.log(err);

        } finally {
            setUploading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-xl mx-auto">
            {/* Combobox เลือกร้าน */}
            <div>

                {selectedShop?._id ? (
                    <div className="flex items-center">
                        <label className="font-semibold pr-1">เลือกร้าน</label>
                        <div className="flex items-center text-green-600">
                            <Check /><span>ข้อมูลถูกต้อง</span>
                        </div>
                    </div>
                ) : (
                    <label className="font-semibold">เลือกร้าน</label>
                )}

                <Combobox value={selectedShop} onChange={setSelectedShop}>
                    <div className="relative">
                        <div className="relative w-full cursor-default overflow-hidden rounded border bg-white text-left">
                            <Combobox.Input
                                className="w-full border-none p-2 focus:outline-none"
                                displayValue={(shop: Shop) => shop?.name || ""}
                                onChange={(e) => {
                                    setQuery(e.target.value)
                                    setSelectedShop(null)
                                }}
                                placeholder="พิมพ์ชื่อร้าน..."
                            />
                            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                                <ChevronDown className="h-4 w-4 text-gray-400" />
                            </Combobox.Button>
                        </div>
                        <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                            afterLeave={() => setQuery("")}
                        >
                            <Combobox.Options className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded bg-white py-1 shadow ring-1 ring-black/5">
                                {filteredShops.length === 0 && query !== "" ? (
                                    <div className="px-4 py-2 text-gray-500">ไม่พบร้าน</div>
                                ) : (
                                    filteredShops.map((shop) => (
                                        <Combobox.Option
                                            key={shop._id}
                                            className={({ active }) =>
                                                `relative cursor-pointer select-none px-4 py-2 ${active ? "bg-orange-100" : "text-gray-900"
                                                }`
                                            }
                                            value={shop}
                                        >
                                            {({ selected }) => (
                                                <>
                                                    <span className={`${selected ? "font-medium" : "font-normal"}`}>
                                                        {shop.name}
                                                    </span>
                                                    <span className="text-sm text-gray-500 ml-2">({shop.category})</span>
                                                    {selected ? (
                                                        <span className="absolute inset-y-0 right-4 flex items-center text-orange-500">
                                                            <Check className="h-4 w-4" />
                                                        </span>
                                                    ) : null}
                                                </>
                                            )}
                                        </Combobox.Option>
                                    ))
                                )}
                            </Combobox.Options>
                        </Transition>
                    </div>
                </Combobox>
            </div>

            {/* รูปภาพ */}
            <div>
                <label className="font-semibold">รูปภาพ</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="border w-full p-2 rounded"
                />
                {uploading && <p className="text-sm text-gray-500 mt-1">📤 กำลังอัปโหลด...</p>}
                {imageUrl && (
                    <div className="mt-2">
                        <Image
                            src={imageUrl}
                            alt="preview"
                            width={300}
                            height={200}
                            className="rounded w-full"
                        />
                    </div>
                )}
            </div>

            {/* ข้อความ */}
            <div>
                <label className="font-semibold">ข้อความ (ไม่บังคับ)</label>
                <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="border w-full p-2 rounded"
                    rows={3}
                />
            </div>

            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                disabled={uploading}
            >
                {uploading ? 'กำลังโพสต์...' : <>
                    <div className="flex items-center">
                        <Edit /> <span className="pl-1">โพสต์</span>
                    </div>
                </>}

            </button>
            <button
                type="button"
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 ml-2"
                disabled={uploading}
                onClick={() => router.back()}
            >
                <div className="flex items-center">
                    <MoveLeft /> <span>ย้อนกลับ</span>
                </div>

            </button>


        </form>


    )
}
