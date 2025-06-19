// ImageUploader.tsx
"use client"
import { useState, forwardRef, useImperativeHandle } from "react"

type Props = {
  label: string
  onPreview: (url: string) => void
}

export type ImageUploaderHandle = {
  getFile: () => File | null
}

const ImageUploader = forwardRef<ImageUploaderHandle, Props>(({ label, onPreview }, ref) => {
  const [previewUrl, setPreviewUrl] = useState("")
  const [file, setFile] = useState<File | null>(null)

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) {
      // const compressedFile = await compressImage(f, 200 * 1024) // 200KB
      const compressedFile = await compressImage(f, 500 * 1024) // เปลี่ยนจาก 200 KB เป็น 500 KB
      setFile(compressedFile)
      const url = URL.createObjectURL(compressedFile)
      setPreviewUrl(url)

      // ✅ ส่ง path ไปกับ FormData ถ้าใส่ตรงนี้ ไม่เช็ค error form
      // const formData = new FormData()
      // formData.append("file", compressedFile)
      // formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "")
      // if (path) {
      //   formData.append("folder", "menus")
      // }

      // const res = await fetch("https://api.cloudinary.com/v1_1/<your-cloud-name>/image/upload", {
      //   method: "POST",
      //   body: formData,
      // })
      // const data = await res.json()

      onPreview(url)
    }
  }

  const compressImage = (file: File, maxSizeInBytes: number): Promise<File> => {
    return new Promise((resolve) => {
      const img = new Image()
      const reader = new FileReader()

      reader.onload = (e) => {
        img.src = e.target?.result as string
      }

      img.onload = () => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")!
        let quality = 0.9
        let width = img.width
        let height = img.height

        const compressLoop = () => {
          canvas.width = width
          canvas.height = height
          ctx.clearRect(0, 0, width, height)
          ctx.drawImage(img, 0, 0, width, height)

          canvas.toBlob((blob) => {
            if (!blob) return
            // ✅ หากเล็กพอ → resolve
            if (blob.size <= maxSizeInBytes || quality < 0.2) {
              return resolve(new File([blob], file.name, { type: file.type }))
            }

            // 🔁 ลดคุณภาพหรือขนาดต่อ
            quality -= 0.1
            if (quality < 0.2) {
              width *= 0.9
              height *= 0.9
              quality = 0.9
            }

            compressLoop()
          }, file.type, quality)
        }

        compressLoop()
      }

      reader.readAsDataURL(file)
    })
  }


  useImperativeHandle(ref, () => ({
    getFile: () => file,
  }))

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{label || 'อัปโหลดรูปภาพ'}</label>
      <input type="file" accept="image/*" onChange={handleChange} />
      {previewUrl && (
        <img src={previewUrl} className="rounded w-32 h-32 object-cover mt-2" />
      )}
    </div>
  )
})

// ✅ แก้ไขตรงนี้
ImageUploader.displayName = "ImageUploader"

export default ImageUploader

