import { Metadata, ResolvingMetadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"

type Props = {
    params: Promise<{ id: string }>
}


// ดึงข้อมูลจาก backend API ของคุณ
async function getCheckin(id: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/checkins/${id}`, {
        next: { revalidate: 60 },
    })

    if (!res.ok) return null
    return res.json()
}

// สร้าง Metadata สำหรับ Social Sharing
export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { id } = await params

    const checkin = await getCheckin(id)
    if (!checkin) return {}

    const caption = checkin.caption || "ลูกค้าประจำเช็คอินร้านนี้!"
    const image = checkin.imageUrl || "/og-default.jpg"
    const shopName = checkin.shopId?.name || "ร้านเด็ดในสูงเนิน"

    // optionally access and extend (rather than replace) parent metadata
    const previousImages = (await parent).openGraph?.images || []

    return {
        title: `เช็คอินที่ ${shopName}`,
        description: caption,
        openGraph: {
            title: `เช็คอินที่ ${shopName}`,
            description: caption,
            images: [
                {
                    url: image,
                    width: 1200,
                    height: 630,
                    alt: shopName,
                },
                ...previousImages
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: `เช็คอินที่ ${shopName}`,
            description: caption,
            images: [image],
        },
    }
}

export default async function CheckinDetailPage({ params }: Props) {
    const { id } = await params;
    const checkin = await getCheckin(id);
    if (!checkin) return notFound();

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-xl text-center">
                <h1 className="text-2xl font-bold mb-2">{checkin.shopName}</h1>
                <p className="text-gray-600 mb-4">{checkin.caption}</p>
                {checkin.imageUrl && (
                    <Image
                        src={checkin.imageUrl}
                        alt={checkin.caption || "checkin"}
                        width={800}
                        height={450}
                        priority
                        className="rounded-lg shadow object-contain"
                    />
                )}
            </div>
        </main>
    );
}