'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface GalleryImage {
  id: string
  url: string
  title: string
  category: string
}

export default function Gallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('gallery_images').select('*').order('created_at', { ascending: false })
    if (data) setImages(data)
    setLoading(false)
  }

  const handleDownload = (url: string, title: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = title.replace(/\s+/g, '-').toLowerCase() + '.jpg'
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedIndex === null) return
    const newIndex = direction === 'next'
      ? (selectedIndex + 1) % images.length
      : (selectedIndex - 1 + images.length) % images.length
    setSelectedIndex(newIndex)
  }

  return (
    <div>
      <section className="relative py-8 sm:py-10 text-white overflow-hidden bg-gradient-to-b from-[#1e3a5f] to-[#2a5a8f]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Gallery</h1>
            <p className="text-sm sm:text-base text-white/80">Moments from our church community</p>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          {loading ? (
            <p className="text-center text-gray-500 py-12">Loading images...</p>
          ) : images.length === 0 ? (
            <p className="text-center text-gray-500 py-12">No images yet. Check back soon!</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className="aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer relative group shadow-md hover:shadow-xl transition-all duration-300"
                  onClick={() => setSelectedIndex(index)}
                >
                  <img src={image.url} alt={image.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedIndex !== null && images[selectedIndex] && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-2 sm:p-4"
          onClick={() => setSelectedIndex(null)}
        >
          <div className="max-w-6xl w-full max-h-full flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-2 sm:mb-4">
              <h3 className="text-white text-base sm:text-lg font-bold truncate mr-4">{images[selectedIndex].title}</h3>
              <button onClick={() => setSelectedIndex(null)} className="text-white/70 hover:text-white text-2xl sm:text-3xl font-bold flex-shrink-0 px-2">&times;</button>
            </div>

            <div className="relative flex-1 flex items-center justify-center min-h-0">
              <button
                onClick={(e) => { e.stopPropagation(); navigateImage('prev') }}
                className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-colors z-10"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>

              <img src={images[selectedIndex].url} alt={images[selectedIndex].title} className="max-h-[60vh] sm:max-h-[70vh] md:max-h-[75vh] w-auto object-contain" />

              <button
                onClick={(e) => { e.stopPropagation(); navigateImage('next') }}
                className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-colors z-10"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>

            <div className="flex justify-between items-center mt-2 sm:mt-4">
              <p className="text-white/50 text-xs sm:text-sm">{selectedIndex + 1} / {images.length}</p>
              <button
                onClick={() => handleDownload(images[selectedIndex].url, images[selectedIndex].title)}
                className="bg-white/20 hover:bg-white/40 text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg font-bold text-xs sm:text-sm flex items-center transition-colors"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
