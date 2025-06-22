// app/api/auth/[...nextauth]/route.ts

// โค้ดนี้จะดึง GET และ POST handlers ที่เราสร้างไว้ใน auth.ts
// มาสร้างเป็น API endpoint ให้โดยอัตโนมัติ
import { handlers } from '@/lib/auth';
export const { GET, POST } = handlers;