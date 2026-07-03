import { supabase } from '@/lib/supabase'

export default async function Home() {
  const { data, error } = await supabase.from('posts').select('*')

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test bağlantısı</h1>
      {error ? (
        <p className="text-red-600">Hata: {error.message}</p>
      ) : (
        <div>
          <p className="mb-2">Bağlantı başarılı!</p>
          <p>Toplam yazı sayısı: {data?.length ?? 0}</p>
        </div>
      )}
    </main>
  )
}