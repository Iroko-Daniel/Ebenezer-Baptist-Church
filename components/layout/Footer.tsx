'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FaFacebook, FaYoutube, FaInstagram } from 'react-icons/fa'
import { getSiteSettings, SiteSettings } from '@/lib/site-settings'

export default function Footer() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)

  useEffect(() => {
    const loadSettings = async () => {
      const siteSettings = await getSiteSettings()
      setSettings(siteSettings)
    }
    loadSettings()
  }, [])

  const serviceTimes = settings?.service_times || 'Sunday School: 9:00 AM | Main Service: 10:00 AM'
  const wednesdayService = settings?.wednesday_service || 'Wednesday Bible Study: 6:00 PM'
  
  // Parse service times
  const services = serviceTimes.split('|').map(s => s.trim())
  const wednesday = wednesdayService

  return (
    <footer className="bg-gradient-to-b from-[#1e3a5f] to-[#142840] text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}}></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top decorative border */}
        <div className="h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mb-12"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Church Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-14 h-14 bg-white rounded-lg p-1.5 shadow-lg flex-shrink-0">
                <img
                  src={settings?.logo_url || '/logo.png'}
                  alt={settings?.church_name || 'Ebenezer Baptist Church Logo'}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-sm md:text-base font-bold text-white leading-tight">
                  {settings?.church_name || 'Ebenezer Baptist Church'}
                </h3>
                <p className="text-[10px] md:text-xs text-[#d4af37] italic">
                  {settings?.church_tagline || 'A Place of Worship and Community'}
                </p>
              </div>
            </div>
            <p className="text-gray-300 text-sm mb-2 flex items-start">
              <svg className="w-4 h-4 mr-2 mt-0.5 text-[#d4af37] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-xs">{settings?.church_address || '50A Campbell Street, Lagos Island, Lagos'}</span>
            </p>
            <p className="text-gray-300 text-sm flex items-center">
              <svg className="w-4 h-4 mr-2 text-[#d4af37] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs">Founded: {settings?.founded_year || '1888'}</span>
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-bold mb-4 text-[#d4af37]">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-300 hover:text-white transition-colors text-sm">Home</Link></li>
              <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors text-sm">About Us</Link></li>
              <li><Link href="/sermons" className="text-gray-300 hover:text-white transition-colors text-sm">Sermons</Link></li>
              <li><Link href="/events" className="text-gray-300 hover:text-white transition-colors text-sm">Events</Link></li>
              <li><Link href="/give" className="text-gray-300 hover:text-white transition-colors text-sm">Give Now</Link></li>
            </ul>
          </div>

          {/* Service Times */}
          <div>
            <h4 className="text-base font-bold mb-4 text-[#d4af37]">Service Times</h4>
            <ul className="space-y-3 text-gray-300 text-xs">
              {services.map((service, idx) => (
                <li key={idx} className="flex items-center">
                  <span className="w-2 h-2 bg-[#d4af37] rounded-full mr-3 flex-shrink-0"></span>
                  {service}
                </li>
              ))}
              {wednesday && (
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[#d4af37] rounded-full mr-3 flex-shrink-0"></span>
                  {wednesday}
                </li>
              )}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-base font-bold mb-4 text-[#d4af37]">Follow Us</h4>
            <p className="text-gray-300 text-xs mb-4">Stay connected with our church community</p>
            <div className="flex space-x-3">
              {settings?.facebook_url && (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-[#d4af37] transition-all duration-300 hover:scale-110"
                >
                  <FaFacebook size={18} />
                </a>
              )}
              {settings?.youtube_url && (
                <a
                  href={settings.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-[#d4af37] transition-all duration-300 hover:scale-110"
                >
                  <FaYoutube size={18} />
                </a>
              )}
              {settings?.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-[#d4af37] transition-all duration-300 hover:scale-110"
                >
                  <FaInstagram size={18} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-[#d4af37] italic text-base mb-2">"{settings?.church_motto || '...led by the Spirit of God'}"</p>
          <p className="text-gray-400 text-xs">&copy; {new Date().getFullYear()} {settings?.church_name || 'Ebenezer Baptist Church'}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
