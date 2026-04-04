import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e3a5f] via-[#2a5a8f] to-[#1e3a5f] px-4">
      <div className="text-center max-w-2xl">
        {/* 404 Number */}
        <div className="mb-6">
          <h1 className="text-9xl font-bold text-[#d4af37] mb-2">404</h1>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto"></div>
        </div>

        {/* Message */}
        <h2 className="text-3xl font-bold text-white mb-4">Page Not Found</h2>
        <p className="text-white/70 text-lg mb-8">
          The page you're looking for doesn't exist or has been moved.
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
          <Link
            href="/"
            className="bg-gradient-to-r from-[#d4af37] to-[#c9941a] text-white px-8 py-3 rounded-lg font-bold hover:shadow-xl transition-all duration-300 inline-flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Home
          </Link>
          <Link
            href="/sermons"
            className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 px-8 py-3 rounded-lg font-bold hover:bg-white/20 transition-all duration-300 inline-flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            View Sermons
          </Link>
        </div>

        {/* Verse */}
        <p className="text-white/50 text-sm italic mt-12">
          "For I know the plans I have for you," declares the Lord<br />
          <span className="not-italic">— Jeremiah 29:11</span>
        </p>
      </div>
    </div>
  )
}
