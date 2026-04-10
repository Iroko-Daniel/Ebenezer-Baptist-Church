'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { FaFacebook, FaYoutube, FaInstagram, FaTwitter, FaTiktok, FaTelegram, FaWhatsapp, FaGlobe } from 'react-icons/fa'

interface SocialLink {
  id: string
  name: string
  url: string
  icon: string
  sort_order: number
}

const iconMap: Record<string, React.ElementType> = {
  facebook: FaFacebook,
  youtube: FaYoutube,
  instagram: FaInstagram,
  twitter: FaTwitter,
  tiktok: FaTiktok,
  telegram: FaTelegram,
  whatsapp: FaWhatsapp,
  globe: FaGlobe,
}

const defaultColors: Record<string, string> = {
  facebook: '#1877F2',
  youtube: '#FF0000',
  instagram: '#E4405F',
  twitter: '#1DA1F2',
  tiktok: '#000000',
  telegram: '#0088cc',
  whatsapp: '#25D366',
  globe: '#d4af37',
}

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSocialLinks()
  }, [])

  const fetchSocialLinks = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      if (data && !error) {
        // Deduplicate by icon name (keep first occurrence)
        const seen = new Set<string>()
        const uniqueLinks = data.filter(link => {
          if (seen.has(link.icon)) return false
          seen.add(link.icon)
          return true
        })
        setSocialLinks(uniqueLinks)
      }
    } catch (err) {
      console.error('Error fetching social links:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <footer className="bg-[#070f1a] text-white relative overflow-hidden">
      {/* Decorative top border */}
      <div className="h-1 bg-gradient-to-r from-transparent via-church-gold to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Church Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-14 h-14 bg-white rounded-lg p-2 flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt="Ebenezer Baptist Church Logo"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-base font-bold text-white leading-tight">
                  Ebenezer Baptist Church
                </h3>
                <p className="text-xs text-church-gold italic">A Place of Worship and Community</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm mb-2 flex items-start">
              <svg className="w-4 h-4 mr-2 mt-0.5 text-church-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-xs">50A Campbell Street, Marina, Lagos Island</span>
            </p>
            <a
              href="https://www.google.com/maps/place/Ebenezer+Baptist+Church/@6.4385866,3.3935383,13.04z/data=!4m6!3m5!1s0x103b8b174e1aaaab:0x2c829a820450e9a1!8m2!3d6.4504649!4d3.3946866!16s%2Fg%2F11sscs36yk?entry=ttu&g_ep=EgoyMDI2MDMyNC4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 bg-church-gold text-church-navy text-xs font-bold px-4 py-2 rounded-lg hover:bg-church-gold-dark transition-all duration-300 hover:-translate-y-0.5"
            >
              📍 View on Google Maps
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-bold mb-4 text-church-gold">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-300 hover:text-church-gold transition-colors text-sm">About Us</Link></li>
              <li><Link href="/sermons" className="text-gray-300 hover:text-church-gold transition-colors text-sm">Sermons</Link></li>
              <li><Link href="/events" className="text-gray-300 hover:text-church-gold transition-colors text-sm">Events</Link></li>
              <li><Link href="/give" className="text-gray-300 hover:text-church-gold transition-colors text-sm">Give Online</Link></li>
              <li><Link href="/enquire" className="text-gray-300 hover:text-church-gold transition-colors text-sm">Contact Us</Link></li>
            </ul>
          </div>

          {/* Service Times */}
          <div>
            <h4 className="text-base font-bold mb-4 text-church-gold">Service Times</h4>
            <ul className="space-y-3 text-gray-300 text-sm">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-church-gold rounded-full mr-3 mt-1.5 flex-shrink-0"></span>
                <span><strong>Sunday School:</strong> 9:00 AM</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-church-gold rounded-full mr-3 mt-1.5 flex-shrink-0"></span>
                <span><strong>Main Service:</strong> 10:00 AM</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-church-gold rounded-full mr-3 mt-1.5 flex-shrink-0"></span>
                <span><strong>Wednesday Bible Study:</strong> 6:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h4 className="text-base font-bold mb-4 text-church-gold">Follow Us</h4>
            {!loading && socialLinks.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((link) => {
                  const Icon = iconMap[link.icon] || FaGlobe
                  const color = defaultColors[link.icon] || '#d4af37'
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group"
                      aria-label={link.name}
                      title={link.name}
                    >
                      <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-church-gold transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                        <Icon className="w-6 h-6" style={{ color }} />
                      </div>
                    </a>
                  )
                })}
              </div>
            ) : (
              /* Fallback hardcoded links */
              <div className="flex space-x-4">
                <a href="https://www.facebook.com/ebenezerbclagos50A/" target="_blank" rel="noopener noreferrer" className="group" aria-label="Facebook">
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-church-gold transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                    <FaFacebook className="w-6 h-6 text-[#1877F2]" />
                  </div>
                </a>
                <a href="https://www.youtube.com/@ebenezerbaptistchurch2246" target="_blank" rel="noopener noreferrer" className="group" aria-label="YouTube">
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-church-gold transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                    <FaYoutube className="w-6 h-6 text-[#FF0000]" />
                  </div>
                </a>
                <a href="https://www.instagram.com/ebenezerbclagos/" target="_blank" rel="noopener noreferrer" className="group" aria-label="Instagram">
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-church-gold transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                    <FaInstagram className="w-6 h-6 text-[#E4405F]" />
                  </div>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-church-gold italic text-sm mb-2">&ldquo;Not by might, nor by power, but by my Spirit, says the Lord.&rdquo; — Zechariah 4:6</p>
          <p className="text-gray-400 text-xs">&copy; {currentYear} Ebenezer Baptist Church. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
