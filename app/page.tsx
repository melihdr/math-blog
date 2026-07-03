import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const { data: posts, error } = await supabase
    .from('posts')
    .select('slug, title, updated_at')
    .eq('published', true)
    .order('updated_at', { ascending: false })

  return (
    <main className="max-w-2xl mx-auto p-8">
      <header className="mb-12">
        <h1 className="text-3xl font-bold mb-2">Notlar</h1>
        <p className="text-gray-600">Matematik ve fizik üzerine yazılar.</p>
      </header>

      {error && (
        <p className="text-red-600">Bir hata oluştu: {error.message}</p>
      )}

      {!posts || posts.length === 0 ? (
        <p className="text-gray-600">Henüz yayınlanmış bir yazı yok.</p>
      ) : (
        <ul className="space-y-4">
          {posts.map((post) => (
            <li key={post.slug} className="border-b border-gray-200 pb-4">
              <Link
                href={`/${post.slug}`}
                className="text-lg font-medium hover:underline"
              >
                {post.title}
              </Link>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(post.updated_at).toLocaleDateString('tr-TR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}