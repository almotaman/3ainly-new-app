import { Box, Menu, X, Heart, User } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  onNavigate: (page: 'home' | 'detail' | 'my-listings') => void;
  currentPage: string;
  isSignedIn: boolean;
  isSeller: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
  onListProperty: () => void;
}

export function Header({ onNavigate, currentPage, isSignedIn, isSeller, onSignIn, onSignOut, onListProperty }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:shadow-blue-300 transition-shadow">
              <Box className="text-white" size={20} />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PanoProperty
              </span>
              <span className="hidden sm:block text-[10px] text-gray-400 -mt-1 font-medium tracking-wider">360° & 3D IMMERSIVE</span>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => onNavigate('home')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === 'home' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Browse Properties
            </button>
            {isSeller && (
              <button
                onClick={() => onNavigate('my-listings')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === 'my-listings' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                My Listings
              </button>
            )}
            <button className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-1.5">
              <Heart size={15} />
              Saved
            </button>
            <div className="w-px h-6 bg-gray-200 mx-2" />
            {isSignedIn ? (
              <button
                onClick={onSignOut}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-1.5"
              >
                <User size={15} />
                Sign Out
              </button>
            ) : (
              <button
                onClick={onSignIn}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-1.5"
              >
                <User size={15} />
                Sign In
              </button>
            )}
            {isSeller && (
              <button
                onClick={onListProperty}
                className="ml-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity shadow-md shadow-blue-200"
              >
                List Property
              </button>
            )}
          </nav>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-50"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 pt-3 space-y-1">
            <button
              onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
              className="block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Browse Properties
            </button>
            {isSeller && (
              <button
                onClick={() => { onNavigate('my-listings'); setMobileMenuOpen(false); }}
                className="block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                My Listings
              </button>
            )}
            <button className="block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              Saved Properties
            </button>
            {isSignedIn ? (
              <button
                onClick={onSignOut}
                className="block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={onSignIn}
                className="block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Sign In
              </button>
            )}
            {isSeller && (
              <button
                onClick={onListProperty}
                className="block w-full mt-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-xl"
              >
                List Property
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
