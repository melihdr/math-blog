import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { isAdmin } from '@/lib/auth'
import MdxContent from '@/components/MdxContent'

export const dynamic = 'force-dynamic'

export default async function PostPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ preview?: string }>
}) {
  const { slug } = await params
  const { preview } = await searchParams

  // Preview modu: sadece admin, published olmayanları da göster
  const isPreview = preview === '1' && (await isAdmin())

  const client = isPreview ? supabaseAdmin : supabase
  const query = client
    .from('posts')
    .select('title, body, updated_at, published')
    .eq('slug', slug)

  const { data: post, error } = isPreview
    ? await query.single()
    : await query.eq('published', true).single()

  if (error || !post) {
    notFound()
  }

  return (
    <main className="max-w-2xl mx-auto p-8">
      <div className="mb-8 flex items-center justify-between">
        <Link
          href="/"
          className="text-sm text-gray-600 dark:text-gray-400 hover:underline"
        >
          ← Tüm yazılar
        </Link>
        {isPreview && !post.published && (
          <span className="text-xs px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded">
            Taslak — önizleme
          </span>
        )}
      </div>

      <article>
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">
            {post.title}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(post.updated_at).toLocaleDateString('tr-TR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </header>

        <MdxContent source={post.body} />
      </article>
    </main>
  )
}