'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { getSiteSettings, SiteSettings } from '@/lib/site-settings'

const sermonImages = [
  'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=600&q=80',
  'https://images.unsplash.com/photo-1507692049760-de9e290c49c7?w=600&q=80',
  'https://images.unsplash.com/photo-1519450799035-48a21f64eb75?w=600&q=80',
  'https://images.unsplash.com/photo-1501281668745-f7f579a5a029?w=600&q=80',
  'https://images.unsplash.com/photo-1494873431943-291809d7d1d0?w=600&q=80',
  'https://images.unsplash.com/photo-1476842223541-69d3d34e8535?w=600&q=80'
]

const eventImages = [
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
  'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=600&q=80',
  'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&q=80',
  'https://images.unsplash.com/photo-1544427920-c49ccfb85579?w=600&q=80',
  'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&q=80',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80'
]

const announcementImages = [
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&q=80',
  'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600&q=80',
  'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&q=80'
]

export default function Home() {
  const [selectedSermon, setSelectedSermon] = useState<any | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any | null>(null)
  const [settings, setSettings] = useState<SiteSettings | null>(null)

  const [sermons, setSermons] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [announcements, setAnnouncements] = useState<any[]>([])

  useEffect(() => {
    fetchSermons()
    fetchEvents()
    fetchAnnouncements()
    loadSettings()
  }, [])

  const loadSettings = async () => {
    const siteSettings = await getSiteSettings()
    setSettings(siteSettings)
  }

  const fetchSermons = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('sermons').select('*').order('date', { ascending: false }).limit(6)
    if (data) setSermons(data)
  }

  const fetchEvents = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('events').select('*').order('date', { ascending: true }).limit(6)
    if (data) setEvents(data)
  }

  const fetchAnnouncements = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('announcements').select('*').order('date', { ascending: false }).limit(3)
    if (data) setAnnouncements(data)
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
    <div className="font-serif">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1438032005730-c779502df39b?w=1920&q=80')` }}
        ></div>
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10 py-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white/10 backdrop-blur-sm rounded-2xl p-2 sm:p-3 shadow-2xl ring-4 ring-white/30 hover:ring-white/50 transition-all duration-300">
              <img
                src={settings?.logo_url || '/logo.png'}
                alt={settings?.church_name || 'Ebenezer Baptist Church Logo'}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-3 sm:mb-5 drop-shadow-2xl leading-tight">
            Welcome to<br />{settings?.church_name || 'Ebenezer Baptist Church'}
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-5 sm:mb-6 italic text-white/90 drop-shadow-lg max-w-2xl mx-auto px-2">
            "{settings?.church_motto || 'Not by might, nor by power, but by my Spirit, says the Lord.'}"
            <br className="hidden sm:block" />
            <span className="text-xs sm:text-sm">— Zechariah 4:6 (NKJV)</span>
          </p>
          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 px-2">
            <Link href="/give" className="bg-gradient-to-r from-[#d4af37] to-[#c9941a] text-white px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-lg font-bold text-sm sm:text-base hover:shadow-xl transition-all duration-300">
              Give Online
            </Link>
            <Link href="/sermons" className="bg-white text-gray-900 px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-lg font-bold text-sm sm:text-base hover:bg-gray-100 transition shadow-lg hover:shadow-xl">
              Watch Sermons
            </Link>
            <Link href="/enquire/new-to-church" className="bg-transparent border-2 border-white text-white px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-lg font-bold text-sm sm:text-base hover:bg-white hover:text-gray-900 transition">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10 md:gap-12 text-center">
            <div className="group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#1e3a5f]/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-[#1e3a5f]/20 transition-colors">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-4xl sm:text-5xl md:text-6xl font-bold mb-2 text-[#1e3a5f]">{settings?.stat_community || '300+'}</p>
              <p className="text-base sm:text-lg md:text-xl text-gray-600">Church Community</p>
            </div>
            <div className="group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#1e3a5f]/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-[#1e3a5f]/20 transition-colors">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-4xl sm:text-5xl md:text-6xl font-bold mb-2 text-[#1e3a5f]">{settings?.stat_active_members || '359+'}</p>
              <p className="text-base sm:text-lg md:text-xl text-gray-600">Active Members</p>
            </div>
            <div className="group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#1e3a5f]/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-[#1e3a5f]/20 transition-colors">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-4xl sm:text-5xl md:text-6xl font-bold mb-2 text-[#1e3a5f]">{settings?.stat_years || '138+'}</p>
              <p className="text-base sm:text-lg md:text-xl text-gray-600">Years of Service</p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Times Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-[#1e3a5f] via-[#2a5a8f] to-[#1e3a5f] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle, #d4af37 1px, transparent 1px)', backgroundSize: '30px 30px'}}></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-10 sm:mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#d4af37]/20 backdrop-blur-sm rounded-full mb-4">
              <svg className="w-8 h-8 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">Join Us For Worship</h2>
            <p className="text-white/70 text-sm sm:text-base max-w-xl mx-auto">Experience God's presence in our welcoming community</p>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto mb-10">
            {/* Sunday Service */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[#d4af37] to-[#c9941a] rounded-xl mx-auto mb-4 shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white text-center mb-2">Sunday School</h3>
              <p className="text-2xl font-bold text-[#d4af37] text-center">9:00 AM</p>
              <p className="text-white/60 text-sm text-center mt-2">Bible Study & Prayer</p>
            </div>

            {/* Main Service */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ring-2 ring-[#d4af37]/30">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className="bg-gradient-to-r from-[#d4af37] to-[#c9941a] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">Main Service</span>
              </div>
              <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[#d4af37] to-[#c9941a] rounded-xl mx-auto mb-4 shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white text-center mb-2">Main Worship</h3>
              <p className="text-2xl font-bold text-[#d4af37] text-center">10:00 AM</p>
              <p className="text-white/60 text-sm text-center mt-2">Praise, Worship & Word</p>
            </div>

            {/* Wednesday Service */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl mx-auto mb-4 shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white text-center mb-2">Wednesday</h3>
              <p className="text-2xl font-bold text-[#d4af37] text-center">6:00 PM</p>
              <p className="text-white/60 text-sm text-center mt-2">Bible Study</p>
            </div>
          </div>

          {/* Friday Service */}
          {settings?.friday_service && (
            <div className="max-w-md mx-auto mb-10">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:shadow-xl flex items-center justify-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Friday Prayer Meeting</h3>
                  <p className="text-xl font-bold text-[#d4af37]">7:00 PM</p>
                </div>
              </div>
            </div>
          )}

          {/* Location & Directions */}
          <div className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-3">
              <svg className="w-6 h-6 text-[#d4af37]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <p className="text-white/90 font-semibold">
                {settings?.church_address || '50A Campbell Street, Lagos Island, Lagos'}
              </p>
            </div>
            <a
              href="https://www.google.com/maps/place/Ebenezer+Baptist+Church/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-[#d4af37] to-[#c9941a] text-white px-6 sm:px-8 py-3 rounded-lg font-bold hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 inline-block text-sm sm:text-base"
            >
              Get Directions →
            </a>
          </div>
        </div>
      </section>

      {/* Announcements Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-[#fef9f3] to-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-3">Announcements</h2>
            <div className="section-divider mx-auto"></div>
          </div>
          {announcements.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No announcements yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {announcements.map((announcement, index) => (
                <div
                  key={announcement.id}
                  onClick={() => setSelectedAnnouncement(announcement)}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-[#d4af37]"
                >
                  <div
                    className="h-36 bg-cover bg-center relative"
                    style={{ backgroundImage: `url('${announcementImages[index % announcementImages.length]}')` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-3 left-3">
                      <span className={`${getPriorityColor(announcement.priority)} text-white px-2.5 py-0.5 rounded-full text-xs font-bold capitalize`}>
                        {announcement.priority}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm sm:text-base font-bold mb-2 text-gray-800 line-clamp-2">{announcement.title}</h3>
                    <p className="text-gray-600 text-xs line-clamp-2">{announcement.content}</p>
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
          <div className="text-center mt-8">
            <Link href="/announcements" className="text-[#1e3a5f] font-bold hover:text-[#d4af37] transition-colors inline-flex items-center text-sm sm:text-base">
              View All Announcements
              <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-12 sm:py-16 md:py-20 section-bg-elegant text-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">Upcoming Events</h2>
            <div className="section-divider mx-auto"></div>
          </div>
          {events.length === 0 ? (
            <p className="text-center text-white/70 py-8">No events yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
              {events.map((event, index) => (
                <div
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-white/10 cursor-pointer"
                >
                  <div
                    className="h-40 sm:h-48 bg-cover bg-center relative"
                    style={{ backgroundImage: `url('${eventImages[index % eventImages.length]}')` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-3 left-3">
                      <span className="inline-block bg-[#d4af37] text-white px-2.5 py-1 rounded-full text-xs font-bold">
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 sm:p-5">
                    <h3 className="text-sm sm:text-base font-bold mb-2 text-white line-clamp-2">{event.title}</h3>
                    <p className="text-white/70 mb-2 text-xs line-clamp-2">{event.description}</p>
                    <p className="text-white/50 text-xs flex items-center">
                      <svg className="w-3 h-3 mr-1.5 text-[#d4af37] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {event.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-8 sm:mt-12">
            <Link href="/events" className="bg-gradient-to-r from-[#d4af37] to-[#c9941a] text-white px-6 sm:px-8 py-3 rounded-lg font-bold hover:shadow-xl transition-all duration-300 inline-block text-sm sm:text-base">
              View All Events
            </Link>
          </div>
        </div>
      </section>

      {/* Sermons Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-white to-[#fef9f3]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-3">Latest Sermons</h2>
            <div className="section-divider mx-auto"></div>
          </div>
          {sermons.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No sermons yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
              {sermons.map((sermon, index) => (
                <div
                  key={sermon.id}
                  onClick={() => setSelectedSermon(sermon)}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 cursor-pointer"
                >
                  <div
                    className="h-40 sm:h-48 bg-cover bg-center relative"
                    style={{ backgroundImage: `url('${sermonImages[index % sermonImages.length]}')` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-3 left-3">
                      <span className="inline-block bg-[#1e3a5f]/90 text-white px-2.5 py-1 rounded-full text-xs font-semibold">
                        {new Date(sermon.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 sm:p-5">
                    <h3 className="text-sm sm:text-base font-bold mb-2 text-gray-800 line-clamp-2">{sermon.title}</h3>
                    <p className="text-gray-600 mb-1 text-xs"><span className="font-semibold">Preacher:</span> {sermon.preacher}</p>
                    <p className="text-gray-500 text-xs flex items-center">
                      <span className="mr-1">📖</span>
                      {sermon.bible_text}
                    </p>
                    <p className="text-[#1e3a5f] font-semibold text-xs mt-3 inline-flex items-center">
                      Click to read
                      <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-8 sm:mt-12">
            <Link href="/sermons" className="bg-gradient-to-r from-[#1e3a5f] to-[#2a5a8f] text-white px-6 sm:px-8 py-3 rounded-lg font-bold hover:shadow-xl transition-all duration-300 inline-block text-sm sm:text-base">
              View All Sermons
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 sm:py-20 md:py-24 section-bg-elegant text-white relative overflow-hidden border-b-4 border-[#d4af37]">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
          <img src="/logo.png" alt="" className="w-[300px] sm:w-[400px] md:w-[500px] h-[300px] sm:h-[400px] md:h-[500px] object-contain" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 px-2">Join Us This Sunday</h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto text-white/80 px-4">
            Experience the warmth of our community and the power of God's presence.
          </p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 px-2">
            <Link href="/enquire/new-to-church" className="bg-gradient-to-r from-[#d4af37] to-[#c9941a] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg hover:shadow-xl transition-all duration-300 inline-flex items-center">
              Plan Your Visit
            </Link>
            <a href="tel:+234" className="bg-transparent border-2 border-[#d4af37] text-[#d4af37] px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg hover:bg-[#d4af37] hover:text-white transition-all duration-300 inline-flex items-center">
              Call Us
            </a>
          </div>
        </div>
      </section>

      {/* Sermon Modal */}
      {selectedSermon && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-3 sm:p-4" onClick={() => setSelectedSermon(null)}>
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative h-52 sm:h-64 bg-cover bg-center" style={{ backgroundImage: `url('${sermonImages[sermons.findIndex(s => s.id === selectedSermon.id) % sermonImages.length]}')` }}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
              <button onClick={() => setSelectedSermon(null)} className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-700 w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold transition shadow-lg">✕</button>
              <div className="absolute bottom-4 left-5 right-5">
                <span className="inline-block bg-[#d4af37] text-white px-3 py-1 rounded-full text-xs font-bold mb-2">{new Date(selectedSermon.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white drop-shadow-lg">{selectedSermon.title}</h2>
              </div>
            </div>
            <div className="p-5 sm:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="text-center sm:text-left"><p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Preacher</p><p className="text-sm font-bold text-gray-900 mt-1">{selectedSermon.preacher}</p></div>
                <div className="text-center sm:text-left"><p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Bible Text</p><p className="text-sm font-bold text-gray-900 mt-1">{selectedSermon.bible_text}</p></div>
                <div className="text-center sm:text-left"><p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Date</p><p className="text-sm font-bold text-gray-900 mt-1">{new Date(selectedSermon.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p></div>
              </div>
              <h3 className="text-lg font-bold text-[#1e3a5f] mb-4">Sermon Message</h3>
              <div className="text-gray-700 leading-relaxed space-y-4 text-sm sm:text-base">
                {selectedSermon.content.split('. ').map((sentence: string, i: number) => (<p key={i}>{sentence}{i !== selectedSermon.content.split('. ').length - 1 ? '.' : ''}</p>))}
              </div>
              <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <button onClick={() => setSelectedSermon(null)} className="bg-[#1e3a5f] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#2a5a8f] transition shadow-lg">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

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

      {/* Announcement Modal */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-3 sm:p-4" onClick={() => setSelectedAnnouncement(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative h-40 bg-cover bg-center" style={{ backgroundImage: `url('${announcementImages[announcements.findIndex(a => a.id === selectedAnnouncement.id) % announcementImages.length]}')` }}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
              <button onClick={() => setSelectedAnnouncement(null)} className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-700 w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold transition shadow-lg">✕</button>
              <div className="absolute bottom-4 left-5">
                <span className={`${getPriorityColor(selectedAnnouncement.priority)} text-white px-3 py-1 rounded-full text-xs font-bold capitalize`}>{selectedAnnouncement.priority}</span>
              </div>
            </div>
            <div className="p-5 sm:p-8">
              <h2 className="text-xl font-bold text-[#1e3a5f] mb-4">{selectedAnnouncement.title}</h2>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{selectedAnnouncement.content}</p>
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
