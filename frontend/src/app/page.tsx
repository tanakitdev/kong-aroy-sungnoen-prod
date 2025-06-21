"use client"
import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import axios from "@/lib/axios"

const promoters = [
  {
    _id: "n001",
    p_name: "NINJA GO",
    imageUrl: "https://res.cloudinary.com/dcqddx8ox/image/upload/v1750135454/LOGO_cuuosf.png",
    description: "Ninja Go คือบริการเดลิเวอรี่อาหารในชุมชนของคุณ รับออเดอร์จากร้านดังในพื้นที่ กดติดตามเพจนี้ไว้ 📲 แล้วคุณจะไม่พลาดร้านเด็ด และโปรโมชันจาก Ninja Go!",
    linkProfile: "https://www.facebook.com/profile.php?id=61577253848573",
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

type Article = {
  _id: string
  title: string
  slug: string
  coverImageUrl: string
  publishedAt: string
}

type Shop = {
  _id: string
  image: string
  name: string
  category: string
  popularityScore: string
}

export default function Home() {
  const [checkins, setCheckins] = useState<Checkin[]>([])
  // const [page, setPage] = useState(1)
  // const [totalPages, setTotalPages] = useState(1)
  const limit = 30

  const [articles, setArticles] = useState<Article[]>([])

  const [topShops, setTopShops] = useState<Shop[]>([])

  const [showLeftButton, setShowLeftButton] = useState(false)
  const [showRightButton, setShowRightButton] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' })
  }

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' })
  }

  const checkScrollButtons = () => {
    const container = scrollRef.current
    if (!container) return

    const { scrollLeft, scrollWidth, clientWidth } = container

    setShowLeftButton(scrollLeft > 0)
    setShowRightButton(scrollLeft + clientWidth < scrollWidth - 5) // -5 เผื่อ margin
  }

  useEffect(() => {
    checkScrollButtons()
  }, [checkins])

  useEffect(() => {
    // loadCheckins(1)
    loadCheckins()
    loadArticles()
    loadTopShops()

    const el = scrollRef.current
    if (!el) return

    el.addEventListener("scroll", checkScrollButtons)
    return () => el.removeEventListener("scroll", checkScrollButtons)
  }, [])


  const loadCheckins = async () => {
    try {
      // const res = await axios.get(`/checkins/latest?page=${pageNumber}&limit=${limit}`)
      const res = await axios.get(`/checkins/latest?limit=${limit}`)
      setCheckins(res.data.data)
      // setTotalPages(res.data.totalPages)
      // setPage(pageNumber)
    } catch (err) {
      console.error("โหลด checkins ล้มเหลว", err)
    }
  }

  const loadArticles = async () => {
    try {
      const res = await axios.get("/articles?limit=6")
      setArticles(res.data)
    } catch (err) {
      console.error("โหลดบทความล้มเหลว", err)
    }
  }

  const loadTopShops = async () => {
    try {
      const res = await axios.get("/shops/top", {
        params: {
          limit: 5
        }
      })
      setTopShops(res.data)
    } catch (err) {
      console.error("โหลดร้านยอดนิยมล้มเหลว", err)
    }
  }

  // useEffect(() => {
  //   // loadCheckins(1)
  //   loadCheckins()
  //   loadArticles()
  // }, [])

  // const maskPhone = (phone: string) => {
  //   if (!phone || phone.length < 9) return "ไม่ระบุเบอร์"
  //   return `******${phone.slice(-4)}`
  // }

  return (
    <main className="bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <div className="relative w-full h-60 md:h-70 overflow-hidden">
        <Image
          src="/train_logo.jpg"
          alt="ของอร่อยสูงเนิน"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 px-4 py-10 md:absolute md:inset-0 md:flex md:items-center md:justify-center text-white text-center md:bg-transparent">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              ของอร่อยสูงเนิน
            </h1>
            <p className="text-sm md:text-xl">รวมร้านเด็ดในชุมชนที่คุณไม่ควรพลาด</p>
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
      <section className="max-w-6xl mx-auto px-4 mt-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left: Check-ins */}
          <div className="md:w-2/3">

            {/* เช็คอินล่าสุด */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">เช็คอินล่าสุด</h2>
            </div>

            <div className="relative">
              {/* ปุ่มเลื่อนซ้าย */}
              {showLeftButton && (
                <button
                  onClick={scrollLeft}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-700 text-white shadow rounded-full p-1"
                >
                  <ChevronLeft size={28} />
                </button>
              )}

              {/* รายการเช็คอินแนวนอน */}
              <div
                ref={scrollRef}
                className="overflow-x-auto flex gap-2 pb-2 scroll-smooth px-6 hide-scrollbar py-2"
              >
                {checkins.map(item => (
                  <Link
                    key={item._id}
                    href={`/shop/${item.shopId}`}
                    className="flex-shrink-0 w-44 rounded-md overflow-hidden shadow bg-white hover:shadow-md transition"
                  >
                    {/* <div className="w-44 h-44 relative">
                      <Image
                        src={item.imageUrl}
                        alt={item.shopName}
                        fill
                        className="object-cover"
                      />
                    </div> */}

                    <div className="relative w-44 h-44">
                      <Image
                        src={item.imageUrl}
                        alt={item.shopName}
                        fill
                        className="object-cover duration-300 hover:scale-[1.06]"
                        priority
                        sizes="300px"
                      />
                    </div>

                    {/* Dark Mode */}
                    {/* <div className="p-2 bg-gray-900">
                      <h3 className="text-sm font-semibold text-gray-200 truncate">{item.shopName}</h3>
                      <p className="text-xs text-gray-300 truncate">{item.caption || 'ไม่มีข้อความ'}</p>
                      <p className="text-xs text-gray-300 truncate">{item.userName} {maskPhone(item.userPhone) || "ไม่มีข้อความ"}</p>
                    </div> */}

                    <div className="p-2">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">{item.shopName}</h3>
                      <p className="text-xs text-gray-800 truncate">{item.caption || 'ไม่มีข้อความ'}</p>
                      {/* <p className="text-xs text-gray-800 truncate">{item.userName} {maskPhone(item.userPhone) || "ไม่มีข้อความ"}</p> */}
                    </div>
                  </Link>
                ))}
              </div>

              {/* ปุ่มเลื่อนขวา */}
              {showRightButton && (
                <button
                  onClick={scrollRight}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-700 text-white shadow rounded-full p-1"
                >
                  <ChevronRight size={28} />
                </button>
              )}
            </div>

            {/* ✅ บทความล่าสุด */}
            <div >
              <h2 className="text-2xl font-semibold text-gray-700 mt-10 mb-6">📚 บทความล่าสุด</h2>
              <div className="grid md:grid-cols-3 gap-6">

                {articles.map((article) => (
                  <Link
                    key={article._id}
                    href={`/dashboard/articles/${article.slug}`}
                    className="bg-white border rounded shadow-sm hover:shadow-md transition overflow-hidden"
                  >
                    <Image
                      src={article.coverImageUrl}
                      alt={article.title}
                      width={600}
                      height={300}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-3">
                      <h3 className="font-semibold text-gray-800 line-clamp-2">{article.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        เผยแพร่ {new Date(article.publishedAt).toLocaleDateString('th-TH')}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="text-right mt-4">
                <Link href="/dashboard/articles" className="text-blue-600 text-sm hover:underline">
                  ดูบทความทั้งหมด →
                </Link>
              </div>
            </div>
          </div>

          {/* Right: Promoters */}
          <div className="md:w-1/3">

            {/* 🔥 ร้านยอดนิยม */}
            <h2 className="text-xl font-semibold mb-4 text-gray-700 mt-4 md:mt-1">ร้านยอดนิยม</h2>
            <div className="space-y-1 mb-8">

              {topShops.map((shop, index) => (
                <Link
                  key={shop._id}
                  href={`/shop/${shop._id}`}
                  className="bg-white border border-gray-100 shadow-sm rounded-md overflow-hidden flex items-center p-2 gap-3 hover:shadow-md transition"
                >
                  <div className="relative">
                    <Image
                      src={shop.image}
                      alt={shop.name}
                      width={48}
                      height={48}
                      className="w-14 h-14 object-cover rounded"
                    />
                    {/* {index + 1 <= 3 && (
                      <span className="absolute -top-2 -left-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {index + 1}
                      </span>
                    )} */}

                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-800 line-clamp-1">{shop.name}</h3>
                    <p className="text-xs text-gray-700 line-clamp-1">{shop.category}</p>
                    <p className="text-xs text-gray-500 text-end">{shop.popularityScore} Point</p>
                  </div>
                </Link>
              ))}
            </div>

            <h2 className="text-xl font-semibold mb-4 text-gray-700">ได้รับการสนับสนุน</h2>
            <div className="space-y-3 mb-8">
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
                    className="w-14 h-14 object-cover rounded"
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
