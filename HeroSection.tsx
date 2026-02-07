import { Search, Box, Eye, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onSearchFocus: () => void;
}

export function HeroSection({ onSearchFocus }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950 text-white">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
        <div className="absolute top-40 right-40 w-64 h-64 bg-cyan-500 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-8">
            <Sparkles size={16} className="text-amber-400" />
            <span className="text-sm font-medium">The future of property browsing is here</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Find Your Dream Home
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              In 360° & 3D
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Explore properties like never before with immersive 360° panoramic photos
            and interactive 3D Matterport virtual tours — all from the comfort of your home.
          </p>

          {/* CTA Search */}
          <div className="max-w-2xl mx-auto mb-12">
            <button
              onClick={onSearchFocus}
              className="w-full flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 text-left hover:bg-white/15 transition-colors group"
            >
              <Search size={22} className="text-gray-400 group-hover:text-white transition-colors" />
              <span className="text-gray-400 group-hover:text-gray-300 transition-colors">
                Search by city, address, or property name...
              </span>
            </button>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-2 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-full px-5 py-2.5">
              <Eye size={18} className="text-blue-400" />
              <span className="text-sm font-medium">360° Panoramas</span>
            </div>
            <div className="flex items-center gap-2 bg-purple-500/20 backdrop-blur-sm border border-purple-400/30 rounded-full px-5 py-2.5">
              <Box size={18} className="text-purple-400" />
              <span className="text-sm font-medium">3D Matterport Tours</span>
            </div>
            <div className="flex items-center gap-2 bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-full px-5 py-2.5">
              <Sparkles size={18} className="text-green-400" />
              <span className="text-sm font-medium">Immersive Experience</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto mt-16">
            <div>
              <p className="text-3xl font-bold">500+</p>
              <p className="text-sm text-gray-400 mt-1">Properties</p>
            </div>
            <div>
              <p className="text-3xl font-bold">360°</p>
              <p className="text-sm text-gray-400 mt-1">Panoramic Views</p>
            </div>
            <div>
              <p className="text-3xl font-bold">3D</p>
              <p className="text-sm text-gray-400 mt-1">Virtual Tours</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 100" fill="none" className="w-full">
          <path d="M0 40L48 36.7C96 33 192 27 288 30C384 33 480 47 576 50C672 53 768 47 864 40C960 33 1056 27 1152 30C1248 33 1344 47 1392 53.3L1440 60V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0V40Z" fill="#F9FAFB"/>
        </svg>
      </div>
    </section>
  );
}
