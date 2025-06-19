// app/checkin/page.tsx
"use client"

import React, { useEffect } from "react"
import CheckinForm from "@/components/CheckinForm"
import { useAuth } from '@/context/AuthContext'
import { useRouter } from "next/navigation"

export default function CheckinPage() {
    const { isLoggedIn, isCheckingAuth } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isCheckingAuth && !isLoggedIn) {
            router.push(`/login?from=checkin`)
        }
    }, [isLoggedIn, isCheckingAuth, router])

    if (isCheckingAuth) {
        return (
            <div className="text-center py-20 text-gray-500">
                กำลังตรวจสอบสิทธิ์ผู้ใช้...
            </div>
        )
    }
    // useEffect(() => {
    //     if (!isLoggedIn) {
    //         logout();
    //         router.push(`/login?from=checkin`)
    //     }

    // }, [isLoggedIn, logout, router])

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">เช็คอินร้านอาหาร</h1>
            {isLoggedIn && <CheckinForm />}
        </div>
    )
}
