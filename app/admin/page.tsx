import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const { data: posts, error } = await supabaseAdmin
    .from('posts')
    .select('id, slug, title, published, updated_at')
    .order('updated_at', { ascending: false })

  return (
    <main className="max-w-4xl mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <Link
            href="/admin/new"
            className="px-4 py-2 bg-black text-white rounded"
          >
            + Yeni yazı
          </Link>
          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="px-4 py-2 border border-gray-300 rounded"
            >
              Çıkış
            </button>
          </form>
        </div>
      </div>

      {error && (
        <p className="text-red-600 mb-4">Hata: {error.message}</p>
      )}

      {!posts || posts.length === 0 ? (
        <p className="text-gray-600">Henüz yazı yok. Yeni bir tane oluştur.</p>
      ) : (
        <ul className="space-y-2">
          {posts.map((post) => (
            <li
              key={post.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded hover:bg-gray-50"
            >
              <div>
                <Link
                  href={`/admin/edit/${post.id}`}
                  className="font-medium hover:underline"
                >
                  {post.title || '(başlıksız)'}
                </Link>
                <p className="text-sm text-gray-500">
                  /{post.slug}
                  {' · '}
                  {post.published ? 'Yayınlandı' : 'Taslak'}
                  {' · '}
                  {new Date(post.updated_at).toLocaleDateString('tr-TR')}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}