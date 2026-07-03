import { NextResponse } from 'next/server'
import { isAdmin } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  }

  try {
    const { title, slug, body, published } = await request.json()

    if (!title || !slug) {
      return NextResponse.json(
        { error: 'Başlık ve slug gerekli' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('posts')
      .insert({
        title,
        slug,
        body: body ?? '',
        published: !!published,
      })
      .select()
      .single()

    if (error) {
      // Slug unique constraint hatası
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Bu slug zaten kullanılıyor' },
          { status: 400 }
        )
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ post: data })
  } catch (error) {
    console.error('Post create error:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}