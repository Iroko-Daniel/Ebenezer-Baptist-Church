'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchAnnouncements() }, [])

  const fetchAnnouncements = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('announcements').select('*').order('date', { ascending: false })
    if (data) setAnnouncements(data)
    setLoading(false)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'normal': return 'bg-green-500'
      case 'high': return 'bg-orange-500'
      case 'urgent': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div>
      <section className="relative py-8 sm:py-10 text-white overflow-hidden bg-gradient-to-b from-[#1e3a5f] to-[#2a5a8f]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Announcements</h1>
            <p className="text-sm sm:text-base text-white/80">Stay updated with church news and events</p>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-12 bg-gradient-to-b from-white to-[#fef9f3]">
        <div className="container mx-auto px-4 sm:px-6">
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-[#d4af37] border-t-transparent"></div>
              <p className="mt-4 text-gray-500 text-sm">Loading announcements...</p>
            </div>
          ) : announcements.length === 0 ? (
            <div className="text-center py-16 max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#fef9f3] to-white rounded-full flex items-center justify-center border-2 border-[#d4af37]/30">
                <svg className="w-10 h-10 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Announcements Yet</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Stay tuned for updates from our church community. New announcements will appear here as they become available.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {announcements.map((announcement, index) => (
                <div
                  key={announcement.id}
                  onClick={() => setSelectedAnnouncement(announcement)}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-gray-100"
                >
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`${getPriorityColor(announcement.priority)} text-white px-2.5 py-0.5 rounded-full text-xs font-bold capitalize`}>
                        {announcement.priority}
                      </span>
                      <span className="text-gray-500 text-xs font-semibold">
                        {new Date(announcement.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold mb-2 text-gray-900 line-clamp-2">{announcement.title}</h3>
                    <p className="text-gray-600 text-xs line-clamp-3 mb-3">{announcement.content}</p>
                    <p className="text-[#1e3a5f] font-semibold text-xs inline-flex items-center">
                      Click for details
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

      {/* Announcement Modal */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-3 sm:p-4" onClick={() => setSelectedAnnouncement(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="relative bg-gradient-to-br from-[#1e3a5f] to-[#2a5a8f] p-6 rounded-t-2xl">
              <button onClick={() => setSelectedAnnouncement(null)} className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold transition">✕</button>
              <div className="flex items-center space-x-2 mb-2">
                <span className={`${getPriorityColor(selectedAnnouncement.priority)} text-white px-3 py-1 rounded-full text-xs font-bold capitalize`}>{selectedAnnouncement.priority}</span>
                <span className="text-white/80 text-xs font-semibold">{new Date(selectedAnnouncement.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <h2 className="text-xl font-bold text-white pr-10">{selectedAnnouncement.title}</h2>
            </div>
            <div className="p-5 sm:p-8">
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base whitespace-pre-line">{selectedAnnouncement.content}</p>
              <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <button onClick={() => setSelectedAnnouncement(null)} className="bg-[#1e3a5f] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#2a5a8f] transition shadow-lg">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
