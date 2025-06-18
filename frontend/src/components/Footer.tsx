import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-600 text-sm mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-wrap justify-center md:justify-start gap-4">
          <Link href="/about" className="hover:text-orange-600">เกี่ยวกับเรา</Link>
          <Link href="/privacy-policy" className="hover:text-orange-600">นโยบายความเป็นส่วนตัว</Link>
          <Link href="/contact" className="hover:text-orange-600">ติดต่อเรา</Link>
        </div>
        <p className="text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} ของอร่อยสูงเนิน
        </p>
      </div>
    </footer>
  )
}
