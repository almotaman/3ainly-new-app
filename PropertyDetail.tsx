import { useState } from 'react';
import {
  ArrowLeft, Bed, Bath, Maximize, Calendar, MapPin, Share2, Heart,
  Phone, Mail, CheckCircle2, Box, Eye, Home, Star
} from 'lucide-react';
import type { Property } from './data/properties';
import { PanoramaViewer } from './PanoramaViewer';
import { MatterportEmbed } from './MatterportEmbed';

interface PropertyDetailProps {
  property: Property;
  onBack: () => void;
}

export function PropertyDetail({ property, onBack }: PropertyDetailProps) {
  const [activeTab, setActiveTab] = useState<'panorama' | 'matterport'>('panorama');
  const [isLiked, setIsLiked] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);

  const formatPrice = (price: number, type: string) => {
    if (type === 'rent') return `$${price.toLocaleString()}/mo`;
    return `$${price.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to listings</span>
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`p-2.5 rounded-xl border transition-all ${
                isLiked ? 'bg-red-50 border-red-200 text-red-500' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
              }`}
            >
              <Heart size={18} className={isLiked ? 'fill-current' : ''} />
            </button>
            <button className="p-2.5 rounded-xl border bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100 transition-all">
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* View mode toggle */}
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-white rounded-xl p-1 shadow-sm border border-gray-100 inline-flex">
            <button
              onClick={() => setActiveTab('panorama')}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'panorama'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Eye size={16} />
              360° Panorama
            </button>
            <button
              onClick={() => setActiveTab('matterport')}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'matterport'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Box size={16} />
              3D Virtual Tour
            </button>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-sm text-gray-500">
            <Star size={14} className="text-amber-400 fill-amber-400" />
            Immersive viewing experience
          </div>
        </div>

        {/* Main viewer */}
        <div className="mb-8">
          {activeTab === 'panorama' ? (
            <PanoramaViewer panoramas={property.panoramas} />
          ) : (
            <MatterportEmbed url={property.matterportUrl} title={property.title} />
          )}
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & price */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {property.isNew && (
                      <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">NEW</span>
                    )}
                    {property.isFeatured && (
                      <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">FEATURED</span>
                    )}
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      property.listingType === 'sale'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {property.listingType === 'sale' ? 'FOR SALE' : 'FOR RENT'}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <MapPin size={16} />
                    <span>{property.address}, {property.city}, {property.state} {property.zip}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-blue-600">
                    {formatPrice(property.price, property.listingType)}
                  </p>
                  {property.listingType === 'sale' && (
                    <p className="text-sm text-gray-400 mt-1">
                      ${Math.round(property.price / property.sqft).toLocaleString()}/sqft
                    </p>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Bed size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">{property.bedrooms}</p>
                    <p className="text-xs text-gray-500">Bedrooms</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Bath size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">{property.bathrooms}</p>
                    <p className="text-xs text-gray-500">Bathrooms</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Maximize size={20} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">{property.sqft.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Sq Ft</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Calendar size={20} className="text-amber-600" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">{property.yearBuilt}</p>
                    <p className="text-xs text-gray-500">Year Built</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About This Property</h2>
              <p className="text-gray-600 leading-relaxed">{property.description}</p>
            </div>

            {/* Features */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Features & Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-gray-700">
                    <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Property type */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Property Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Home size={18} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Property Type</p>
                    <p className="text-sm font-medium text-gray-900 capitalize">{property.propertyType}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar size={18} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Year Built</p>
                    <p className="text-sm font-medium text-gray-900">{property.yearBuilt}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Maximize size={18} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Living Area</p>
                    <p className="text-sm font-medium text-gray-900">{property.sqft.toLocaleString()} sqft</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="text-sm font-medium text-gray-900">{property.city}, {property.state}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Agent & CTA */}
          <div className="space-y-6">
            {/* Agent card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-36">
              <div className="text-center mb-6">
                <img
                  src={property.agent.photo}
                  alt={property.agent.name}
                  className="w-20 h-20 rounded-2xl object-cover mx-auto mb-3 ring-4 ring-gray-100"
                />
                <h3 className="font-bold text-gray-900 text-lg">{property.agent.name}</h3>
                <p className="text-sm text-gray-500">Listing Agent</p>
              </div>

              <div className="space-y-3 mb-6">
                <a
                  href={`tel:${property.agent.phone}`}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <Phone size={18} className="text-blue-600" />
                  <span className="text-sm font-medium">{property.agent.phone}</span>
                </a>
                <a
                  href={`mailto:${property.agent.email}`}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <Mail size={18} className="text-blue-600" />
                  <span className="text-sm font-medium">{property.agent.email}</span>
                </a>
              </div>

              <button
                onClick={() => setShowContactForm(!showContactForm)}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-blue-200 mb-3"
              >
                Schedule a Virtual Tour
              </button>
              <button className="w-full py-3.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors">
                Request Information
              </button>

              {showContactForm && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                  <input
                    type="text"
                    placeholder="Your name"
                    className="w-full py-2.5 px-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="email"
                    placeholder="Your email"
                    className="w-full py-2.5 px-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="tel"
                    placeholder="Your phone"
                    className="w-full py-2.5 px-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <textarea
                    placeholder="I'm interested in this property and would like to schedule a virtual tour..."
                    rows={3}
                    className="w-full py-2.5 px-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  <button className="w-full py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors text-sm">
                    Send Message
                  </button>
                </div>
              )}
            </div>

            {/* Immersive features callout */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-6 text-white">
              <h3 className="font-bold text-lg mb-3">🏠 Immersive Viewing</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Eye size={16} />
                  </div>
                  <div>
                    <p className="font-medium text-sm">360° Panoramas</p>
                    <p className="text-xs text-white/70">Drag to explore every angle of each room</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Box size={16} />
                  </div>
                  <div>
                    <p className="font-medium text-sm">3D Virtual Tour</p>
                    <p className="text-xs text-white/70">Walk through the property in full 3D with Matterport</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
