import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Copy, CheckCircle2 } from 'lucide-react';
import { PropertyCard } from './PropertyCard';
import { supabase } from './supabaseClient';
import type { Property } from './data/properties';

interface SellerProfileProps {
  sellerId: string;
  onBack: () => void;
  onSelectProperty: (id: string) => void;
}

export function SellerProfile({ sellerId, onBack, onSelectProperty }: SellerProfileProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [sellerInfo, setSellerInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    const loadSellerData = async () => {
      setIsLoading(true);

      // Load seller profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sellerId)
        .single();

      setSellerInfo(profile);

      // Load seller's properties
      const { data: propertyRows } = await supabase
        .from('properties')
        .select('*')
        .eq('seller_id', sellerId)
        .order('created_at', { ascending: false });

      if (!propertyRows) {
        setProperties([]);
        setIsLoading(false);
        return;
      }

      // Load photos for properties
      const { data: photoRows } = await supabase
        .from('property_photos')
        .select('*')
        .in('property_id', propertyRows.map(p => p.id));

      const photosByProperty = (photoRows || []).reduce<Record<string, { url: string; label: string }[]>>(
        (acc, row) => {
          if (!acc[row.property_id]) acc[row.property_id] = [];
          acc[row.property_id].push({ url: row.url, label: row.label });
          return acc;
        },
        {}
      );

      const mapped = propertyRows.map((row: any) => ({
        id: row.id,
        sellerId: row.seller_id,
        title: row.title,
        address: row.address,
        city: row.city,
        state: row.state,
        zip: row.zip,
        price: row.price,
        listingType: row.listing_type,
        propertyType: row.property_type,
        bedrooms: row.bedrooms,
        bathrooms: row.bathrooms,
        sqft: row.sqft,
        yearBuilt: row.year_built,
        isNew: row.is_new,
        isFeatured: row.is_featured,
        description: row.description,
        features: row.features || [],
        panoramas: photosByProperty[row.id] || [],
        thumbnailUrl: row.thumbnail_url,
        matterportUrl: row.matterport_url || '',
        agent: {
          name: row.agent_name,
          phone: row.agent_phone,
          email: row.agent_email,
          photo: row.agent_photo,
        },
      }));

      setProperties(mapped);
      setIsLoading(false);
    };

    loadSellerData();
  }, [sellerId]);

  const handleCopyLink = async () => {
    const shareUrl = new URL(window.location.href);
    shareUrl.searchParams.set('seller', sellerId);
    shareUrl.searchParams.delete('property');
    const link = shareUrl.toString();

    try {
      await navigator.clipboard.writeText(link);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy seller profile link:', err);
      prompt('Copy this seller profile link:', link);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading seller profile...</p>
        </div>
      </div>
    );
  }

  const displayName = sellerInfo?.full_name || 'Property Seller';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to all properties</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Seller info card */}
        <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl p-8 text-white mb-8 shadow-xl">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl">
              {sellerInfo?.avatar_url ? (
                <img src={sellerInfo.avatar_url} alt={displayName} className="w-full h-full rounded-2xl object-cover" />
              ) : (
                '👤'
              )}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{displayName}</h1>
              <p className="text-white/80 mb-4">Property Listings</p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
                  📊 {properties.length} {properties.length === 1 ? 'Property' : 'Properties'}
                </div>
              </div>
            </div>
            <button
              onClick={handleCopyLink}
              className="px-6 py-3 bg-white text-purple-600 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-lg"
            >
              {linkCopied ? (
                <>
                  <CheckCircle2 size={18} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={18} />
                  Share My Profile
                </>
              )}
            </button>
          </div>
        </div>

        {/* Properties grid */}
        {properties.length > 0 ? (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">All Properties</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onSelect={onSelectProperty}
                  isSaved={false}
                  onToggleSave={() => {}}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MapPin className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No properties yet</h3>
            <p className="text-gray-500">This seller hasn't listed any properties.</p>
          </div>
        )}
      </div>
    </div>
  );
}
