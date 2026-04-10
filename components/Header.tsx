'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [aboutDropdown, setAboutDropdown] = useState(false)
  const [mediaDropdown, setMediaDropdown] = useState(false)
  const [enquireDropdown, setEnquireDropdown] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const aboutTimerRef = useRef<NodeJS.Timeout | null>(null)
  const mediaTimerRef = useRef<NodeJS.Timeout | null>(null)
  const enquireTimerRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = (setter: React.Dispatch<React.SetStateAction<boolean>>, timerRef: React.MutableRefObject<NodeJS.Timeout | null>) => {
    timerRef.current = setTimeout(() => setter(true), 500)
  }

  const handleMouseLeave = (setter: React.Dispatch<React.SetStateAction<boolean>>, timerRef: React.MutableRefObject<NodeJS.Timeout | null>) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    setter(false)
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 bg-[#070f1a] ${scrolled ? 'shadow-lg' : 'shadow-md'} border-b border-church-gold/30`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 sm:py-4">
          {/* Logo and Church Name */}
          <Link href="/" className="group flex items-center space-x-3">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 bg-gradient-to-br from-church-gold via-yellow-500 to-church-gold rounded-xl shadow-lg group-hover:shadow-[0_0_15px_rgba(212,175,55,0.5)] transition-all duration-300 transform group-hover:scale-105"></div>
              <div className="absolute inset-[3px] bg-church-blue rounded-lg flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="Ebenezer Baptist Church Logo"
                  className="w-full h-full object-contain p-1"
                />
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm lg:text-base font-bold text-white tracking-wide leading-tight">
                Ebenezer Baptist Church
              </h1>
              <p className="text-[10px] lg:text-xs text-church-gold font-medium tracking-wider leading-tight">
                A Place of Worship and Community
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link href="/" className="text-white/90 hover:text-church-gold font-medium transition-colors text-sm relative group">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-church-gold group-hover:w-full transition-all duration-300"></span>
            </Link>

            {/* About Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter(setAboutDropdown, aboutTimerRef)}
              onMouseLeave={() => handleMouseLeave(setAboutDropdown, aboutTimerRef)}
            >
              <button
                className="text-white/90 hover:text-church-gold font-medium flex items-center transition-colors text-sm relative group"
              >
                About
                <svg className={`ml-1 w-3 h-3 transition-transform duration-300 ${aboutDropdown ? 'rotate-180' : 'group-hover:rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-church-gold group-hover:w-full transition-all duration-300"></span>
              </button>
              {aboutDropdown && (
                <div className="absolute top-full left-0 mt-2 bg-white shadow-xl rounded-lg py-2 min-w-[200px] border-t-2 border-church-gold z-50">
                  <Link href="/about#history" className="block px-4 py-2 text-sm text-gray-700 hover:bg-church-cream hover:text-church-blue transition-colors">Our History</Link>
                  <Link href="/about#mission-vision" className="block px-4 py-2 text-sm text-gray-700 hover:bg-church-cream hover:text-church-blue transition-colors">Mission & Vision</Link>
                  <Link href="/about/executives" className="block px-4 py-2 text-sm text-gray-700 hover:bg-church-cream hover:text-church-blue transition-colors">Executives</Link>
                </div>
              )}
            </div>

            {/* Media Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter(setMediaDropdown, mediaTimerRef)}
              onMouseLeave={() => handleMouseLeave(setMediaDropdown, mediaTimerRef)}
            >
              <button
                className="text-white/90 hover:text-church-gold font-medium flex items-center transition-colors text-sm relative group"
              >
                Media
                <svg className={`ml-1 w-3 h-3 transition-transform duration-300 ${mediaDropdown ? 'rotate-180' : 'group-hover:rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-church-gold group-hover:w-full transition-all duration-300"></span>
              </button>
              {mediaDropdown && (
                <div className="absolute top-full left-0 mt-2 bg-white shadow-xl rounded-lg py-2 min-w-[180px] border-t-2 border-church-gold z-50">
                  <Link href="/sermons" className="block px-4 py-2 text-sm text-gray-700 hover:bg-church-cream hover:text-church-blue transition-colors">Sermons</Link>
                  <Link href="/events" className="block px-4 py-2 text-sm text-gray-700 hover:bg-church-cream hover:text-church-blue transition-colors">Events</Link>
                  <Link href="/gallery" className="block px-4 py-2 text-sm text-gray-700 hover:bg-church-cream hover:text-church-blue transition-colors">Gallery</Link>
                  <Link href="/livestream" className="block px-4 py-2 text-sm text-gray-700 hover:bg-church-cream hover:text-church-blue transition-colors">Livestream</Link>
                </div>
              )}
            </div>

            <Link href="/announcements" className="text-white/90 hover:text-church-gold font-medium transition-colors text-sm relative group">
              Announcements
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-church-gold group-hover:w-full transition-all duration-300"></span>
            </Link>

            {/* Enquire Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter(setEnquireDropdown, enquireTimerRef)}
              onMouseLeave={() => handleMouseLeave(setEnquireDropdown, enquireTimerRef)}
            >
              <button
                className="text-white/90 hover:text-church-gold font-medium flex items-center transition-colors text-sm relative group"
              >
                Enquire
                <svg className={`ml-1 w-3 h-3 transition-transform duration-300 ${enquireDropdown ? 'rotate-180' : 'group-hover:rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-church-gold group-hover:w-full transition-all duration-300"></span>
              </button>
              {enquireDropdown && (
                <div className="absolute top-full left-0 mt-2 bg-white shadow-xl rounded-lg py-2 min-w-[220px] border-t-2 border-church-gold z-50">
                  <Link href="/enquire/new-to-church" className="block px-4 py-2 text-sm text-gray-700 hover:bg-church-cream hover:text-church-blue transition-colors">New to Church</Link>
                  <Link href="/enquire/counselling" className="block px-4 py-2 text-sm text-gray-700 hover:bg-church-cream hover:text-church-blue transition-colors">Counselling</Link>
                  <Link href="/enquire/getting-married" className="block px-4 py-2 text-sm text-gray-700 hover:bg-church-cream hover:text-church-blue transition-colors">Getting Married</Link>
                  <Link href="/enquire/child-dedication" className="block px-4 py-2 text-sm text-gray-700 hover:bg-church-cream hover:text-church-blue transition-colors">Child Dedication</Link>
                  <Link href="/enquire/prayer-requests" className="block px-4 py-2 text-sm text-gray-700 hover:bg-church-cream hover:text-church-blue transition-colors">Prayer Requests</Link>
                  <Link href="/enquire/testimonies" className="block px-4 py-2 text-sm text-gray-700 hover:bg-church-cream hover:text-church-blue transition-colors">Testimonies</Link>
                </div>
              )}
            </div>

            <Link href="/branches" className="text-white/90 hover:text-church-gold font-medium transition-colors text-sm relative group">
              Branches
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-church-gold group-hover:w-full transition-all duration-300"></span>
            </Link>

            <Link href="/give" className="bg-gradient-to-r from-[#d4af37] to-[#c9941a] text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:shadow-xl transition-all duration-300 ring-2 ring-[#d4af37]/30 hover:ring-[#d4af37]/50">
              Give Now
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white hover:text-church-gold transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 border-t border-white/10 pt-4">
            <nav className="flex flex-col space-y-2">
              <Link href="/" className="text-white hover:text-church-gold py-2 transition-colors" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <div className="pl-4 border-l-2 border-white/10">
                <Link href="/about#history" className="text-white/80 hover:text-church-gold py-2 block transition-colors" onClick={() => setMobileMenuOpen(false)}>Our History</Link>
                <Link href="/about#mission-vision" className="text-white/80 hover:text-church-gold py-2 block transition-colors" onClick={() => setMobileMenuOpen(false)}>Mission & Vision</Link>
                <Link href="/about/executives" className="text-white/80 hover:text-church-gold py-2 block transition-colors" onClick={() => setMobileMenuOpen(false)}>Executives</Link>
              </div>
              <Link href="/sermons" className="text-white/80 hover:text-church-gold py-2 transition-colors" onClick={() => setMobileMenuOpen(false)}>Sermons</Link>
              <Link href="/events" className="text-white/80 hover:text-church-gold py-2 transition-colors" onClick={() => setMobileMenuOpen(false)}>Events</Link>
              <Link href="/gallery" className="text-white/80 hover:text-church-gold py-2 transition-colors" onClick={() => setMobileMenuOpen(false)}>Gallery</Link>
              <Link href="/announcements" className="text-white/80 hover:text-church-gold py-2 transition-colors" onClick={() => setMobileMenuOpen(false)}>Announcements</Link>
              <Link href="/enquire" className="text-white/80 hover:text-church-gold py-2 transition-colors" onClick={() => setMobileMenuOpen(false)}>Enquire</Link>
              <Link href="/enquire#new" className="text-white/80 hover:text-church-gold py-2 pl-4 transition-colors" onClick={() => setMobileMenuOpen(false)}>New to Church</Link>
              <Link href="/enquire#counselling" className="text-white/80 hover:text-church-gold py-2 pl-4 transition-colors" onClick={() => setMobileMenuOpen(false)}>Counselling</Link>
              <Link href="/enquire#getting-married" className="text-white/80 hover:text-church-gold py-2 pl-4 transition-colors" onClick={() => setMobileMenuOpen(false)}>Getting Married</Link>
              <Link href="/enquire#child-dedication" className="text-white/80 hover:text-church-gold py-2 pl-4 transition-colors" onClick={() => setMobileMenuOpen(false)}>Child Dedication</Link>
              <Link href="/enquire#prayer" className="text-white/80 hover:text-church-gold py-2 pl-4 transition-colors" onClick={() => setMobileMenuOpen(false)}>Prayer Requests</Link>
              <Link href="/enquire#testimonies" className="text-white/80 hover:text-church-gold py-2 pl-4 transition-colors" onClick={() => setMobileMenuOpen(false)}>Testimonies</Link>
              <Link href="/branches" className="text-white/80 hover:text-church-gold py-2 transition-colors" onClick={() => setMobileMenuOpen(false)}>Branches</Link>
              <Link href="/give" className="bg-gradient-to-r from-[#d4af37] to-[#c9941a] text-white px-4 py-3 rounded-lg font-bold text-center mt-2 shadow-md ring-2 ring-[#d4af37]/30" onClick={() => setMobileMenuOpen(false)}>Give Now</Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
