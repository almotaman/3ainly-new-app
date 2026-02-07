import { Box, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Box className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold">PanoProperty</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              The next generation property finder with immersive 360° panoramic photos and 3D Matterport virtual tours.
            </p>
            <div className="flex gap-3">
              {['twitter', 'facebook', 'instagram', 'linkedin'].map(social => (
                <button key={social} className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <span className="text-xs font-bold text-gray-400 uppercase">{social.charAt(0)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-400">Explore</h4>
            <ul className="space-y-2.5">
              {['Buy Properties', 'Rent Properties', 'New Listings', 'Featured Homes', '3D Virtual Tours'].map(link => (
                <li key={link}>
                  <button className="text-gray-400 hover:text-white text-sm transition-colors">{link}</button>
                </li>
              ))}
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-400">Property Types</h4>
            <ul className="space-y-2.5">
              {['Houses', 'Condos', 'Apartments', 'Townhouses', 'Luxury Estates'].map(link => (
                <li key={link}>
                  <button className="text-gray-400 hover:text-white text-sm transition-colors">{link}</button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-400">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Mail size={16} className="flex-shrink-0" />
                hello@panoproperty.com
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Phone size={16} className="flex-shrink-0" />
                (800) 555-PANO
              </li>
              <li className="flex items-start gap-2 text-gray-400 text-sm">
                <MapPin size={16} className="flex-shrink-0 mt-0.5" />
                123 Innovation Drive, San Francisco, CA 94105
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © 2024 PanoProperty. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookies'].map(link => (
              <button key={link} className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
                {link}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
