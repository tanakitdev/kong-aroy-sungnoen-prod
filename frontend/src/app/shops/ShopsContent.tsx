"use client"

import { useEffect, useState } from "react"
import axios from "@/lib/axios"
import ShopCard from "@/components/ShopCard"
import ShopStatusFilter from "@/components/ShopStatusFilter"

import { useSearchParams, useRouter } from "next/navigation"
import ShopDetailPageModal from "@/components/ShopDetailPageModal"

interface Shop {
  _id: string
  name: string
  category: string
  location?: string
  image?: string
  openTime?: string
  closeTime?: string
  isOpen?: boolean
}

type Props = {
  shopLists: Shop[];
}

export default function BrowseShopsPage({ shopLists }: Props) {
  const [shops, setShops] = useState<Shop[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [category, setCategory] = useState("")
  const [status, setStatus] = useState("")
  const [categories, setCategories] = useState<string[]>([])

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const searchParams = useSearchParams()
  const router = useRouter()
  const shopId = searchParams.get("shopId")

  const [metaShopLists, setMetaShopLists] = useState<Shop[]>([]);


  // debounce search input
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search)
    }, 500)
    return () => clearTimeout(timeout)
  }, [search])

  // fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/shops/categories")
        setCategories(res.data)
      } catch (err) {
        console.error("Error fetching categories:", err)
      }
    }
    fetchCategories()

    setMetaShopLists(shopLists)
  }, [])

  // reset page to 1 when filter changes
  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, category, status])

  // fetch shops
  useEffect(() => {
    fetchShops()
  }, [debouncedSearch, category, status, page])

  // Infinite Scroll
  useEffect(() => {
    const handleScroll = () => {
      const bottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;

      if (bottom && !isLoading && page < totalPages) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading, page, totalPages]);

  const fetchShops = async () => {
    try {
      setIsLoading(true)
      const res = await axios.get("/shops", {
        params: {
          search: debouncedSearch,
          category,
          status,
          page,
          limit: 6,
        },
      })

      if (page === 1) {
        setShops(res.data.data)
      } else {
        setShops((prev) => [...prev, ...res.data.data])
      }

      setTotalPages(res.data.totalPages)
    } catch (err) {
      console.error("Error fetching shops:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const setFilterDefault = () => {
    setSearch("")
    setCategory("")
    setStatus("")
    setPage(1)
    setDebouncedSearch("")
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <h1 className="text-3xl font-bold text-center text-orange-600"><span className="text-gray-700">ร้านอาหาร: </span>สูงเนิน</h1>
        <p className="text-center text-gray-600">ค้นหาร้านอาหารใกล้คุณ</p>

        {/* สำหรับ SSR */}
        <div className="sr-only">
          <h1>ของอร่อยสูงเนิน</h1>
          {metaShopLists.map((shop) => (
            <article key={shop._id}>
              <h2>{shop.name}</h2>
              <p>{shop.category}</p>
            </article>
          ))}
        </div>

        {/* Search Filter */}
        <div className="flex flex-wrap gap-2 justify-center mt-4">
          <input
            type="text"
            placeholder="ค้นหาร้านอาหาร เมนู หมวดหมู่ ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded w-full md:w-64 shadow-sm"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border bg-white px-3 py-2 rounded w-full md:w-48 shadow-sm"
          >
            <option value="">ทุกหมวดหมู่</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <ShopStatusFilter status={status} setStatus={setStatus} setDefault={setFilterDefault} />
        </div>

        {/* Shop Cards */}
        {isLoading ? (
          <div className="text-center text-gray-500 mt-10">กำลังโหลดร้านค้า...</div>
        ) : (
          <>
            {shops.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {shops.map((shop, index) => (
                  <ShopCard key={index} shop={shop} />
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 mt-10">ไม่พบข้อมูลร้านค้า</div>
            )}
          </>


        )}

        {/* Load More */}
        {/* {!isLoading && page < totalPages && (
          <div className="text-center mt-6">
            <button
              onClick={() => {
                setPage(page + 1)
              }}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
            >
              โหลดเพิ่ม
            </button>
          </div>
        )} */}
      </div>

      {shopId && (
        <ShopDetailPageModal
          shopId={shopId}
          onClose={() => {
            const params = new URLSearchParams(searchParams.toString())
            params.delete("shopId")
            router.push(`/shops?${params.toString()}`, { scroll: false })
            document.body.classList.remove("overflow-y-hidden")
          }}
        />
      )}
    </div>
  )
}
