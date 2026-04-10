'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function NewToChurch() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    membershipIntent: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()

      // Split name into first and last name
      const nameParts = formData.name.trim().split(' ')
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''

      const { error } = await supabase
        .from('enquiries')
        .insert([{
          type: 'new_to_church',
          first_name: firstName,
          last_name: lastName,
          phone: formData.phone,
          is_member: formData.membershipIntent || null,
          body: formData.message || null,
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
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-100 to-green-50 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Welcome to Our Church Family!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for reaching out. We are delighted you are here! A member of our team will contact you shortly.
          </p>
          <button
            onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', phone: '', message: '', membershipIntent: '' }) }}
            className="bg-gradient-to-r from-[#d4af37] to-[#c9941a] text-white px-8 py-3 rounded-lg font-bold hover:shadow-lg transition-all"
          >
            Submit Another Response
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">New to Church?</h1>
            <p className="text-sm sm:text-base md:text-lg text-white/80 max-w-2xl mx-auto">
              We would love to connect with you and welcome you to our church family
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-white to-[#fef9f3]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Connect With Us</h2>
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Would you like to become a member?</label>
                  <div className="space-y-3">
                    <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#d4af37] hover:bg-[#fef9f3] transition-all">
                      <input
                        type="radio"
                        name="membershipIntent"
                        value="Yes, I want to become a member"
                        checked={formData.membershipIntent === 'Yes, I want to become a member'}
                        onChange={(e) => setFormData({ ...formData, membershipIntent: e.target.value })}
                        className="w-4 h-4 text-[#d4af37] border-gray-300 focus:ring-[#d4af37]"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-700">Yes, I want to become a member</span>
                    </label>
                    <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#d4af37] hover:bg-[#fef9f3] transition-all">
                      <input
                        type="radio"
                        name="membershipIntent"
                        value="No, I'm just visiting"
                        checked={formData.membershipIntent === 'No, I\'m just visiting'}
                        onChange={(e) => setFormData({ ...formData, membershipIntent: e.target.value })}
                        className="w-4 h-4 text-[#d4af37] border-gray-300 focus:ring-[#d4af37]"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-700">No, I'm just visiting</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">How can we welcome you?</label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 outline-none transition-all text-sm resize-none"
                    placeholder="Tell us how we can help you feel at home..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#d4af37] to-[#c9941a] text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
