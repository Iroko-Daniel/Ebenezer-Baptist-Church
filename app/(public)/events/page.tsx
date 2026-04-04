'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

const eventImages = [
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
  'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=600&q=80',
  'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&q=80',
  'https://images.unsplash.com/photo-1544427920-c49ccfb85579?w=600&q=80',
  'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&q=80',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
  'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=600&q=80',
  'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&q=80',
  'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&q=80',
  'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=600&q=80',
  'https://images.unsplash.com/photo-1523050854058-8df90110c476?w=600&q=80',
  'https://images.unsplash.com/photo-1470058869958-2a77ade41800?w=600&q=80',
  'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=600&q=80',
  'https://images.unsplash.com/photo-1544427920-2646b5e4f6b5?w=600&q=80',
  'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&q=80',
  'https://images.unsplash.com/photo-1501281668745-f7f579a5a029?w=600&q=80',
  'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=600&q=80',
  'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80',
  'https://images.unsplash.com/photo-1476842223541-69d3d34e8535?w=600&q=80'
]

export default function Events() {
  const [events, setEvents] = useState<any[]>([])
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchEvents() }, [])

  const fetchEvents = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('events').select('*').order('date', { ascending: true })
    if (data) setEvents(data)
    setLoading(false)
  }

  return (
    <div>
      <section className="relative py-8 sm:py-10 text-white overflow-hidden bg-gradient-to-b from-[#1e3a5f] to-[#2a5a8f]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Events</h1>
            <p className="text-sm sm:text-base text-white/80">Upcoming activities and programs</p>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-12 bg-gradient-to-b from-white to-[#fef9f3]">
        <div className="container mx-auto px-4 sm:px-6">
          {loading ? (
            <p className="text-center text-gray-500 py-12">Loading events...</p>
          ) : events.length === 0 ? (
            <p className="text-center text-gray-500 py-12">No events yet. Check back soon!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
              {events.map((event, index) => (
                <div
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 cursor-pointer"
                >
                  <div
                    className="h-44 sm:h-48 bg-cover bg-center relative"
                    style={{ backgroundImage: `url('${eventImages[index % eventImages.length]}')` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="inline-block bg-[#d4af37] text-white px-2.5 py-1 rounded-full text-xs font-bold">
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 sm:p-5">
                    <h3 className="text-sm sm:text-base font-bold mb-2 text-gray-900 line-clamp-2">{event.title}</h3>
                    <p className="text-gray-600 mb-2 text-xs line-clamp-2">{event.description}</p>
                    <p className="text-gray-500 text-xs flex items-center">
                      <svg className="w-3 h-3 mr-1.5 text-[#d4af37] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {event.location}
                    </p>
                    <p className="text-[#1e3a5f] font-semibold text-xs mt-3 inline-flex items-center">
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

      {/* Event Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-3 sm:p-4" onClick={() => setSelectedEvent(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative h-48 sm:h-56 bg-cover bg-center" style={{ backgroundImage: `url('${eventImages[events.findIndex(ev => ev.id === selectedEvent.id) % eventImages.length]}')` }}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
              <button onClick={() => setSelectedEvent(null)} className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-700 w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold transition shadow-lg">✕</button>
              <div className="absolute bottom-4 left-5 right-5">
                <span className="inline-block bg-[#d4af37] text-white px-3 py-1 rounded-full text-xs font-bold mb-2">{new Date(selectedEvent.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                <h2 className="text-xl sm:text-2xl font-bold text-white drop-shadow-lg">{selectedEvent.title}</h2>
              </div>
            </div>
            <div className="p-5 sm:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div><p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Date</p><p className="text-sm font-bold text-gray-900 mt-1">{new Date(selectedEvent.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p></div>
                <div><p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Location</p><p className="text-sm font-bold text-gray-900 mt-1">{selectedEvent.location}</p></div>
              </div>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{selectedEvent.description}</p>
              <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <button onClick={() => setSelectedEvent(null)} className="bg-[#1e3a5f] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#2a5a8f] transition shadow-lg">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
