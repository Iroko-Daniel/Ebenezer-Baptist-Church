'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface SermonItem {
  id: string
  title: string
  preacher: string
  bible_text: string
  date: string
  content: string
  image_url?: string | null
}

export default function Sermons() {
  const [sermons, setSermons] = useState<SermonItem[]>([])
  const [selectedSermon, setSelectedSermon] = useState<SermonItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSermons()
  }, [])

  const fetchSermons = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('sermons').select('*').order('date', { ascending: false })
    if (data) setSermons(data)
    setLoading(false)
  }

  return (
    <div>
      <section className="relative py-8 sm:py-10 text-white overflow-hidden bg-gradient-to-b from-[#1e3a5f] to-[#2a5a8f]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Sermons</h1>
            <p className="text-sm sm:text-base text-white/80">Explore our collection of powerful messages</p>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-12 bg-gradient-to-b from-white to-[#fef9f3]">
        <div className="container mx-auto px-4 sm:px-6">
          {loading ? (
            <p className="text-center text-gray-500 py-12">Loading sermons...</p>
          ) : sermons.length === 0 ? (
            <p className="text-center text-gray-500 py-12">No sermons yet. Check back soon!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
              {sermons.map((sermon) => (
                <div
                  key={sermon.id}
                  onClick={() => setSelectedSermon(sermon)}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 cursor-pointer"
                >
                  {sermon.image_url ? (
                    <div
                      className="h-44 sm:h-48 bg-cover bg-center relative"
                      style={{ backgroundImage: `url('${sermon.image_url}')` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <span className="inline-block bg-[#1e3a5f]/90 text-white px-2.5 py-1 rounded-full text-xs font-semibold">
                          {new Date(sermon.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="h-44 sm:h-48 bg-gradient-to-br from-[#1e3a5f] via-[#2a5a8f] to-[#d4af37] relative flex items-end">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent"></div>
                      <div className="relative bottom-3 left-3 right-3">
                        <span className="inline-block bg-[#1e3a5f]/90 text-white px-2.5 py-1 rounded-full text-xs font-semibold">
                          {new Date(sermon.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="p-4 sm:p-5">
                    <h3 className="text-sm sm:text-base font-bold mb-2 text-gray-900 line-clamp-2">{sermon.title}</h3>
                    <p className="text-gray-600 mb-1 text-xs"><span className="font-semibold">Preacher:</span> {sermon.preacher}</p>
                    <p className="text-gray-500 text-xs flex items-center">
                      <span className="mr-1">Bible:</span>
                      {sermon.bible_text}
                    </p>
                    <p className="text-[#1e3a5f] font-semibold text-xs mt-3 inline-flex items-center">
                      Click to read full sermon
                      <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedSermon && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-3 sm:p-4" onClick={() => setSelectedSermon(null)}>
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {selectedSermon.image_url ? (
              <div className="relative h-52 sm:h-64 bg-cover bg-center" style={{ backgroundImage: `url('${selectedSermon.image_url}')` }}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                <button onClick={() => setSelectedSermon(null)} className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-700 w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold transition shadow-lg">x</button>
                <div className="absolute bottom-4 left-5 right-5">
                  <span className="inline-block bg-[#d4af37] text-white px-3 py-1 rounded-full text-xs font-bold mb-2">{new Date(selectedSermon.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white drop-shadow-lg">{selectedSermon.title}</h2>
                </div>
              </div>
            ) : (
              <div className="relative h-52 sm:h-64 bg-gradient-to-br from-[#1e3a5f] via-[#2a5a8f] to-[#d4af37]">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent"></div>
                <button onClick={() => setSelectedSermon(null)} className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-700 w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold transition shadow-lg">x</button>
                <div className="absolute bottom-4 left-5 right-5">
                  <span className="inline-block bg-[#d4af37] text-white px-3 py-1 rounded-full text-xs font-bold mb-2">{new Date(selectedSermon.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white drop-shadow-lg">{selectedSermon.title}</h2>
                </div>
              </div>
            )}
            <div className="p-5 sm:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="text-center sm:text-left"><p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Preacher</p><p className="text-sm sm:text-base font-bold text-gray-900 mt-1">{selectedSermon.preacher}</p></div>
                <div className="text-center sm:text-left"><p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Bible Text</p><p className="text-sm sm:text-base font-bold text-gray-900 mt-1">{selectedSermon.bible_text}</p></div>
                <div className="text-center sm:text-left"><p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Date</p><p className="text-sm sm:text-base font-bold text-gray-900 mt-1">{new Date(selectedSermon.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p></div>
              </div>
              <h3 className="text-lg font-bold text-[#1e3a5f] mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                Sermon Message
              </h3>
              <div className="text-gray-700 leading-relaxed space-y-4 text-sm sm:text-base">
                {selectedSermon.content.split('. ').map((sentence, i) => (
                  <p key={i}>
                    {sentence}
                    {i !== selectedSermon.content.split('. ').length - 1 ? '.' : ''}
                  </p>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <button onClick={() => setSelectedSermon(null)} className="bg-[#1e3a5f] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#2a5a8f] transition shadow-lg">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
