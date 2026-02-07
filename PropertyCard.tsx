import { useState } from 'react';
import { Bed, Bath, Maximize, MapPin, Heart, Eye, Box } from 'lucide-react';
import type { Property } from '../data/properties';

interface PropertyCardProps {
  property: Property;
  onSelect: (id: string) => void;
}

export function PropertyCard({ property, onSelect }: PropertyCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const formatPrice = (price: number, type: string) => {
    if (type === 'rent') return `$${price.toLocaleString()}/mo`;
    return `$${price.toLocaleString()}`;
  };

  return (
    <div
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-gray-200 hover:-translate-y-1"
      onClick={() => onSelect(property.id)}
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden bg-gray-100">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
        )}
        <img
          src={property.panoramas[0].url}
          alt={property.title}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {property.isNew && (
            <span className="bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">NEW</span>
          )}
          {property.isFeatured && (
            <span className="bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">FEATURED</span>
          )}
          <span className={`text-white text-xs font-bold px-2.5 py-1 rounded-full ${property.listingType === 'sale' ? 'bg-blue-600' : 'bg-purple-600'}`}>
            {property.listingType === 'sale' ? 'FOR SALE' : 'FOR RENT'}
          </span>
        </div>

        {/* 360 & 3D badges */}
        <div className="absolute bottom-3 left-3 flex gap-2">
          <span className="bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
            <Eye size={12} /> 360°
          </span>
          <span className="bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
            <Box size={12} /> 3D Tour
          </span>
        </div>

        {/* Like button */}
        <button
          onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg"
        >
          <Heart
            size={18}
            className={isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
            {property.title}
          </h3>
        </div>

        <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
          <MapPin size={14} className="flex-shrink-0" />
          <span className="line-clamp-1">{property.address}, {property.city}, {property.state}</span>
        </div>

        <div className="flex items-center gap-4 text-gray-600 text-sm mb-4">
          <div className="flex items-center gap-1">
            <Bed size={16} />
            <span>{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath size={16} />
            <span>{property.bathrooms} Baths</span>
          </div>
          <div className="flex items-center gap-1">
            <Maximize size={16} />
            <span>{property.sqft.toLocaleString()} sqft</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-2xl font-bold text-blue-600">
            {formatPrice(property.price, property.listingType)}
          </span>
          <div className="flex items-center gap-2">
            <img
              src={property.agent.photo}
              alt={property.agent.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
