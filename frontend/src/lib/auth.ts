// auth.ts
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

// แก้ตรงนี้: ไม่ต้องเจาะเข้าไปใน handlers แต่ให้ export handlers ออกมาทั้งก้อน
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: {
    strategy: 'jwt',
  },
});