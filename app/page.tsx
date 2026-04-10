'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { FaUsers, FaUserCheck, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaPlayCircle, FaCalendar, FaBullhorn, FaEnvelope, FaBook, FaBookOpen } from 'react-icons/fa'

const stats = [
  { id: 1, label: 'Church Community', value: 300 },
  { id: 2, label: 'Active Members', value: 359 },
  { id: 3, label: 'Years of Service', value: 138 },
]

interface Sermon {
  id: string
  title: string
  preacher: string
  bible_text: string
  date: string
  image_url?: string
  content: string
}

interface Event {
  id: string
  title: string
  date: string
  description: string
  location: string
  image_url?: string
}

interface Announcement {
  id: string
  title: string
  content: string
  priority: 'normal' | 'high' | 'urgent'
  date: string
}

export default function Home() {
  const [sermons, setSermons] = useState<Sermon[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [heroImage, setHeroImage] = useState('https://images.unsplash.com/photo-1438032005730-c779502df39b?w=1920&q=80')
  const [heroBibleText, setHeroBibleText] = useState('"Not by might, nor by power, but by my Spirit, says the Lord." — Zechariah 4:6 (NKJV)')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
    fetchHeroSettings()
  }, [])

  const fetchHeroSettings = async () => {
    try {
      const { getSiteSettings } = await import('@/lib/site-settings')
      const settings = await getSiteSettings()
      if (settings.hero_image_url) setHeroImage(settings.hero_image_url)
      if (settings.hero_bible_text) setHeroBibleText(settings.hero_bible_text)
    } catch (err) {
      console.error('Error fetching hero settings:', err)
    }
  }

  const fetchData = async () => {
    try {
      const supabase = createClient()

      // Fetch sermons
      const { data: sermonsData } = await supabase
        .from('sermons')
        .select('*')
        .order('date', { ascending: false })
        .limit(3)

      if (sermonsData) setSermons(sermonsData)

      // Fetch events
      const { data: eventsData } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true })
        .limit(3)

      if (eventsData) setEvents(eventsData)

      // Fetch announcements
      const { data: announcementsData } = await supabase
        .from('announcements')
        .select('*')
        .order('date', { ascending: false })
        .limit(3)

      if (announcementsData) setAnnouncements(announcementsData)
    } catch (err) {
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-red-500'
      case 'high': return 'border-orange-500'
      default: return 'border-church-gold'
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="font-serif">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${heroImage}')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70" />

        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10 py-16">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/10 backdrop-blur-sm rounded-2xl p-3 shadow-2xl ring-4 ring-white/30">
              <img
                src="/logo.png"
                alt="Ebenezer Baptist Church Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-2xl leading-tight">
            Welcome to<br />
            <span className="text-church-gold">Ebenezer Baptist Church</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl mb-6 italic text-white/90 drop-shadow-lg max-w-2xl mx-auto px-4">
            {heroBibleText}
          </p>

          <div className="flex flex-wrap justify-center items-center gap-3 px-4">
            <Link href="/give" className="bg-gradient-to-r from-church-gold to-church-gold-dark text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-sm sm:text-base hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
              Give Online
            </Link>
            <Link href="/sermons" className="bg-white text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-sm sm:text-base hover:bg-gray-100 transition shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              Watch Sermons
            </Link>
            <Link href="/enquire" className="bg-transparent border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-sm sm:text-base hover:bg-white hover:text-gray-900 transition hover:-translate-y-0.5">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {stats.map((stat) => {
              const iconMap: Record<string, React.ReactNode> = {
                'Church Community': <FaUsers className="w-10 h-10 sm:w-12 sm:h-12 text-church-gold" />,
                'Active Members': <FaUserCheck className="w-10 h-10 sm:w-12 sm:h-12 text-church-gold" />,
                'Years of Service': <FaCalendarAlt className="w-10 h-10 sm:w-12 sm:h-12 text-church-gold" />,
              }
              return (
                <div key={stat.id} className="group">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-church-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-church-gold/20 transition-colors">
                    {iconMap[stat.label] || <FaUsers className="w-10 h-10 sm:w-12 sm:h-12 text-church-gold" />}
                  </div>
                  <p className="text-4xl sm:text-5xl font-bold mb-2 text-church-gold">{stat.value}+</p>
                  <p className="text-lg text-gray-600">{stat.label}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Service Times Section */}
      <section className="py-20 bg-gradient-to-br from-church-blue via-[#2a5a8f] to-church-blue relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'radial-gradient(circle, #d4af37 1px, transparent 1px)', backgroundSize: '30px 30px'}} />

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-church-gold/20 backdrop-blur-sm rounded-full mb-4">
              <FaClock className="w-10 h-10 text-church-gold" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Join Us For Worship</h2>
            <p className="text-white/70 text-base max-w-xl mx-auto">Experience God&apos;s presence in our welcoming community</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-church-gold to-church-gold-dark rounded-xl mx-auto mb-4 shadow-lg">
                <FaBook className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white text-center mb-2">Sunday School</h3>
              <p className="text-2xl font-bold text-church-gold text-center">9:00 AM</p>
              <p className="text-white/60 text-sm text-center mt-2">Bible Study & Prayer</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ring-2 ring-church-gold/30 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-church-gold to-church-gold-dark text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">Main Service</span>
              </div>
              <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-church-gold to-church-gold-dark rounded-xl mx-auto mb-4 shadow-lg">
                <FaBookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white text-center mb-2">Main Worship</h3>
              <p className="text-2xl font-bold text-church-gold text-center">10:00 AM</p>
              <p className="text-white/60 text-sm text-center mt-2">Praise, Worship & Word</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl mx-auto mb-4 shadow-lg">
                <FaBook className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white text-center mb-2">Wednesday</h3>
              <p className="text-2xl font-bold text-church-gold text-center">6:00 PM</p>
              <p className="text-white/60 text-sm text-center mt-2">Bible Study</p>
            </div>
          </div>

          <div className="text-center mt-12 bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <FaMapMarkerAlt className="w-6 h-6 text-church-gold" />
              <p className="text-white/90 font-semibold">50A Campbell Street, Lagos Island, Lagos</p>
            </div>
            <a
              href="https://www.google.com/maps/place/Ebenezer+Baptist+Church/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-church-gold to-church-gold-dark text-white px-6 sm:px-8 py-3 rounded-lg font-bold hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 inline-block"
            >
              Get Directions
            </a>
          </div>
        </div>
      </section>

      {/* Latest Sermons Section */}
      <section className="py-20 bg-gradient-to-b from-white to-church-cream">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-church-gold/10 rounded-full mb-4">
              <FaPlayCircle className="w-10 h-10 text-church-gold" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-church-navy mb-3">Latest Sermons</h2>
            <p className="text-gray-600 max-w-xl mx-auto">Watch our latest sermons and grow in your faith</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading sermons...</p>
            </div>
          ) : sermons.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
              <div className="w-20 h-20 bg-church-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaPlayCircle className="w-12 h-12 text-church-gold" />
              </div>
              <h3 className="text-xl font-bold text-church-navy mb-3">Sermons Coming Soon</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">Our latest sermons will be available here soon. Check back or visit our YouTube channel for live services.</p>
              <Link href="/sermons" className="inline-flex items-center space-x-2 bg-gradient-to-r from-church-gold to-church-gold-dark text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all">
                <span>View All Sermons</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {sermons.map((sermon) => (
                <div key={sermon.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                  {sermon.image_url ? (
                    <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url('${sermon.image_url}')` }}>
                      <div className="h-full bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-church-gold/20 to-church-gold-dark/20 flex items-center justify-center">
                      <FaBookOpen className="w-16 h-16 text-church-gold/40" />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-church-navy mb-2 line-clamp-2">{sermon.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">👤 {sermon.preacher}</p>
                    <p className="text-xs text-church-gold mb-3">📖 {sermon.bible_text}</p>
                    <p className="text-xs text-gray-500 mb-4">📅 {formatDate(sermon.date)}</p>
                    <Link href={`/sermons/${sermon.id}`} className="inline-flex items-center space-x-2 text-church-blue font-bold hover:text-church-gold transition-colors">
                      <span>Read More</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {sermons.length > 0 && (
            <div className="text-center mt-10">
              <Link href="/sermons" className="inline-flex items-center space-x-2 bg-gradient-to-r from-church-gold to-church-gold-dark text-white px-8 py-3 rounded-lg font-bold hover:shadow-lg transition-all">
                <span>View All Sermons</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-20 bg-church-blue text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'radial-gradient(circle, #d4af37 1px, transparent 1px)', backgroundSize: '30px 30px'}} />

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-church-gold/20 rounded-full mb-4">
              <FaCalendar className="w-10 h-10 text-church-gold" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">Upcoming Events</h2>
            <p className="text-white/70 max-w-xl mx-auto">Stay connected with church activities and special occasions</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-white/70">Loading events...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg p-12 text-center border border-white/20">
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCalendar className="w-12 h-12 text-church-gold" />
              </div>
              <h3 className="text-xl font-bold mb-3">Events Coming Soon</h3>
              <p className="text-white/70 mb-6 max-w-md mx-auto">Upcoming events will be posted here. Stay tuned for announcements.</p>
              <Link href="/events" className="inline-flex items-center space-x-2 bg-gradient-to-r from-church-gold to-church-gold-dark text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all">
                <span>View All Events</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {events.map((event) => (
                <div key={event.id} className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden hover:bg-white/15 transition-all duration-300 hover:-translate-y-1 border border-white/20">
                  {event.image_url ? (
                    <div className="h-48 bg-cover bg-center relative" style={{ backgroundImage: `url('${event.image_url}')` }}>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      <div className="absolute bottom-4 left-4">
                        <span className="bg-church-gold text-white px-3 py-1 rounded-full text-sm font-bold">
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-church-gold/20 to-church-gold-dark/20 flex items-center justify-center relative">
                      <FaCalendar className="w-16 h-16 text-church-gold/40" />
                      <div className="absolute bottom-4 left-4">
                        <span className="bg-church-gold text-white px-3 py-1 rounded-full text-sm font-bold">
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{event.title}</h3>
                    <p className="text-sm text-white/70 mb-3 line-clamp-2">{event.description}</p>
                    <p className="text-xs text-white/60 mb-4">📍 {event.location}</p>
                    <Link href="/events" className="inline-flex items-center space-x-2 text-church-gold font-bold hover:text-white transition-colors">
                      <span>View Details</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {events.length > 0 && (
            <div className="text-center mt-10">
              <Link href="/events" className="inline-flex items-center space-x-2 bg-gradient-to-r from-church-gold to-church-gold-dark text-white px-8 py-3 rounded-lg font-bold hover:shadow-lg transition-all">
                <span>View All Events</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Announcements Section */}
      <section className="py-20 bg-gradient-to-b from-church-cream to-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-church-gold/10 rounded-full mb-4">
              <FaBullhorn className="w-10 h-10 text-church-gold" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-church-navy mb-3">Announcements</h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading announcements...</p>
            </div>
          ) : announcements.length === 0 ? (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-church-gold">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Midweek Worship Service</h3>
                <p className="text-gray-600">Midweek Worship Service holds every Wednesday at 6:00 PM. It is a time of praise, breaking of the word, and breakthrough prayers.</p>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {announcements.map((announcement) => (
                <div key={announcement.id} className={`bg-white rounded-xl p-6 shadow-md border-l-4 ${getPriorityColor(announcement.priority)} hover:shadow-lg transition-all duration-300`}>
                  {announcement.priority === 'urgent' && (
                    <span className="inline-block bg-red-500 text-white px-2 py-1 rounded text-xs font-bold mb-2">URGENT</span>
                  )}
                  {announcement.priority === 'high' && (
                    <span className="inline-block bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold mb-2">HIGH</span>
                  )}
                  <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{announcement.title}</h3>
                  <p className="text-gray-600 line-clamp-3">{announcement.content}</p>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link href="/announcements" className="text-church-blue font-bold hover:text-church-gold transition-colors inline-flex items-center">
              View All Announcements
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-br from-church-gold to-church-gold-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px'}} />

        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaEnvelope className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Contact Us</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Whether you&apos;re new to faith or looking for a church home, we&apos;d love to hear from you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/enquire/new-to-church" className="bg-white text-church-navy px-8 py-3 rounded-lg font-bold hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
              Get in Touch
            </Link>
            <Link href="/about" className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-church-gold transition-all duration-300 hover:-translate-y-0.5">
              Learn More About Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
