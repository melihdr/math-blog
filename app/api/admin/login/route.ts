import { NextResponse } from 'next/server'
import { checkPassword, setAdminCookie } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { password } = await request.json()

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Şifre gerekli' },
        { status: 400 }
      )
    }

    if (!checkPassword(password)) {
      return NextResponse.json(
        { error: 'Yanlış şifre' },
        { status: 401 }
      )
    }

    await setAdminCookie()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}