"use client"

interface Props {
    status: string
    setStatus: (value: string) => void
    setDefault?: () => void
}

export default function ShopStatusFilter({ status, setStatus, setDefault }: Props) {
    return (
        <div className="flex gap-2">
            <button
                onClick={() => {
                    if (status === "") setStatus("open")
                    if (status === "open") setStatus("")
                }}
                className={`flex items-center gap-1 px-3 py-1 rounded-full border text-sm ${status === "open"
                    ? "bg-green-100 border-green-500 text-green-700"
                    : "bg-white border-gray-700 text-gray-500"
                    }`}
            >
                ⏱ เปิดตอนนี้
            </button>

            <button
                onClick={setDefault}
                className="flex items-center gap-1 px-3 py-1 rounded-full border text-sm bg-orange-100 border-orange-500 text-orange-500 hover:bg-orange-300 hover:text-white transition 200"
            >
                ค่าเริ่มต้น
            </button>
        </div>
    )
}
