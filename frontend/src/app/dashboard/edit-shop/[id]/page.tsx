'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import axios from '@/lib/axios'
import ImageUploader, { ImageUploaderHandle } from '@/components/ImageUploader'

export default function EditShop() {
    const { id } = useParams()
    const router = useRouter()

    const [categories, setCategories] = useState<string[]>([])

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        phone: '',
        openTime: '',
        closeTime: '',
    })

    const [loading, setLoading] = useState(false);
    const uploaderRef = useRef<ImageUploaderHandle>(null)

    // delete old image
    const [oldImage, setOldImage] = useState<string>("")

    useEffect(() => {
        axios.get("/shops/categories").then((res) => {
            setCategories(res.data)
        })
    }, [])

    useEffect(() => {
        const fetchShop = async () => {
            try {
                const res = await axios.get(`/shops/${id}`)
                const data = res.data
                setFormData({
                    name: data.name || '',
                    category: data.category || '',
                    phone: data.phone || '',
                    openTime: data.openTime || '',
                    closeTime: data.closeTime || '',
                })
                setOldImage(res.data.image)
                console.log('res.data.image', res.data.image);

                // setImagePreview(data.image || null)
            } catch (err) {
                console.error(err)
            }
        }

        fetchShop()
    }, [id])

    const uploadImageToCloudinary = async (file: File): Promise<string> => {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "")
        formData.append('folder', 'shops')
        const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
            method: "POST",
            body: formData,
        })
        const data = await res.json()
        if (!data.secure_url) throw new Error("Upload failed")
        return data.secure_url
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = e.target.files?.[0]
    //     if (file) {
    //         setImageFile(file)
    //         setImagePreview(URL.createObjectURL(file))
    //     }
    // }

    // ลบรูปร้านเก่า ก่อนอัพโหลดรูปใหม่
    const deleteImageFromCloudinary = async (imageUrl: string) => {
        try {
            await axios.post("/cloudinary/delete", { imageUrl, path: "shops" }) // คุณต้องสร้าง API route นี้ใน backend ด้วย
        } catch (err) {
            console.error("Failed to delete old image:", err)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const file = uploaderRef.current?.getFile()
        // if (!file) return setError("กรุณาเลือกรูปภาพ")

        setLoading(true);

        try {
            // ลบภาพเก่า (ถ้ามี)
            // เกิดปัญหาต้องรอรูปอัพโหลด preview เสร็จก่อนอัพเดท ต้อง disabled ปุ่ม
            if (oldImage) {
                await deleteImageFromCloudinary(oldImage)
            }

            let imageUrl = null;
            if (file) {
                imageUrl = await uploadImageToCloudinary(file)
            }

            await axios.patch(`/shops/${id}`, {
                ...formData,
                image: imageUrl,
            })

            router.push('/dashboard')
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-4 max-w-md mx-auto">
            <h1 className="text-xl font-bold mb-4">แก้ไขร้านค้า</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input name="name" placeholder="ชื่อร้าน" value={formData.name} onChange={handleChange} className="w-full border rounded px-3 py-2" />

                <input
                    list="category-list"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                />
                <datalist id="category-list">
                    {categories.map((cat, idx) => (
                        <option key={idx} value={cat} />
                    ))}
                </datalist>

                <input name="phone" placeholder="เบอร์โทร" value={formData.phone} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                <input name="openTime" type="time" value={formData.openTime} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                <input name="closeTime" type="time" value={formData.closeTime} onChange={handleChange} className="w-full border rounded px-3 py-2" />

                <ImageUploader
                    ref={uploaderRef}
                    label="อัปโหลดรูปภาพเมนู"
                    onPreview={(url) => url} // <- set เพื่อให้ preview ได้
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded">

                    {loading ? "กำลังบันทึก..." : "บันทึก"}
                </button>
            </form>
        </div>
    )
}
