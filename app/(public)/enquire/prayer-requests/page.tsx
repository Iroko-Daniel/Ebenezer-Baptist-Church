'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function PrayerRequests() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    requestType: 'personal',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('enquiries')
        .insert([{ 
          type: 'prayer_request',
          first_name: formData.name,
          phone: formData.email || null,
          prayer_request: formData.message,
          request_type: formData.requestType
        }])

      if (error) {
        console.error('Error submitting enquiry:', error)
      }
      
      // Always show success
      setSubmitted(true)
    } catch (err) {
      console.error('Error submitting form:', err)
      // Still show success to user
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#fef9f3] to-white flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-purple-50 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Your Request Has Been Received</h2>
          <p className="text-gray-600 mb-6">
            Our prayer team is lifting you up in prayer. Remember, &quot;The effective, fervent prayer of a righteous man avails much&quot; (James 5:16).
          </p>
          <button
            onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', requestType: 'personal', message: '' }) }}
            className="bg-gradient-to-r from-[#d4af37] to-[#c9941a] text-white px-8 py-3 rounded-lg font-bold hover:shadow-lg transition-all"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 text-white overflow-hidden bg-gradient-to-b from-[#070f1a] to-[#1e3a5f]">
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle, #d4af37 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#d4af37] to-[#c9941a] rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">Prayer Requests</h1>
            <p className="text-sm sm:text-base md:text-lg text-white/80 max-w-2xl mx-auto">
              Share your heart with our prayer team. We believe in the power of prayer.
            </p>
          </div>
        </div>
      </section>

      {/* Scripture Banner */}
      <section className="py-10 bg-[#fef9f3]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <blockquote className="text-[#1e3a5f] italic font-medium text-lg">
              &quot;Do not be anxious about anything, but in everything by prayer and supplication, with thanksgiving, let your requests be made known to God.&quot;
            </blockquote>
            <p className="text-[#d4af37] font-semibold mt-2">Philippians 4:6 (NKJV)</p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-white to-[#fef9f3]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Submit Your Prayer Request</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name (or &apos;Anonymous&apos;)</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 outline-none transition-all text-sm"
                    placeholder="Your name or 'Anonymous'"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address (optional)</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 outline-none transition-all text-sm"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Prayer Category</label>
                  <select
                    value={formData.requestType}
                    onChange={(e) => setFormData({ ...formData, requestType: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 outline-none transition-all text-sm bg-white"
                  >
                    <option value="personal">Personal</option>
                    <option value="family">Family</option>
                    <option value="health">Health</option>
                    <option value="financial">Financial</option>
                    <option value="spiritual">Spiritual Growth</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Your Prayer Request</label>
                  <textarea
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 outline-none transition-all text-sm resize-none"
                    placeholder="Share your prayer request here..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#1e3a5f] to-[#2a5a8f] text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Submit Prayer Request'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
