"use client"

import { ChevronLeft } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

type Article = {
    _id: string
    title: string
    slug: string
    content: string
    coverImageUrl: string
    publishedAt: string
}

export default function ArticleDetailClient({ article }: { article: Article }) {
    const router = useRouter();

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <main className="max-w-3xl mx-auto p-4">

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

            <h1 className="text-3xl font-bold text-gray-800 mb-4">{article.title}</h1>

            <p className="text-sm text-gray-500 mb-4">
                เผยแพร่เมื่อ {new Date(article.publishedAt).toLocaleDateString("th-TH")}
            </p>

            {article.coverImageUrl && (
                <Image
                    src={article.coverImageUrl}
                    alt={article.title}
                    width={960}
                    height={540}
                    priority
                    className="w-full h-auto rounded-md mb-6 object-cover"
                />
            )}

            <article className="prose prose-lg max-w-none text-gray-800">
                {/* ใช้ dangerouslySetInnerHTML หาก content เป็น HTML ที่ผ่านการ sanitize แล้ว */}
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
            </article>
        </main>
    )
}
