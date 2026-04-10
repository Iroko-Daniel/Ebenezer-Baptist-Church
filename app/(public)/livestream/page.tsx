'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function Livestream() {
  const [livestream, setLivestream] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchLivestream() }, [])

  const fetchLivestream = async () => {
    const supabase = createClient()
    const { data, error } = await supabase.from('livestream').select('*').limit(1).maybeSingle()
    console.log('📺 Livestream data:', data)
    console.log('📺 Error:', error)
    console.log('📺 is_active:', data?.is_active)
    console.log('📺 youtube_url:', data?.youtube_url)
    if (data) {
      setLivestream(data)
      console.log('📺 Embed URL:', getEmbedUrl(data.youtube_url))
    }
    setLoading(false)
  }

  // Convert YouTube URL to embed format
  const getEmbedUrl = (url: string) => {
    if (!url) return ''

    // Already embed format
    if (url.includes('/embed/')) {
      // Add autoplay if not present
      return url.includes('?') ? url : `${url}?rel=0&autoplay=1`
    }

    // Standard watch URL: https://www.youtube.com/watch?v=VIDEO_ID
    const watchMatch = url.match(/[?&]v=([^&]+)/)
    if (watchMatch) {
      return `https://www.youtube.com/embed/${watchMatch[1]}?rel=0&autoplay=1`
    }

    // Short URL: https://youtu.be/VIDEO_ID
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0]?.split('&')[0]
      return `https://www.youtube.com/embed/${id}?rel=0&autoplay=1`
    }

    // YouTube live URL: https://www.youtube.com/live/VIDEO_ID
    const liveMatch = url.match(/\/live\/([^?&]+)/)
    if (liveMatch) {
      return `https://www.youtube.com/embed/${liveMatch[1]}?rel=0&autoplay=1`
    }

    // If it's just a video ID
    if (!url.includes('/') && !url.includes('?') && url.length > 5) {
      return `https://www.youtube.com/embed/${url}?rel=0&autoplay=1`
    }

    // Return as-is if we can't parse it (might already be correct)
    console.warn('Could not parse YouTube URL:', url)
    return url
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Loading...</p></div>

  return (
    <div>
      <section className="relative py-8 sm:py-10 text-white overflow-hidden bg-gradient-to-b from-[#1e3a5f] to-[#2a5a8f]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              {livestream?.is_active && <span className="inline-block w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse"></span>}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Livestream</h1>
            </div>
            <p className="text-sm sm:text-base text-white/80">Watch our services live from anywhere in the world</p>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-12 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl border border-gray-700">
              <div className="aspect-video">
                {livestream?.youtube_url && livestream.is_active ? (
                  <iframe
                    width="100%"
                    height="100%"
                    src={getEmbedUrl(livestream.youtube_url)}
                    title="Ebenezer Baptist Church Livestream"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-white">
                    <svg className="w-16 h-16 mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p className="text-lg font-semibold mb-2">Stream Not Currently Active</p>
                    <p className="text-gray-400 text-sm">Check back during our service times</p>
                  </div>
                )}
              </div>

              <div className="p-4 sm:p-6 text-white">
                <h2 className="text-lg sm:text-xl font-bold mb-4">Service Times</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="bg-gray-700 p-3 sm:p-4 rounded-lg">
                    <p className="text-[#d4af37] font-semibold text-xs sm:text-sm">Sunday School</p>
                    <p className="text-sm sm:text-base">9:00 AM WAT</p>
                  </div>
                  <div className="bg-gray-700 p-3 sm:p-4 rounded-lg">
                    <p className="text-[#d4af37] font-semibold text-xs sm:text-sm">Discipleship</p>
                    <p className="text-sm sm:text-base">9:30 AM WAT</p>
                  </div>
                  <div className="bg-gray-700 p-3 sm:p-4 rounded-lg">
                    <p className="text-[#d4af37] font-semibold text-xs sm:text-sm">Main Service</p>
                    <p className="text-sm sm:text-base">10:00 AM WAT</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 sm:mt-12 text-center text-white">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Can't Watch Live?</h3>
              <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base px-4">
                Catch up on past sermons on our YouTube channel.
              </p>
              <a
                href="https://www.youtube.com/@ebenezerbaptistchurch2246"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-red-700 transition inline-block text-sm sm:text-base shadow-lg"
              >
                Visit YouTube Channel
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
