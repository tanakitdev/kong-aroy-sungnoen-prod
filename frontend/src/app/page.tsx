"use client"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, Plus } from "lucide-react"
import axios from "@/lib/axios"

const promoters = [
  {
    _id: "p001",
    p_name: "ติดต่อลงโฆษณา",
    imageUrl: "/noimgspon.png",
    description: "ติดต่อลงโฆษณา และสนับสนุนเรา",
    linkProfile: "/",
  },
  {
    _id: "p002",
    p_name: "ติดต่อโฆษณา",
    imageUrl: "/noimgspon.png",
    description: "ติดต่อลงโฆษณา และสนับสนุนเรา",
    linkProfile: "/",
  },
]


type Checkin = {
  _id: string;
  shopId: string;
  shopName: string;
  imageUrl: string;
  caption?: string;
  userName: string;
  userPhone: string;
  createdAt: string;
};

export default function Home() {
  const [checkins, setCheckins] = useState<Checkin[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 4

  const loadCheckins = async (pageNumber = 1) => {
    try {
      const res = await axios.get(`/checkins/latest?page=${pageNumber}&limit=${limit}`)
      setCheckins(res.data.data)
      setTotalPages(res.data.totalPages)
      setPage(pageNumber)
    } catch (err) {
      console.error("โหลด checkins ล้มเหลว", err)
    }
  }

  useEffect(() => {
    loadCheckins(1)
  }, [])

  const maskPhone = (phone: string) => {
    if (!phone || phone.length < 9) return "ไม่ระบุเบอร์"
    return `${phone.slice(0, 2)}****${phone.slice(-4)}`
  }

  return (
    <main className="bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <div className="relative w-full overflow-hidden md:h-[50vh]">
        {/* รูปภาพแสดงเฉพาะจอใหญ่ */}
        <Image
          src="/train_logo.jpg"
          alt="ของอร่อยสูงเนิน"
          layout="fill"
          objectFit="cover"
          priority
          className="hidden md:block"
        />

        {/* ฉากมืดทับภาพบนจอใหญ่ */}
        <div className="absolute inset-0 bg-black/50 hidden md:block" />

        {/* กล่องข้อความแสดงผลทุกจอ */}
        <div className="relative z-10 px-4 py-10 md:absolute md:inset-0 md:flex md:items-center md:justify-center md:text-white text-gray-600 text-center bg-orange-50 md:bg-transparent">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2 drop-shadow">
              ของอร่อยสูงเนิน
            </h1>
            <p className="text-sm md:text-xl drop-shadow">
              รวมร้านเด็ดในชุมชนที่คุณไม่ควรพลาด
            </p>
            <div className="flex justify-center md:mt-10 mt-4">
              <Link
                href="/shops"
                className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-400 text-white font-semibold px-6 py-3 rounded-sm shadow"
              >
                <Search size={22} /><span>ค้นหาของอร่อย</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Check-ins + Promoters Section */}
      <section className="max-w-6xl mx-auto px-4 md:py-10 py-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left: Check-ins */}
          <div className="md:w-2/3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-600">เช็คอินล่าสุด</h2>
              <Link
                href="/checkin"
                className="bg-blue-500 text-white px-2 py-1 rounded shadow hover:bg-blue-600"
              >
                <div className="flex">
                  <Plus /><span>โพสต์</span>
                </div>
              </Link>
            </div>
            <div className="space-y-2">
              {checkins.map(item => (
                <Link
                  key={item._id}
                  href={`/shop/${item.shopId}`}
                  className="block bg-white rounded-sm shadow-sm overflow-hidden hover:shadow transition-shadow"
                >
                  <div className="flex h-28">
                    <div className="w-28 h-full flex-shrink-0">
                      <Image
                        src={item.imageUrl}
                        alt={item.shopName}
                        width={112}
                        height={112}
                        className="w-full h-full object-cover p-2"
                      />
                    </div>
                    <div className="flex-1 p-3 flex flex-col justify-between">
                      <div>
                        <h3 className="text-base font-bold mb-1">{item.shopName}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{item.caption || "ไม่มีข้อความ"}</p>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        โดย {item.userName} {maskPhone(item.userPhone) || "ไม่ระบุเบอร์"} - {new Date(item.createdAt).toLocaleDateString("th-TH")}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex justify-center gap-2 flex-wrap">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => loadCheckins(p)}
                  className={`px-3 py-1 border rounded ${p === page ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Promoters */}
          <div className="md:w-1/3">
            <h2 className="text-xl font-semibold mb-4 text-gray-600">ได้รับการสนับสนุน</h2>
            <div className="space-y-2">
              {promoters.map(promoter => (
                <Link
                  href={promoter.linkProfile}
                  target={promoter.linkProfile !== '/' ? "_blank" : "_parent"}
                  key={promoter._id}
                  className="bg-white border border-gray-100 shadow-sm rounded-md overflow-hidden flex items-center p-2 gap-3"
                >
                  <Image
                    src={promoter.imageUrl}
                    alt={promoter.p_name}
                    width={48}
                    height={48}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-800">{promoter.p_name}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2">{promoter.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
