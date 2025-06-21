'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Edit } from 'lucide-react'

interface Article {
    _id: string
    title: string
    slug: string
    coverImageUrl: string
    publishedAt: string
}

export default function ArticlesPage() {
    const [articles, setArticles] = useState<Article[]>([])

    useEffect(() => {
        const fetchArticles = async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/articles`)
            const data = await res.json()
            setArticles(data)
        }

        fetchArticles()
    }, [])

    return (
        <main className="p-4 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">บทความร้านเด็ด</h1>

            <div className="space-y-6">
                {articles.map((article) => (
                    <Link key={article._id} href={`/dashboard/articles/${article.slug}`}>
                        <div className="border p-4 rounded hover:bg-gray-50 transition cursor-pointer">
                            <Image
                                src={article.coverImageUrl}
                                width={800}
                                height={450}
                                alt={article.title}
                                priority
                                className="rounded mb-2 object-cover w-full h-[200px]"
                            />
                            <h2 className="text-lg font-semibold">{article.title}</h2>
                            <p className="text-sm text-gray-500">{new Date(article.publishedAt).toLocaleDateString()}</p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Floating Action Button */}
            <Link
                href="/dashboard/articles/new"
                className="fixed bottom-6 right-6 bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-lg transition"
                title="เช็คอินร้านใหม่"
            >
                <div className="flex flex-col items-center">
                    <Edit size={28} />
                    <span className="text-[10px]">เพิ่มโพสต์</span>
                </div>

            </Link>
        </main>
    )
}
