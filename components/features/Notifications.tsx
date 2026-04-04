'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Enquiry {
  id: string
  type: string
  first_name: string
  last_name: string
  phone: string
  gender?: string
  address?: string
  is_member?: string
  body?: string
  prayer_request?: string
  created_at: string
}

interface NotificationsProps {
  showOnlyNew?: boolean
}

export default function Notifications({ showOnlyNew = false }: NotificationsProps) {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchEnquiries()
  }, [])

  const fetchEnquiries = async () => {
    try {
      const { data, error } = await supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(showOnlyNew ? 10 : 50)

      if (error) {
        console.error('Error fetching enquiries:', error)
        return
      }

      if (data) {
        setEnquiries(data as Enquiry[])
      }
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      new_to_church: 'New to Church',
      counselling: 'Counselling',
      getting_married: 'Getting Married',
      child_dedication: 'Child Dedication',
      prayer_request: 'Prayer Request',
      testimony: 'Testimony',
    }
    return labels[type] || type
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      new_to_church: 'bg-blue-500',
      counselling: 'bg-[#1e3a5f]',
      getting_married: 'bg-pink-500',
      child_dedication: 'bg-yellow-500',
      prayer_request: 'bg-indigo-500',
      testimony: 'bg-green-500',
    }
    return colors[type] || 'bg-gray-500'
  }

  const isNew = (date: string) => {
    const enquiryDate = new Date(date)
    const now = new Date()
    const diffInHours = (now.getTime() - enquiryDate.getTime()) / (1000 * 60 * 60)
    return diffInHours < 24 // Consider new if less than 24 hours
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this enquiry? This action cannot be undone.')) return
    setDeleting(id)
    try {
      const { error } = await supabase.from('enquiries').delete().eq('id', id)
      if (error) {
        alert('❌ Error deleting enquiry: ' + error.message)
        return
      }
      setEnquiries(prev => prev.filter(e => e.id !== id))
      alert('✅ Enquiry deleted successfully!')
    } catch (err) {
      alert('❌ Error deleting enquiry')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Loading enquiries...</p>
      </div>
    )
  }

  if (enquiries.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No enquiries received yet.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          Enquiries
          {enquiries.filter(e => isNew(e.created_at)).length > 0 && (
            <span className="ml-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
              {enquiries.filter(e => isNew(e.created_at)).length} New
            </span>
          )}
        </h2>
        <button
          onClick={fetchEnquiries}
          className="bg-[#1e3a5f] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#7a2040] transition"
        >
          Refresh
        </button>
      </div>

      <div className="space-y-4">
        {enquiries.map((enquiry) => (
          <div
            key={enquiry.id}
            className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:border-[#1e3a5f] transition"
          >
            <div
              className="p-4 cursor-pointer"
              onClick={() => setExpandedId(expandedId === enquiry.id ? null : enquiry.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`${getTypeColor(enquiry.type)} text-white px-3 py-1 rounded text-sm font-bold`}>
                      {getTypeLabel(enquiry.type)}
                    </span>
                    {isNew(enquiry.created_at) && (
                      <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                        NEW
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold">
                    {enquiry.first_name} {enquiry.last_name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    📞 {enquiry.phone} | 📅 {new Date(enquiry.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(enquiry.id)
                    }}
                    disabled={deleting === enquiry.id}
                    className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition disabled:opacity-50"
                    title="Delete enquiry"
                  >
                    {deleting === enquiry.id ? (
                      <span className="text-xs">⏳</span>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                  <div className="text-2xl text-gray-400">
                    {expandedId === enquiry.id ? '▲' : '▼'}
                  </div>
                </div>
              </div>
            </div>

            {expandedId === enquiry.id && (
              <div className="p-4 bg-gray-50 border-t-2 border-gray-200">
                <div className="space-y-3">
                  {enquiry.gender && (
                    <div>
                      <p className="text-gray-600 text-sm font-bold">Gender</p>
                      <p className="text-gray-900">{enquiry.gender}</p>
                    </div>
                  )}
                  {enquiry.address && (
                    <div>
                      <p className="text-gray-600 text-sm font-bold">Address</p>
                      <p className="text-gray-900">{enquiry.address}</p>
                    </div>
                  )}
                  {enquiry.is_member && (
                    <div>
                      <p className="text-gray-600 text-sm font-bold">Membership Status</p>
                      <p className="text-gray-900">{enquiry.is_member}</p>
                    </div>
                  )}
                  {enquiry.body && (
                    <div>
                      <p className="text-gray-600 text-sm font-bold">Message</p>
                      <p className="text-gray-900 whitespace-pre-line">{enquiry.body}</p>
                    </div>
                  )}
                  {enquiry.prayer_request && (
                    <div>
                      <p className="text-gray-600 text-sm font-bold">Prayer Request</p>
                      <p className="text-gray-900 whitespace-pre-line">{enquiry.prayer_request}</p>
                    </div>
                  )}
                  {!enquiry.body && !enquiry.prayer_request && (
                    <p className="text-gray-500 italic">No additional message provided.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
