"use client"

import { useState, useRef } from "react"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import axios from "@/lib/axios"
import ImageUploader, { ImageUploaderHandle } from "@/components/ImageUploader"

export default function AddMenuPage() {
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [error, setError] = useState("")
  const uploaderRef = useRef<ImageUploaderHandle>(null)

  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const params = useParams()
  const shopId = params.shopId as string
  const searchForm = useSearchParams();
  const from = searchForm.get("from");

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

  const handleSubmit = async () => {
    setError("")
    if (!name.trim()) return setError("กรุณาใส่ชื่อเมนู")
    if (!price || isNaN(Number(price))) return setError("กรุณาใส่ราคาที่เป็นตัวเลข")

    const file = uploaderRef.current?.getFile()
    // if (!file) return setError("กรุณาเลือกรูปภาพ")

    try {
      setLoading(true)
      // let imageUrl = null;
      // if (file) {
      const imageUrl = await uploadImageToCloudinary(file!);
      // }

      await axios.post("/menus", {
        name: name.trim(),
        price: Number(price),
        image: imageUrl,
        shop: shopId,
      })

      if (from === "manage-menu" && shopId) {
        router.push(`/dashboard/manage-menu/${shopId}`)
      } else {
        router.push("/dashboard")
      }
    } catch (err) {
      console.log(err);
      // alert(err.response?.data?.message || "เพิ่มเมนูไม่สำเร็จ")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold">เพิ่มเมนูในร้าน</h1>
      {error && <p className="text-red-600">{error}</p>}

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">ชื่อเมนู</label>
        <input
          type="text"
          className="border p-2 w-full rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">ราคา (บาท)</label>
        <input
          type="number"
          className="border p-2 w-full rounded"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>

      <ImageUploader
        ref={uploaderRef}
        label="อัปโหลดรูปภาพเมนู"
        onPreview={(url) => console.log("preview:", url)}
      />

      <button
        disabled={loading}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        onClick={handleSubmit}
      >
        {loading ? 'กำลังบันทึกข้อมูล...' : 'เพิ่มเมนู'}

      </button>
    </div>
  )
}
