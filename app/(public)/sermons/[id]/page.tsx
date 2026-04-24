import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function SermonDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: sermon } = await supabase
    .from('sermons')
    .select('*')
    .eq('id', id)
    .single()

  if (!sermon) {
    notFound()
  }

  return (
    <div>
      {/* Compact Hero Section */}
      <section className="relative py-8 sm:py-10 text-white overflow-hidden bg-gradient-to-b from-[#4a1328] to-[#6b1d3a]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{sermon.title}</h1>
            <p className="text-sm sm:text-base text-white/80">{sermon.preacher} - {sermon.bible_text}</p>
          </div>
        </div>
      </section>

      {/* Sermon Content */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <div className="bg-gray-50 rounded-lg p-5 sm:p-8 mb-8">
            {sermon.image_url ? (
              <div
                className="h-64 sm:h-80 md:h-96 bg-cover bg-center rounded-lg mb-6"
                style={{ backgroundImage: `url('${sermon.image_url}')` }}
              />
            ) : (
              <div className="h-56 sm:h-72 md:h-96 bg-gradient-to-br from-[#4a1328] to-[#6b1d3a] rounded-lg flex items-center justify-center mb-6">
                <span className="text-white/80 text-lg sm:text-2xl">Sermon Image</span>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm">
              <div>
                <p className="text-gray-600"><strong>Preacher:</strong></p>
                <p>{sermon.preacher}</p>
              </div>
              <div>
                <p className="text-gray-600"><strong>Date:</strong></p>
                <p>{new Date(sermon.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              </div>
              <div>
                <p className="text-gray-600"><strong>Bible Text:</strong></p>
                <p>{sermon.bible_text}</p>
              </div>
            </div>
          </div>

          <div className="prose max-w-none mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Sermon Message</h2>
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed whitespace-pre-line">{sermon.content}</p>
          </div>

          <div className="text-center">
            <Link href="/sermons" className="text-[#b8345a] font-bold hover:underline">
              ← Back to All Sermons
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
