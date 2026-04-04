'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e3a5f] via-[#2a5a8f] to-[#1e3a5f] px-4">
      <div className="text-center max-w-2xl">
        {/* Error Icon */}
        <div className="mb-6">
          <div className="w-24 h-24 mx-auto bg-red-500/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>

        {/* Message */}
        <h2 className="text-3xl font-bold text-white mb-4">Something Went Wrong</h2>
        <p className="text-white/70 text-lg mb-8">
          We encountered an unexpected error. Please try again.
        </p>

        {/* Church Logo */}
        <div className="w-20 h-20 mx-auto mb-8 bg-white/10 backdrop-blur-sm rounded-2xl p-2 shadow-xl ring-2 ring-white/20">
          <img
            src="/logo.png"
            alt="Ebenezer Baptist Church"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="bg-gradient-to-r from-[#d4af37] to-[#c9941a] text-white px-8 py-3 rounded-lg font-bold hover:shadow-xl transition-all duration-300 inline-flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
          <Link
            href="/"
            className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 px-8 py-3 rounded-lg font-bold hover:bg-white/20 transition-all duration-300 inline-flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Home
          </Link>
        </div>

        {/* Error Details (hidden in production) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-left">
            <p className="text-red-300 text-sm font-mono break-all">{error.message}</p>
          </div>
        )}
      </div>
    </div>
  )
}
