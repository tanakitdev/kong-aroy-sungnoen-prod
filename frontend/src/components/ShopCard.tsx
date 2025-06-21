import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"

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

export default function ShopCard({ shop }: { shop: Shop }) {
  const router = useRouter()
  const searchParams = useSearchParams()


  const handleClick = () => {
    // setIsOpen(false); // ปิด modal ก่อน
    const params = new URLSearchParams(searchParams.toString())
    params.set("shopId", shop._id)
    router.push(`/shops?${params.toString()}`, { scroll: false })
    document.body.classList.add("overflow-y-hidden")
    // router.push(`/shop/${shop._id}`, { scroll: false })
  }

  return (
    // <Link href={`/shop/${shop._id}`} className="block">
    <div onClick={e => {
      e.preventDefault()
      handleClick()
    }} className="cursor-pointer rounded-lg hover:bg-orange-50 transition">
      <div className="bg-white rounded-lg shadow  overflow-hidden">
        <div className="relative">
          <Image
            src={shop.image!}
            alt={shop.name}
            width={0} // ตั้งค่า width เป็น 0 เพื่อใช้ layout="fill" หรือ "responsive"
            height={0}
            sizes="100vw"
            priority
            className="w-full h-32 md:h-40 object-contain rounded transform transition-all duration-300 hover:scale-[1.06]"
          />
          <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 line-clamp-1 rounded-full">
            🍽 {shop.category}
          </div>
          {/* <div className={`absolute bottom-2 right-2 ${shop.isOpen ? 'bg-green-500' : 'bg-red-500'} text-white text-xs px-2 py-1 rounded-full`}>
            {shop.isOpen ? "เปิดอยู่" : "ปิดแล้ว"}
          </div> */}
        </div>
        <div className="mt-3 space-y-1 px-2 py-2">
          <h3 className="text-sm md:text-lg font-semibold line-clamp-1">{shop.name}</h3>
          <p className="text-sm text-gray-600">🕐 {shop.openTime} - {shop.closeTime}</p>
          <div
            className="text-sm text-orange-600 mt-2 inline-block"
          >
            ดูรายละเอียดร้าน
          </div>
        </div>
      </div>
    </div>
    // </Link>
  )
}
