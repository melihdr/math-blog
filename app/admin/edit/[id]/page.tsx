import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase-admin'
import PostForm from '@/components/PostForm'

export const dynamic = 'force-dynamic'

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const { data: post, error } = await supabaseAdmin
    .from('posts')
    .select('id, slug, title, body, published')
    .eq('id', id)
    .single()

  if (error || !post) {
    notFound()
  }

  return (
    <main className="max-w-4xl mx-auto p-8">
      <div className="mb-6">
        <Link href="/admin" className="text-sm text-gray-600 hover:underline">
          ← Dashboarda dön
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-8">Yazıyı düzenle</h1>
      <PostForm mode="edit" initialPost={post} />
    </main>
  )
}