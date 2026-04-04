export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e3a5f] via-[#2a5a8f] to-[#1e3a5f]">
      <div className="text-center">
        {/* Church Logo */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-3 shadow-2xl ring-4 ring-white/30 animate-pulse">
            <img
              src="/logo.png"
              alt="Ebenezer Baptist Church"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Loading Text */}
        <h2 className="text-2xl font-bold text-white mb-2">Loading</h2>
        <p className="text-white/70 text-sm mb-6">Preparing your experience...</p>

        {/* Animated Dots */}
        <div className="flex justify-center gap-2">
          <div className="w-3 h-3 bg-[#d4af37] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-[#d4af37] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-[#d4af37] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  )
}
