"use client";

import { useState, useEffect, useRef } from "react";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";

import ImageUploader, { ImageUploaderHandle } from "@/components/ImageUploader"

import GoogleMapSelector from "@/components/GoogleMapSelector"

export default function AddShopPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    location: "",
    openTime: "",
    closeTime: "",
    phone: "",
  });

  // const [imageFile, setImageFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);


  // const [imagePreview, setImagePreview] = useState<string | null>(null)
  // const [image, setImage] = useState("")
  const uploaderRef = useRef<ImageUploaderHandle>(null)

  const [latlng, setLatlng] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    axios.get("/shops/categories").then((res) => {
      setCategories(res.data);
    });
  }, []);

  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "")
    formData.append("folder", "shops")
    const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData,
    })
    const data = await res.json()
    if (!data.secure_url) throw new Error("Upload failed")
    return data.secure_url
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const ownerId = localStorage.getItem("userId");
    if (!ownerId) {
      alert("ยังไม่ได้ login หรือหา ownerId ไม่เจอ");
      return;
    }
    const file = uploaderRef.current?.getFile()
    // if (!file) return setError("กรุณาเลือกรูปภาพ")

    setLoading(true);

    try {

      let imageUrl = null;
      if (file) {
        imageUrl = await uploadImageToCloudinary(file)
      }

      await axios.post("/shops", {
        ...formData,
        ownerId,
        image: imageUrl, // placeholder
        location: latlng ? `${latlng.lat},${latlng.lng}` : "",
      });

      router.push("/dashboard");
    } catch (err) {
      console.error("Error creating shop:", err);
      alert("เกิดข้อผิดพลาดในการเพิ่มร้าน");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4">
      <h1 className="text-xl font-bold mb-4">เพิ่มร้านอาหาร</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          ชื่อร้าน
          <input
            name="name"
            className="w-full p-2 border"
            onChange={handleChange}
            required
          />
        </label>

        <label className="block">
          หมวดหมู่
          <input
            list="category-list"
            name="category"
            onChange={handleChange}
            className="w-full p-2 border"
          />
          <datalist id="category-list">
            {categories.map((cat, idx) => (
              <option key={idx} value={cat} />
            ))}
          </datalist>
        </label>

        <ImageUploader
          ref={uploaderRef}
          label="อัปโหลดรูปภาพเมนู"
          onPreview={(url) => url} // <- set เพื่อให้ preview ได้
        />

        <p className="font-medium">ลิงก์แผนที่ / Location</p>
        <GoogleMapSelector onSelect={(lat, lng) => setLatlng({ lat, lng })} />
        {latlng && (
          <p className="text-sm text-gray-500">
            พิกัด: {latlng.lat.toFixed(6)}, {latlng.lng.toFixed(6)}
          </p>
        )}


        <label className="block">
          เวลาเปิด
          <input
            type="time"
            name="openTime"
            className="w-full p-2 border"
            onChange={handleChange}
            required
          />
        </label>

        <label className="block">
          เวลาปิด
          <input
            type="time"
            name="closeTime"
            className="w-full p-2 border"
            onChange={handleChange}
            required
          />
        </label>

        <label className="block">
          เบอร์โทรร้าน
          <input
            type="tel"
            name="phone"
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mt-1"
            placeholder="เช่น 0812345678"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {loading ? "กำลังเพิ่มร้าน..." : "เพิ่มร้าน"}
        </button>

        <button
          type="button"
          disabled={loading}
          className="bg-gray-600 text-white mx-2 py-2 px-4 rounded hover:bg-gray-700"
          onClick={() => router.back()}
        >
          ย้อนกลับ
        </button>

      </form>
    </div>
  );
}
