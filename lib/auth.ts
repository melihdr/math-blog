import { cookies } from 'next/headers'

const COOKIE_NAME = 'admin_session'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 gün

// Girilen şifre doğru mu?
export function checkPassword(password: string): boolean {
  const correctPassword = process.env.ADMIN_PASSWORD
  if (!correctPassword) {
    throw new Error('ADMIN_PASSWORD environment variable ayarlı değil')
  }
  return password === correctPassword
}

// Admin cookie'sini set et (giriş yapıldı)
export async function setAdminCookie() {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  })
}

// Admin cookie'sini sil (çıkış yap)
export async function clearAdminCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

// Kullanıcı admin mi?
export async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get(COOKIE_NAME)
  return session?.value === 'authenticated'
}