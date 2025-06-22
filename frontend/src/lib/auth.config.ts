import Facebook from "next-auth/providers/facebook"
import { NextAuthConfig } from "next-auth"
import NextAuth from "next-auth"
import { Auth } from "@auth/core"

export const authConfig: NextAuthConfig = {
  providers: [
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
  },
}

// สำหรับ Next.js API Routes
export const { auth, handlers } = NextAuth(authConfig)

// ✅ สำหรับ Middleware
export const authMiddleware = (request: Request) => Auth(request, authConfig)
