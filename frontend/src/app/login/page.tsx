// src/app/login/page.tsx
import { Suspense } from "react"
import LoginPage from "./LoginContent"

export default function LoginWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPage />
    </Suspense>
  )
}
