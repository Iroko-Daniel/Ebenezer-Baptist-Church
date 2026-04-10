'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function Executives() {
  const [executives, setExecutives] = useState<any[]>([])
  const [selectedExecutive, setSelectedExecutive] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchExecutives() }, [])

  const fetchExecutives = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('executives').select('*').order('sort_order', { ascending: true })
    if (data) setExecutives(data)
    setLoading(false)
  }

  return (
    <div>
      {/* Compact Hero Section */}
      <section className="relative py-8 sm:py-10 text-white overflow-hidden bg-gradient-to-b from-[#1e3a5f] to-[#2a5a8f]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Our Executives</h1>
            <p className="text-sm sm:text-base text-white/80">Meet the leaders serving our church community</p>
          </div>
        </div>
      </section>

      {/* Executives Grid */}
      <section className="py-10 sm:py-12 bg-gradient-to-b from-white to-[#fef9f3]">
        <div className="container mx-auto px-4 sm:px-6">
          {loading ? (
            <p className="text-center text-gray-500 py-12">Loading executives...</p>
          ) : executives.length === 0 ? (
            <p className="text-center text-gray-500 py-12">No executives yet. Check back soon!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 max-w-6xl mx-auto">
              {executives.map((executive) => (
                <div
                  key={executive.id}
                  onClick={() => setSelectedExecutive(executive)}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 group cursor-pointer"
                >
                  <div className="aspect-square overflow-hidden bg-gray-100">
                    {executive.image_url ? (
                      <img src={executive.image_url} alt={executive.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-300">
                        <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-5 text-center">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">{executive.name}</h3>
                    <p className="text-sm text-[#b8345a] font-semibold">{executive.title}</p>
                    {executive.bio && <p className="text-xs text-gray-500 mt-2 line-clamp-2">{executive.bio}</p>}
                    <p className="text-[#1e3a5f] font-semibold text-xs mt-3 inline-flex items-center">
                      Read full bio
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

      {/* Executive Bio Modal */}
      {selectedExecutive && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-3 sm:p-4"
          onClick={() => setSelectedExecutive(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col sm:flex-row">
              {/* Image Section */}
              <div className="sm:w-2/5 flex-shrink-0">
                <div className="aspect-square overflow-hidden bg-gray-100 sm:h-full">
                  {selectedExecutive.image_url ? (
                    <img src={selectedExecutive.image_url} alt={selectedExecutive.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-300">
                      <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* Bio Content */}
              <div className="p-5 sm:p-6 sm:w-3/5">
                <button
                  onClick={() => setSelectedExecutive(null)}
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-700 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition shadow-lg sm:hidden"
                >
                  ✕
                </button>
                <h2 className="text-xl sm:text-2xl font-bold text-[#1e3a5f] mb-1">{selectedExecutive.name}</h2>
                <p className="text-sm text-[#b8345a] font-semibold mb-4">{selectedExecutive.title}</p>

                {selectedExecutive.bio ? (
                  <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {selectedExecutive.bio}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">No biography available.</p>
                )}

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setSelectedExecutive(null)}
                    className="w-full bg-[#1e3a5f] text-white py-2.5 rounded-lg font-semibold hover:bg-[#2a5a8f] transition shadow-md"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
