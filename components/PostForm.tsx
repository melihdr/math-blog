'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Post = {
  id?: string
  slug: string
  title: string
  body: string
  published: boolean
}

type Props = {
  initialPost?: Post
  mode: 'create' | 'edit'
}

export default function PostForm({ initialPost, mode }: Props) {
  const router = useRouter()
  const [title, setTitle] = useState(initialPost?.title ?? '')
  const [slug, setSlug] = useState(initialPost?.slug ?? '')
  const [body, setBody] = useState(initialPost?.body ?? '')
  const [published, setPublished] = useState(initialPost?.published ?? false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)

    const endpoint =
      mode === 'create'
        ? '/api/admin/posts'
        : `/api/admin/posts/${initialPost?.id}`

    const method = mode === 'create' ? 'POST' : 'PUT'

    const res = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, slug, body, published }),
    })

    setSaving(false)

    if (res.ok) {
      router.push('/admin')
      router.refresh()
    } else {
      const data = await res.json()
      setError(data.error || 'Bir hata oluştu')
    }
  }

  async function handleDelete() {
    if (!initialPost?.id) return
    if (!confirm('Bu yazıyı silmek istediğine emin misin?')) return

    const res = await fetch(`/api/admin/posts/${initialPost.id}`, {
      method: 'DELETE',
    })

    if (res.ok) {
      router.push('/admin')
      router.refresh()
    } else {
      const data = await res.json()
      setError(data.error || 'Silinemedi')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Başlık</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Slug (URL'de görünecek)
        </label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded font-mono text-sm"
          placeholder="griffiths-3-4-multipole"
          pattern="[a-z0-9\-]+"
          title="Sadece küçük harf, rakam ve tire"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">İçerik</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded font-mono text-sm"
          rows={20}
          placeholder="Yazınızı buraya yazın..."
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="published"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
        />
        <label htmlFor="published" className="text-sm">
          Yayınlandı (işaretsizse taslak olarak kalır)
        </label>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="flex items-center justify-between pt-4">
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
        >
          {saving ? 'Kaydediliyor...' : 'Kaydet'}
        </button>

        {mode === 'edit' && (
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 text-red-600 border border-red-300 rounded"
          >
            Sil
          </button>
        )}
      </div>
    </form>
  )
}