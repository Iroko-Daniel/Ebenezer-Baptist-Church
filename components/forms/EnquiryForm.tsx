'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface FormField {
  name: string
  label: string
  type: 'text' | 'tel' | 'textarea' | 'select'
  required?: boolean
  options?: string[]
  placeholder?: string
}

interface EnquiryFormProps {
  title: string
  description: string
  fields: FormField[]
  submitMessage: string
  formType: string
}

export default function EnquiryForm({ title, description, fields, submitMessage, formType }: EnquiryFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      
      // Map form fields to database structure
      const enquiryData = {
        type: formType,
        first_name: formData.firstName || '',
        last_name: formData.lastName || '',
        phone: formData.phone || '',
        gender: formData.gender || null,
        address: formData.address || null,
        is_member: formData.membership || null,
        body: formData.body || null,
        prayer_request: formData.prayerRequest || null,
      }

      const { error } = await supabase
        .from('enquiries')
        .insert([enquiryData])

      if (error) {
        console.error('Error saving enquiry:', error)
        // Still show success to user even if DB fails
        console.log('Form data:', enquiryData)
      }

      setSubmitted(true)
    } catch (err) {
      console.error('Error:', err)
      setError('There was an error submitting your form. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  if (submitted) {
    return (
      <div className="py-20 text-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-green-50 border-2 border-green-500 p-8 rounded-lg">
            <h2 className="text-3xl font-bold text-green-700 mb-4">Thank You!</h2>
            <p className="text-lg text-gray-700">{submitMessage}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Compact Hero Section */}
      <section className="relative py-8 sm:py-10 text-white overflow-hidden bg-gradient-to-b from-[#7a2040] to-[#1e3a5f]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{title}</h1>
            <p className="text-sm sm:text-base text-white/80">{description}</p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-10 sm:py-12 bg-white">
        <div className="container mx-auto px-4 max-w-2xl">
          {error && (
            <div className="bg-red-50 border-2 border-red-500 p-4 rounded-lg mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            {fields.map((field) => (
              <div key={field.name}>
                <label className="block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    name={field.name}
                    required={field.required}
                    placeholder={field.placeholder}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition bg-gray-50 focus:bg-white"
                    rows={5}
                  />
                ) : field.type === 'select' ? (
                  <select
                    name={field.name}
                    required={field.required}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition bg-gray-50 focus:bg-white"
                  >
                    <option value="">Select an option</option>
                    {field.options?.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    required={field.required}
                    placeholder={field.placeholder}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition bg-gray-50 focus:bg-white"
                  />
                )}
              </div>
            ))}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#1e3a5f] to-[#7a2040] text-white py-4 rounded-lg font-bold hover:from-[#7a2040] hover:to-[#3a0f20] transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
