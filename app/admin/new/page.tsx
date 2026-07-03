import Link from 'next/link'
import PostForm from '@/components/PostForm'

export default function NewPostPage() {
  return (
    <main className="max-w-4xl mx-auto p-8">
      <div className="mb-6">
        <Link href="/admin" className="text-sm text-gray-600 hover:underline">
          ← Dashboarda dön
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-8">Yeni yazı</h1>
      <PostForm mode="create" />
    </main>
  )
}