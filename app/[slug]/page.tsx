import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import MdxContent from '@/components/MdxContent'

export const dynamic = 'force-dynamic'

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const { data: post, error } = await supabase
    .from('posts')
    .select('title, body, updated_at')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error || !post) {
    notFound()
  }

  return (
    <main className="max-w-2xl mx-auto p-8">
      <div className="mb-8">
        <Link href="/" className="text-sm text-gray-600 dark:text-gray-400 hover:underline">
          ← Tüm yazılar
        </Link>
      </div>

      <article>
        <header className="mb-8">
<h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">{post.title}</h1>
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