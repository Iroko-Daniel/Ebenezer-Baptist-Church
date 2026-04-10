'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface GiveAccount {
  id: string
  bank: string
  purpose: string
  account_name: string
  account_number: string
  sort_order: number
  is_active: boolean
  color?: string
}

// Color mapping for different banks
const bankColors: Record<string, string> = {
  'Polaris Bank': 'from-blue-600 to-blue-800',
  'First Bank': 'from-emerald-600 to-emerald-800',
  'FCMB': 'from-orange-600 to-orange-800',
}

export default function GiveNow() {
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [accounts, setAccounts] = useState<GiveAccount[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAccounts()
  }, [])

  const fetchAccounts = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('give_accounts')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      if (data) {
        // Assign colors based on bank name
        const accountsWithColors = data.map((account, index) => ({
          ...account,
          color: bankColors[account.bank] || `from-[#1e3a5f] to-[#7a2040]`
        }))
        setAccounts(accountsWithColors)
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching give accounts:', error)
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(key)
    setTimeout(() => setCopiedField(null), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  return (
    <div>
      {/* Compact Hero Section */}
      <section className="relative py-8 sm:py-10 text-white overflow-hidden bg-gradient-to-b from-[#7a2040] to-[#1e3a5f]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Give Now</h1>
            <p className="text-sm sm:text-base text-white/80">Support the work of God through your generous giving</p>
          </div>
        </div>
      </section>

      {/* Scripture Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl text-center">
          <blockquote className="text-lg sm:text-xl md:text-2xl italic text-gray-700 mb-4 sm:mb-6 leading-relaxed px-4">
            "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver."
          </blockquote>
          <p className="text-base sm:text-lg text-gray-500 font-medium">— 2 Corinthians 9:7 (NIV)</p>
        </div>
      </section>

      {/* Bank Details - Attractive Cards */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">Bank Account Details</h2>
            <div className="h-1 w-20 bg-gray-300 mx-auto rounded"></div>
            <p className="text-gray-500 mt-4 text-sm sm:text-base">Choose the appropriate account for your giving</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {accounts.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <span className="text-4xl mb-3 block">💳</span>
                <p className="text-gray-500">No bank accounts available at the moment.</p>
              </div>
            ) : (
              accounts.map((account, index) => (
                <div key={account.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  {/* Card Header */}
                  <div className={`bg-gradient-to-r ${account.color} p-5 sm:p-6 text-white`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold">{account.bank}</h3>
                        <p className="text-white/80 text-sm mt-1">{account.purpose}</p>
                      </div>
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 sm:p-6 space-y-4">
                    {/* Account Name */}
                    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 sm:p-4">
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500 font-medium">Account Name</p>
                        <p className="text-sm sm:text-base font-bold text-gray-900 mt-0.5">{account.account_name}</p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(account.account_name, `name-${index}`)}
                        className="text-gray-400 hover:text-gray-700 transition-colors flex-shrink-0 ml-2 p-1"
                        title="Copy account name"
                      >
                        {copiedField === `name-${index}` ? (
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        )}
                      </button>
                    </div>

                    {/* Account Number */}
                    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 sm:p-4">
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500 font-medium">Account Number</p>
                        <p className="text-xl sm:text-2xl font-bold tracking-wider mt-0.5" style={{ fontFamily: 'monospace' }}>
                          {account.account_number}
                        </p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(account.account_number, `num-${index}`)}
                        className="bg-gray-900 text-white px-3 sm:px-4 py-2 rounded-lg font-bold text-xs sm:text-sm hover:bg-gray-800 transition flex-shrink-0 ml-2"
                      >
                        {copiedField === `num-${index}` ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Appreciation */}
      <section className="py-12 sm:py-16 bg-white text-center">
        <div className="container mx-auto px-4 sm:px-6 max-w-2xl">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-gray-900">Thank You for Your Generosity</h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
            Your giving supports the work of ministry, community outreach, and the spread of the Gospel.
            May God bless you abundantly for your faithful stewardship.
          </p>
        </div>
      </section>
    </div>
  )
}
