'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface EventItem {
  id: string
  title: string
  date: string
  description: string
  location: string
  image_url?: string | null
}

export default function Events() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
  }, [])

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
              {events.map((event) => (
                <div
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 cursor-pointer"
                >
                  {event.image_url ? (
                    <div
                      className="h-44 sm:h-48 bg-cover bg-center relative"
                      style={{ backgroundImage: `url('${event.image_url}')` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <span className="inline-block bg-[#d4af37] text-white px-2.5 py-1 rounded-full text-xs font-bold">
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="h-44 sm:h-48 bg-gradient-to-br from-[#1e3a5f] via-[#2a5a8f] to-[#d4af37] relative flex items-end">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent"></div>
                      <div className="relative bottom-3 left-3 right-3">
                        <span className="inline-block bg-[#d4af37] text-white px-2.5 py-1 rounded-full text-xs font-bold">
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  )}
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

      {selectedEvent && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-3 sm:p-4" onClick={() => setSelectedEvent(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {selectedEvent.image_url ? (
              <div className="relative h-48 sm:h-56 bg-cover bg-center" style={{ backgroundImage: `url('${selectedEvent.image_url}')` }}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                <button onClick={() => setSelectedEvent(null)} className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-700 w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold transition shadow-lg">x</button>
                <div className="absolute bottom-4 left-5 right-5">
                  <span className="inline-block bg-[#d4af37] text-white px-3 py-1 rounded-full text-xs font-bold mb-2">{new Date(selectedEvent.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white drop-shadow-lg">{selectedEvent.title}</h2>
                </div>
              </div>
            ) : (
              <div className="relative h-48 sm:h-56 bg-gradient-to-br from-[#1e3a5f] via-[#2a5a8f] to-[#d4af37]">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent"></div>
                <button onClick={() => setSelectedEvent(null)} className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-700 w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold transition shadow-lg">x</button>
                <div className="absolute bottom-4 left-5 right-5">
                  <span className="inline-block bg-[#d4af37] text-white px-3 py-1 rounded-full text-xs font-bold mb-2">{new Date(selectedEvent.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white drop-shadow-lg">{selectedEvent.title}</h2>
                </div>
              </div>
            )}
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
