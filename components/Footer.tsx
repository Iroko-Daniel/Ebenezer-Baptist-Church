'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  const currentYear = new Date().getFullYear()

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
            <div className="flex space-x-4">
              {/* Facebook */}
              <a
                href="https://www.facebook.com/ebenezerbclagos50A/"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
                aria-label="Facebook"
              >
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-church-gold transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                  <svg className="w-6 h-6 text-[#1877F2] group-hover:text-church-navy" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </div>
              </a>
              {/* YouTube */}
              <a
                href="https://www.youtube.com/@ebenezerbaptistchurch2246"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
                aria-label="YouTube"
              >
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-church-gold transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                  <svg className="w-6 h-6 text-[#FF0000] group-hover:text-church-navy" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </div>
              </a>
              {/* Instagram */}
              <a
                href="https://www.instagram.com/ebenezerbclagos/"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
                aria-label="Instagram"
              >
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-church-gold transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                  <svg className="w-6 h-6 text-[#E4405F] group-hover:text-church-navy" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </div>
              </a>
            </div>
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
