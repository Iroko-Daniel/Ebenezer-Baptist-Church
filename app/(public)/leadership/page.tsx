'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function Leadership() {
  const [leaders, setLeaders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLeader, setSelectedLeader] = useState<any | null>(null)

  useEffect(() => {
    fetchLeaders()
  }, [])

  const fetchLeaders = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('leaders')
      .select('*')
      .order('position', { ascending: true })
    
    if (data) setLeaders(data)
    setLoading(false)
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 text-white overflow-hidden bg-gradient-to-b from-[#070f1a] to-[#1e3a5f]">
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle, #d4af37 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#d4af37] to-[#c9941a] rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">Our Leadership</h1>
            <p className="text-sm sm:text-base md:text-lg text-white/80 max-w-2xl mx-auto">
              Dedicated servants leading our church community with vision, integrity, and the Spirit of God
            </p>
          </div>
        </div>
      </section>

      {/* Leaders Grid */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-white to-[#fef9f3]">
        <div className="container mx-auto px-4 sm:px-6">
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-[#d4af37] border-t-transparent"></div>
              <p className="mt-4 text-gray-500 text-sm">Loading leadership...</p>
            </div>
          ) : leaders.length === 0 ? (
            <div className="text-center py-16 max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#fef9f3] to-white rounded-full flex items-center justify-center border-2 border-[#d4af37]/30">
                <svg className="w-10 h-10 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Leadership Profiles Coming Soon</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                We are currently updating our leadership page. Meet our team at our next service.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {leaders.map((leader) => (
                <div
                  key={leader.id}
                  onClick={() => setSelectedLeader(leader)}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 group"
                >
                  <div className="h-48 bg-gradient-to-br from-[#1e3a5f] to-[#2a5a8f] flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00eiIvPjwvZz48L2c+PC9zdmc+')]"></div>
                    {leader.photo_url ? (
                      <img src={leader.photo_url} alt={leader.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-white/90 text-4xl font-bold">{getInitials(leader.name)}</div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-[#1e3a5f] transition-colors">{leader.name}</h3>
                    <p className="text-[#d4af37] text-sm font-semibold mb-2">{leader.position}</p>
                    {leader.bio && (
                      <p className="text-gray-600 text-xs line-clamp-2">{leader.bio}</p>
                    )}
                    <p className="text-[#1e3a5f] font-semibold text-xs mt-3 inline-flex items-center">
                      Read More
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

      {/* Leader Modal */}
      {selectedLeader && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-3 sm:p-4" onClick={() => setSelectedLeader(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative h-56 bg-gradient-to-br from-[#1e3a5f] to-[#2a5a8f] flex items-center justify-center">
              {selectedLeader.photo_url ? (
                <img src={selectedLeader.photo_url} alt={selectedLeader.name} className="w-full h-full object-cover" />
              ) : (
                <div className="text-white/90 text-6xl font-bold">{getInitials(selectedLeader.name)}</div>
              )}
              <button onClick={() => setSelectedLeader(null)} className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-700 w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold transition shadow-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedLeader.name}</h2>
              <p className="text-[#d4af37] font-semibold mb-4">{selectedLeader.position}</p>
              {selectedLeader.bio && (
                <div className="text-gray-700 leading-relaxed space-y-3 text-sm">
                  {selectedLeader.bio.split('. ').map((sentence: string, i: number) => (
                    <p key={i}>{sentence}{i !== selectedLeader.bio.split('. ').length - 1 ? '.' : ''}</p>
                  ))}
                </div>
              )}
              <div className="mt-6 pt-6 border-t border-gray-200 flex gap-3">
                <button onClick={() => setSelectedLeader(null)} className="flex-1 bg-[#1e3a5f] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#2a5a8f] transition shadow-lg">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
