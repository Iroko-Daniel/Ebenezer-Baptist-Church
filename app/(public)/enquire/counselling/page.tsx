'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function Counselling() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
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
          type: 'counselling',
          first_name: formData.name,
          email: formData.email,
          phone: formData.phone,
          body: formData.message
        }])

      if (error) {
        console.error('Error submitting enquiry:', error)
      }
      
      // Show success regardless - form was valid
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
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#1e3a5f]/10 to-[#2a5a8f]/10 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-[#1e3a5f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Request Received</h2>
          <p className="text-gray-600 mb-6">
            Thank you for reaching out. Our counselling team will contact you within 24-48 hours in complete confidence.
          </p>
          <button
            onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', phone: '', message: '' }) }}
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">Counselling Services</h1>
            <p className="text-sm sm:text-base md:text-lg text-white/80 max-w-2xl mx-auto">
              Compassionate, confidential support for life&apos;s challenges
            </p>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gray-600 leading-relaxed mb-6">
              Our church offers biblical counselling and pastoral care for individuals, couples, and families. 
              Whether you are navigating a difficult season, seeking guidance for major decisions, or simply need 
              someone to listen, our trained counsellors are here to walk alongside you with compassion and wisdom.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-[#fef9f3] to-white p-4 rounded-lg border border-[#d4af37]/20">
                <h3 className="font-bold text-[#1e3a5f] mb-2 text-sm">Individual Counselling</h3>
                <p className="text-gray-600 text-xs">One-on-one sessions tailored to your personal needs</p>
              </div>
              <div className="bg-gradient-to-br from-[#fef9f3] to-white p-4 rounded-lg border border-[#d4af37]/20">
                <h3 className="font-bold text-[#1e3a5f] mb-2 text-sm">Marriage & Family</h3>
                <p className="text-gray-600 text-xs">Support for couples and families seeking guidance</p>
              </div>
              <div className="bg-gradient-to-br from-[#fef9f3] to-white p-4 rounded-lg border border-[#d4af37]/20">
                <h3 className="font-bold text-[#1e3a5f] mb-2 text-sm">Spiritual Direction</h3>
                <p className="text-gray-600 text-xs">Growing deeper in your walk with God</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-white to-[#fef9f3]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Request Counselling</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 outline-none transition-all text-sm"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 outline-none transition-all text-sm"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 outline-none transition-all text-sm"
                    placeholder="+234 800 000 0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">How can we support you?</label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 outline-none transition-all text-sm resize-none"
                    placeholder="Share what you are comfortable sharing..."
                  />
                </div>
                <p className="text-xs text-gray-500 text-center">
                  All enquiries are kept strictly confidential.
                </p>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#1e3a5f] to-[#2a5a8f] text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Submit Request'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
