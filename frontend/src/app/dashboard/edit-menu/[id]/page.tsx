"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import axios from "@/lib/axios"
import ImageUploader, { ImageUploaderHandle } from "@/components/ImageUploader"

export default function EditMenuPage() {
  const router = useRouter()
  const { id } = useParams()
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const shopId = searchParams.get("shopId");

  const [name, setName] = useState("")
  const [price, setPrice] = useState("")

  const [error, setError] = useState("")

  // upload image
  const [loading, setLoading] = useState(false);
  const uploaderRef = useRef<ImageUploaderHandle>(null)

  // delete old image
  const [oldImage, setOldImage] = useState<string>("")


  useEffect(() => {
    if (id) {
      axios.get(`/menus/${id}`).then((res) => {
        setName(res.data.name)
        setPrice(res.data.price)
        setOldImage(res.data.image || "") // ✅ เก็บภาพเก่าไว้
      })
    }
  }, [id])

  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "")
    formData.append("folder", "menus")
    const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData,
    })
    const data = await res.json()
    if (!data.secure_url) throw new Error("Upload failed")
    return data.secure_url
  }

  // ลบรูปเมนูเก่า ก่อนอัพโหลดรูปใหม่
  const deleteImageFromCloudinary = async (imageUrl: string) => {
    try {
      await axios.post("/cloudinary/delete", { imageUrl, path: "menus" }) // คุณต้องสร้าง API route นี้ใน backend ด้วย
    } catch (err) {
      console.error("Failed to delete old image:", err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) return setError("กรุณาใส่ชื่อเมนู")
    if (!price || isNaN(Number(price))) return setError("กรุณาระบุราคาให้ถูกต้อง")

    // upload image
    const file = uploaderRef.current?.getFile()
    if (!file) return setError("กรุณาเลือกรูปภาพ")

    setLoading(true);
    try {
      // ลบภาพเก่า (ถ้ามี)
      if (oldImage) {
        await deleteImageFromCloudinary(oldImage)
      }

      const imageUrl = await uploadImageToCloudinary(file)

      await axios.patch(`/menus/${id}`, {
        name: name.trim(),
        price: Number(price),
        image: imageUrl,
      })

      if (from === "manage-menu" && shopId) {
        router.push(`/dashboard/manage-menu/${shopId}`)
      } else {
        router.push("/dashboard")
      }
    } catch (err) {
      console.error("Error updating menu:", err)
      setError("เกิดข้อผิดพลาดในการบันทึก")
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">แก้ไขเมนู</h1>
      {error && <p className="text-red-600 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">ชื่อเมนู</label>
          <input
            className="border rounded px-3 py-2 w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="เช่น ก๋วยเตี๋ยวต้มยำ"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">ราคา (บาท)</label>
          <input
            className="border rounded px-3 py-2 w-full"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="เช่น 50"
          />
        </div>

        <div>
          <ImageUploader
            ref={uploaderRef}
            label="อัปโหลดรูปภาพเมนู"
            onPreview={(url) => url} // ทำให้รูปปรากฏ
          />
        </div>

        <button
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {loading ? 'กำลังบันทึกการแก้ไข...' : 'บันทึกการแก้ไข'}
        </button>
      </form>
    </div>
  )
}
