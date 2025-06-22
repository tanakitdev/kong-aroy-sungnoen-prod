import { authConfig } from "@/lib/auth.config"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { Auth } from "@auth/core" // ✅ ใช้ Auth ตรงนี้แทน
// import { auth } from "@/lib/auth.config"
// import { authMiddleware } from "@/lib/auth.config"

export async function middleware(request: NextRequest) {
  console.log("Middleware fired")
  const session = await Auth(request, authConfig) // ✅ authConfig ถูก inject

  if (!session) {
    // ไม่มี session = ไม่ได้ login → redirect ไป signin
    return NextResponse.redirect(new URL("/login", request.url))
  }
  return NextResponse.next()
  // return authMiddleware(request) // ✅ ใช้ตัวนี้
}

export const config = {
  matcher: ["/dashboard/:path*"], // ✅ คุมแค่ /dashboard
}