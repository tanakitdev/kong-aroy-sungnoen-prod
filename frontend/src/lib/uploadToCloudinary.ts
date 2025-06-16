// lib/uploadToCloudinary.ts
export const uploadToCloudinary = async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!)

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
    })

    const data = await res.json()
    return data.secure_url // URL รูปที่อัปโหลดแล้ว
}