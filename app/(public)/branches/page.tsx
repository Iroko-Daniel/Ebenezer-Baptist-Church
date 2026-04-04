'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function Branches() {
  const [branches, setBranches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchBranches() }, [])

  const fetchBranches = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('branches').select('*').order('name')
    if (data) setBranches(data)
    setLoading(false)
  }

  return (
    <div>
      <section className="relative py-8 sm:py-10 text-white overflow-hidden bg-gradient-to-b from-[#1e3a5f] to-[#2a5a8f]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Our Branches</h1>
            <p className="text-sm sm:text-base text-white/80">Visit any of our convenient locations</p>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-12 bg-gradient-to-b from-white to-[#fef9f3]">
        <div className="container mx-auto px-4 sm:px-6">
          {loading ? (
            <p className="text-center text-gray-500 py-12">Loading branches...</p>
          ) : branches.length === 0 ? (
            <p className="text-center text-gray-500 py-12">No branches yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
              {branches.map((branch, index) => (
                <div key={branch.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="h-40 sm:h-48 bg-gradient-to-br from-[#1e3a5f] to-[#2a5a8f] flex items-center justify-center">
                    <svg className="w-16 h-16 sm:w-20 sm:h-20 text-[#d4af37] opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="p-5 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold mb-3 text-gray-900">{branch.name}</h3>
                    <div className="space-y-3 text-sm sm:text-base text-gray-700">
                      <div className="flex items-start space-x-2">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#d4af37] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <div><p className="font-semibold text-gray-900 mb-1">Address</p><p>{branch.address}<br />{branch.city}</p></div>
                      </div>
                      {branch.phone && (
                        <div className="flex items-start space-x-2">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#d4af37] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <div><p className="font-semibold text-gray-900 mb-1">Phone</p><p>{branch.phone}</p></div>
                        </div>
                      )}
                      <div className="flex items-start space-x-2">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#d4af37] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div><p className="font-semibold text-gray-900 mb-1">Service Times</p><p>{branch.service_times}</p></div>
                      </div>
                    </div>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.address + ' ' + branch.city)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 block text-center bg-gradient-to-r from-[#1e3a5f] to-[#2a5a8f] text-white px-5 py-3 rounded-lg font-semibold hover:from-[#2a5a8f] hover:to-[#1e3a5f] transition shadow-md text-sm sm:text-base"
                    >
                      Get Directions
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
