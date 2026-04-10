'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { getSiteSettings, SiteSettings } from '@/lib/site-settings'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [aboutDropdown, setAboutDropdown] = useState(false)
  const [mediaDropdown, setMediaDropdown] = useState(false)
  const [enquireDropdown, setEnquireDropdown] = useState(false)
  const [mobileAboutExpanded, setMobileAboutExpanded] = useState(false)
  const [mobileMediaExpanded, setMobileMediaExpanded] = useState(false)
  const [mobileEnquireExpanded, setMobileEnquireExpanded] = useState(false)
  const [newEnquiryCount, setNewEnquiryCount] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [dropdownTimers, setDropdownTimers] = useState<Record<string, NodeJS.Timeout | null>>({
    about: null,
    media: null,
    enquire: null
  })

  const openDropdown = (name: 'about' | 'media' | 'enquire') => {
    // Clear any pending close timer
    if (dropdownTimers[name]) {
      clearTimeout(dropdownTimers[name]!)
      setDropdownTimers(prev => ({ ...prev, [name]: null }))
    }
    
    if (name === 'about') setAboutDropdown(true)
    else if (name === 'media') setMediaDropdown(true)
    else if (name === 'enquire') setEnquireDropdown(true)
  }

  const closeDropdown = (name: 'about' | 'media' | 'enquire') => {
    // Set a 0.1-second delay before closing
    const timer = setTimeout(() => {
      if (name === 'about') setAboutDropdown(false)
      else if (name === 'media') setMediaDropdown(false)
      else if (name === 'enquire') setEnquireDropdown(false)
      setDropdownTimers(prev => ({ ...prev, [name]: null }))
    }, 100)
    
    setDropdownTimers(prev => ({ ...prev, [name]: timer }))
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const loadSettings = async () => {
      const siteSettings = await getSiteSettings()
      setSettings(siteSettings)
    }
    loadSettings()
  }, [])

  useEffect(() => {
    const checkNewEnquiries = async () => {
      // Check if Supabase credentials are configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        return
      }

      try {
        const supabase = createClient()
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

        const { count, error } = await supabase
          .from('enquiries')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', twentyFourHoursAgo)

        if (!error && count) {
          setNewEnquiryCount(count)
        }
      } catch (err) {
        // Silently fail
      }
    }

    checkNewEnquiries()
    const interval = setInterval(checkNewEnquiries, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-[#1a2d47] via-[#1e3a5f] to-[#1a2d47] shadow-lg border-b border-[#d4af37]/30">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center py-2.5 sm:py-3">
          {/* Logo + Church Name - Left Side */}
          <Link href="/" className="group flex items-center space-x-2.5 sm:space-x-3">
            <div className="relative w-11 h-11 sm:w-12 sm:h-12">
              <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37] via-[#e6b800] to-[#d4af37] rounded-xl shadow-lg group-hover:shadow-[0_0_15px_rgba(212,175,55,0.5)] transition-all duration-300 transform group-hover:scale-105"></div>
              <div className="absolute inset-[3px] bg-[#1e3a5f] rounded-lg flex items-center justify-center">
                <img 
                  src={settings?.logo_url || '/logo.png'} 
                  alt={settings?.church_name || 'Church Logo'} 
                  className="w-full h-full object-contain p-1" 
                />
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm lg:text-base font-bold text-white tracking-wide leading-tight">
                {settings?.church_name || 'Ebenezer Baptist Church'}
              </h1>
              <p className="text-[9px] lg:text-[10px] text-[#d4af37] font-medium tracking-wider leading-tight">
                {settings?.church_tagline || 'A Place of Worship and Community'}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link href="/" className="text-white/90 hover:text-[#d4af37] font-medium transition-colors text-sm relative group/nav-link pb-1">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#d4af37] group-hover/nav-link:w-full transition-all duration-300 ease-out"></span>
            </Link>

            {/* About Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => openDropdown('about')}
              onMouseLeave={() => closeDropdown('about')}
            >
              <button 
                className="text-white/90 hover:text-[#d4af37] font-medium flex items-center transition-colors text-sm relative group/nav-item pb-1"
                onClick={() => setAboutDropdown(!aboutDropdown)}
              >
                About 
                <svg 
                  className={`ml-1 w-3 h-3 transition-transform duration-300 ${aboutDropdown ? 'rotate-180' : 'group-hover/nav-item:rotate-180'}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#d4af37] group-hover/nav-item:w-full transition-all duration-300 ease-out"></span>
              </button>
              {aboutDropdown && (
                <div className="absolute top-full left-0 mt-2 bg-white shadow-xl rounded-lg py-2 min-w-[200px] border-t-2 border-[#d4af37] z-50">
                  <Link href="/about#history" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#faf8f5] hover:text-[#1e3a5f] transition-colors">Our History</Link>
                  <Link href="/about#mission-vision" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#faf8f5] hover:text-[#1e3a5f] transition-colors">Mission, Vision & Values</Link>
                  <Link href="/about/executives" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#faf8f5] hover:text-[#1e3a5f] transition-colors">Our Executives</Link>
                </div>
              )}
            </div>

            {/* Media Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => openDropdown('media')}
              onMouseLeave={() => closeDropdown('media')}
            >
              <button 
                className="text-white/90 hover:text-[#d4af37] font-medium flex items-center transition-colors text-sm relative group/nav-item pb-1"
                onClick={() => setMediaDropdown(!mediaDropdown)}
              >
                Media 
                <svg 
                  className={`ml-1 w-3 h-3 transition-transform duration-300 ${mediaDropdown ? 'rotate-180' : 'group-hover/nav-item:rotate-180'}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#d4af37] group-hover/nav-item:w-full transition-all duration-300 ease-out"></span>
              </button>
              {mediaDropdown && (
                <div className="absolute top-full left-0 mt-2 bg-white shadow-xl rounded-lg py-2 min-w-[180px] border-t-2 border-[#d4af37] z-50">
                  <Link href="/sermons" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#faf8f5] hover:text-[#1e3a5f] transition-colors">Sermons</Link>
                  <Link href="/events" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#faf8f5] hover:text-[#1e3a5f] transition-colors">Events</Link>
                  <Link href="/gallery" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#faf8f5] hover:text-[#1e3a5f] transition-colors">Gallery</Link>
                  <Link href="/livestream" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#faf8f5] hover:text-[#1e3a5f] transition-colors">Livestream</Link>
                </div>
              )}
            </div>

            {/* Announcements */}
            <Link href="/announcements" className="text-white/90 hover:text-[#d4af37] font-medium transition-colors text-sm relative group/nav-link pb-1">
              Announcements
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#d4af37] group-hover/nav-link:w-full transition-all duration-300 ease-out"></span>
            </Link>

            {/* Enquire Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => openDropdown('enquire')}
              onMouseLeave={() => closeDropdown('enquire')}
            >
              <button 
                className="text-white/90 hover:text-[#d4af37] font-medium flex items-center transition-colors text-sm relative group/nav-item pb-1"
                onClick={() => setEnquireDropdown(!enquireDropdown)}
              >
                Enquire 
                <svg 
                  className={`ml-1 w-3 h-3 transition-transform duration-300 ${enquireDropdown ? 'rotate-180' : 'group-hover/nav-item:rotate-180'}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#d4af37] group-hover/nav-item:w-full transition-all duration-300 ease-out"></span>
              </button>
              {enquireDropdown && (
                <div className="absolute top-full left-0 mt-2 bg-white shadow-xl rounded-lg py-2 min-w-[200px] border-t-2 border-[#d4af37] z-50">
                  <Link href="/enquire/new-to-church" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#faf8f5] hover:text-[#1e3a5f] transition-colors">New to Church</Link>
                  <Link href="/enquire/counselling" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#faf8f5] hover:text-[#1e3a5f] transition-colors">Counselling</Link>
                  <Link href="/enquire/getting-married" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#faf8f5] hover:text-[#1e3a5f] transition-colors">Getting Married</Link>
                  <Link href="/enquire/child-dedication" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#faf8f5] hover:text-[#1e3a5f] transition-colors">Child Dedication</Link>
                  <Link href="/enquire/prayer-requests" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#faf8f5] hover:text-[#1e3a5f] transition-colors">Prayer Requests</Link>
                  <Link href="/enquire/testimonies" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#faf8f5] hover:text-[#1e3a5f] transition-colors">Testimonies</Link>
                </div>
              )}
            </div>

            <Link href="/branches" className="text-white/90 hover:text-[#d4af37] font-medium transition-colors text-sm relative group/nav-link pb-1">
              Branches
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#d4af37] group-hover/nav-link:w-full transition-all duration-300 ease-out"></span>
            </Link>

            {/* Give Now Button */}
            <Link href="/give" className="give-now-btn text-sm px-5 py-2">
              Give Now
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white hover:text-[#d4af37] transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="lg:hidden pb-3 border-t border-white/10 pt-3">
            <nav className="flex flex-col space-y-1">
              <Link href="/" className="text-white hover:text-[#d4af37] py-2 transition-colors text-sm" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              
              {/* About - Collapsed by default */}
              <div>
                <button
                  onClick={() => setMobileAboutExpanded(!mobileAboutExpanded)}
                  className="w-full flex items-center justify-between text-white hover:text-[#d4af37] py-2 transition-colors text-sm"
                >
                  About
                  <svg
                    className={`w-3 h-3 transition-transform duration-300 ${mobileAboutExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {mobileAboutExpanded && (
                  <div className="pl-4 border-l-2 border-white/10 mt-1 space-y-1">
                    <Link href="/about#history" className="block text-white/80 hover:text-[#d4af37] py-1.5 transition-colors text-sm" onClick={() => setMobileMenuOpen(false)}>Our History</Link>
                    <Link href="/about#mission-vision" className="block text-white/80 hover:text-[#d4af37] py-1.5 transition-colors text-sm" onClick={() => setMobileMenuOpen(false)}>Mission, Vision & Values</Link>
                    <Link href="/about/executives" className="block text-white/80 hover:text-[#d4af37] py-1.5 transition-colors text-sm" onClick={() => setMobileMenuOpen(false)}>Executives</Link>
                  </div>
                )}
              </div>

              {/* Media - Collapsed by default */}
              <div>
                <button
                  onClick={() => setMobileMediaExpanded(!mobileMediaExpanded)}
                  className="w-full flex items-center justify-between text-white hover:text-[#d4af37] py-2 transition-colors text-sm"
                >
                  Media
                  <svg
                    className={`w-3 h-3 transition-transform duration-300 ${mobileMediaExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {mobileMediaExpanded && (
                  <div className="pl-4 border-l-2 border-white/10 mt-1 space-y-1">
                    <Link href="/sermons" className="block text-white/80 hover:text-[#d4af37] py-1.5 transition-colors text-sm" onClick={() => setMobileMenuOpen(false)}>Sermons</Link>
                    <Link href="/events" className="block text-white/80 hover:text-[#d4af37] py-1.5 transition-colors text-sm" onClick={() => setMobileMenuOpen(false)}>Events</Link>
                    <Link href="/gallery" className="block text-white/80 hover:text-[#d4af37] py-1.5 transition-colors text-sm" onClick={() => setMobileMenuOpen(false)}>Gallery</Link>
                    <Link href="/livestream" className="block text-white/80 hover:text-[#d4af37] py-1.5 transition-colors text-sm" onClick={() => setMobileMenuOpen(false)}>Livestream</Link>
                  </div>
                )}
              </div>

              <Link href="/announcements" className="text-white hover:text-[#d4af37] py-2 transition-colors text-sm" onClick={() => setMobileMenuOpen(false)}>Announcements</Link>

              {/* Enquire - Collapsed by default */}
              <div>
                <button
                  onClick={() => setMobileEnquireExpanded(!mobileEnquireExpanded)}
                  className="w-full flex items-center justify-between text-white hover:text-[#d4af37] py-2 transition-colors text-sm"
                >
                  Enquire
                  <svg
                    className={`w-3 h-3 transition-transform duration-300 ${mobileEnquireExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {mobileEnquireExpanded && (
                  <div className="pl-4 border-l-2 border-white/10 mt-1 space-y-1">
                    <Link href="/enquire/new-to-church" className="block text-white/80 hover:text-[#d4af37] py-1.5 transition-colors text-sm" onClick={() => setMobileMenuOpen(false)}>New to Church</Link>
                    <Link href="/enquire/counselling" className="block text-white/80 hover:text-[#d4af37] py-1.5 transition-colors text-sm" onClick={() => setMobileMenuOpen(false)}>Counselling</Link>
                    <Link href="/enquire/getting-married" className="block text-white/80 hover:text-[#d4af37] py-1.5 transition-colors text-sm" onClick={() => setMobileMenuOpen(false)}>Getting Married</Link>
                    <Link href="/enquire/child-dedication" className="block text-white/80 hover:text-[#d4af37] py-1.5 transition-colors text-sm" onClick={() => setMobileMenuOpen(false)}>Child Dedication</Link>
                    <Link href="/enquire/prayer-requests" className="block text-white/80 hover:text-[#d4af37] py-1.5 transition-colors text-sm" onClick={() => setMobileMenuOpen(false)}>Prayer Requests</Link>
                    <Link href="/enquire/testimonies" className="block text-white/80 hover:text-[#d4af37] py-1.5 transition-colors text-sm" onClick={() => setMobileMenuOpen(false)}>Testimonies</Link>
                  </div>
                )}
              </div>

              <Link href="/branches" className="text-white hover:text-[#d4af37] py-2 transition-colors text-sm" onClick={() => setMobileMenuOpen(false)}>Branches</Link>
              <Link href="/give" className="give-now-btn text-center py-2 mt-1 text-sm" onClick={() => setMobileMenuOpen(false)}>Give Now</Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
