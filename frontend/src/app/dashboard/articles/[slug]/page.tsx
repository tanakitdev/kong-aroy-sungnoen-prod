// app/dashboard/articles/[slug]/page.tsx
import type { Metadata, ResolvingMetadata } from 'next'
import ArticleDetailClient from './ArticleDetailClient'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params

  const API = process.env.NEXT_PUBLIC_API_BASE_URL
  const SITE = process.env.NEXT_PUBLIC_SITE_URL

  try {
    const res = await fetch(`${API}/api/articles/${slug}`, { cache: 'no-store' })

    if (!res.ok) throw new Error(`HTTP error ${res.status}`)

    const article = await res.json()

    const imageUrl = article.coverImageUrl?.startsWith('http')
      ? article.coverImageUrl
      : `${SITE}${article.coverImageUrl}`

    const previousImages = (await parent).openGraph?.images || []

    return {
      title: article.title,
      description: article.content?.slice(0, 100) || '',
      openGraph: {
        title: article.title,
        description: article.content?.slice(0, 100) || '',
        url: `${SITE}/dashboard/articles/${slug}`,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
          },
          ...previousImages,
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: article.title,
        description: article.content?.slice(0, 100) || '',
        images: [imageUrl],
      },
    }
  } catch (e) {
    console.error('generateMetadata error', e)
    return {
      title: 'บทความ - ของอร่อยสูงเนิน',
      description: 'รวมบทความจากร้านเด็ดในชุมชน',
    }
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  const API = process.env.NEXT_PUBLIC_API_BASE_URL

  try {
    const res = await fetch(`${API}/api/articles/${slug}`, { cache: 'no-store' })

    if (!res.ok) throw new Error(`HTTP error ${res.status}`)

    const article = await res.json()

    return <ArticleDetailClient article={article} />
  } catch (e) {
    console.error('load article error', e)
    return <p className="p-4 text-center text-gray-500">ไม่พบบทความที่คุณต้องการ</p>
  }
}
