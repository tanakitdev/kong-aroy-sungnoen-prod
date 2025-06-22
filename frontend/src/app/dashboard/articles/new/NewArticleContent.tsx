'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import ImageUploader, { ImageUploaderHandle } from '@/components/ImageUploader'
import axios from '@/lib/axios'

export default function NewArticleContentPage() {
    const router = useRouter()
    const uploaderRef = useRef<ImageUploaderHandle>(null)

    const [form, setForm] = useState({
        title: '',
        slug: '',
        coverImageUrl: '',
        content: '',
        tags: '',
    })

    const slugTimerRef = useRef<NodeJS.Timeout | null>(null)

    const [loading, setLoading] = useState(false)

    const handlePreview = (url: string) => {
        setForm((prev) => ({ ...prev, coverImageUrl: url }))
    }

    // const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    //     setForm({ ...form, [e.target.name]: e.target.value })
    // }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target

        if (name === 'title') {
            const rawSlug = value
                .toLowerCase()
                .trim()
                .replace(/[^\w\u0E00-\u0E7F\s-]/g, '')
                .replace(/\s+/g, '-')

            setForm((prev) => ({ ...prev, title: value }))

            // ✅ ถ้า slug ว่างไม่ต้องเช็ค
            if (rawSlug === '') {
                setForm((prev) => ({ ...prev, slug: '' }))
                return
            }

            if (slugTimerRef.current) {
                clearTimeout(slugTimerRef.current)
            }

            slugTimerRef.current = setTimeout(async () => {
                const uniqueSlug = await generateUniqueSlug(rawSlug)
                setForm((prev) => ({ ...prev, slug: uniqueSlug }))
            }, 500)
        } else {
            setForm((prev) => ({
                ...prev,
                [name]: value,
            }))
        }
    }


    const generateUniqueSlug = async (baseSlug: string): Promise<string> => {
        let slug = baseSlug
        let counter = 1

        while (true) {
            try {
                const res = await axios.get(`/articles/check-slug?slug=${slug}`)
                if (!res.data.exists) {
                    return slug // ใช้ slug นี้ได้
                }
                slug = `${baseSlug}-${counter++}`
            } catch (err) {
                console.error('Error checking slug', err)
                return baseSlug // fallback ถ้าเช็คไม่ได้
            }
        }
    }



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // 📤 อัปโหลดไป Cloudinary จาก compressed file
        const file = uploaderRef.current?.getFile()
        let uploadedUrl = ''

        if (file) {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!)

            const res = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            )

            const data = await res.json()

            if (data.secure_url) {
                uploadedUrl = data.secure_url.replace('/upload/', '/upload/q_auto:eco,f_auto/')
            }
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/articles`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...form,
                coverImageUrl: uploadedUrl || form.coverImageUrl,
                tags: form.tags.split(',').map((tag) => tag.trim()),
                publishedAt: new Date().toISOString(),
            }),
        })

        const data = await res.json()

        if (res.ok) {
            alert('เพิ่มบทความสำเร็จ')
            router.push(`/dashboard/articles/${data.slug}`)
        } else {
            alert('เกิดข้อผิดพลาด: ' + data.message)
        }

        setLoading(false)
    }

    return (
        <main className="max-w-3xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">เพิ่มบทความใหม่</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium">หัวข้อ</label>
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                        required
                    />
                </div>

                <div>
                    <label className="block font-medium">Slug (URL)</label>
                    <input
                        type="text"
                        name="slug"
                        value={form.slug}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                        required
                        placeholder="จะสร้างอัตโนมัติจากหัวข้อ (สามารถแก้ไขได้)"
                    />
                </div>

                <ImageUploader ref={uploaderRef} label="อัปโหลดรูปหน้าปก" onPreview={handlePreview} />

                <div>
                    <label className="block font-medium">แท็ก (คั่นด้วย ,)</label>
                    <input
                        type="text"
                        name="tags"
                        value={form.tags}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                    />
                </div>

                <div>
                    <label className="block font-medium">เนื้อหา</label>
                    <textarea
                        name="content"
                        rows={10}
                        value={form.content}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    {loading ? 'กำลังบันทึก...' : 'บันทึกบทความ'}
                </button>
            </form>
        </main>
    )
}
