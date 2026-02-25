import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import type { Session } from '@supabase/supabase-js';
import { Header } from './Header';
import { HeroSection } from './HeroSection';
import { SearchFilters, type Filters } from './SearchFilters';
import { PropertyCard } from './PropertyCard';
import { PropertyDetail } from './PropertyDetail';
import { SellerProfile } from './SellerProfile';
import { Footer } from './Footer';
import { properties as seedProperties, type Property } from './data/properties';
import { TrendingUp, Award, Clock, Search } from 'lucide-react';
import { supabase } from './supabaseClient';
import { ListPropertyModal } from './ListPropertyModal';
import { AuthModal } from './AuthModal';

type Page = 'home' | 'detail' | 'my-listings' | 'seller-profile';

export function App() {
  const [page, setPage] = useState<Page>('home');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [selectedSellerId, setSelectedSellerId] = useState<string | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [session, setSession] = useState<Session | null>(null);
  const [profileRole, setProfileRole] = useState<'buyer' | 'seller' | null>(null);
  const [dbProperties, setDbProperties] = useState<Property[]>([]);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>([]);
  const [filters, setFilters] = useState<Filters>({
    search: '',
    city: '',
    propertyType: '',
    listingType: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
  });

  const filtersRef = useRef<HTMLDivElement>(null);

  const isSeller = profileRole === 'seller';
  const isApprovedSeller = isSeller; // For now, sellers are auto-approved
  const allProperties = useMemo(() => [...dbProperties, ...seedProperties], [dbProperties]);
  const availableCities = useMemo(
    () => Array.from(new Set(allProperties.map((p) => p.city))).sort(),
    [allProperties]
  );
  const availablePropertyTypes = useMemo(
    () => Array.from(new Set(allProperties.map((p) => p.propertyType))).sort(),
    [allProperties]
  );
  const myListings = useMemo(
    () => dbProperties.filter((property) => property.sellerId === session?.user?.id),
    [dbProperties, session]
  );

  useEffect(() => {
    let isMounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (isMounted) setSession(data.session || null);
    });
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      if (!session?.user) {
        setProfileRole(null);
        setSavedPropertyIds([]);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .maybeSingle();

      if (error) {
        setProfileRole(null);
        return;
      }

      if (!data) {
        await supabase.from('profiles').insert({ id: session.user.id, role: 'buyer' });
        setProfileRole('buyer');
        return;
      }

      setProfileRole(data.role);

      // Load saved properties
      const { data: savedProps } = await supabase
        .from('saved_properties')
        .select('property_id')
        .eq('user_id', session.user.id);

      setSavedPropertyIds(savedProps?.map(s => s.property_id) || []);
    };

    loadProfile();
  }, [session]);

  useEffect(() => {
    const pendingRole = localStorage.getItem('pendingRole');
    if (!pendingRole || !session?.user) return;

    supabase
      .from('profiles')
      .update({ role: pendingRole })
      .eq('id', session.user.id)
      .then(() => {
        localStorage.removeItem('pendingRole');
        setProfileRole(pendingRole as 'buyer' | 'seller');
      });
  }, [session]);

  useEffect(() => {
    const loadProperties = async () => {
      const { data: propertyRows } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (!propertyRows) {
        setDbProperties([]);
        return;
      }

      const { data: photoRows } = await supabase
        .from('property_photos')
        .select('*');

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
        thumbnailUrl: row.thumbnail_url || undefined,
        matterportUrl: row.matterport_url || '',
        agent: {
          name: row.agent_name,
          phone: row.agent_phone,
          email: row.agent_email,
          photo: row.agent_photo,
        },
      }));

      setDbProperties(mapped);
    };

    loadProperties();
  }, []);

  // Check URL parameters for shareable links
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sellerId = params.get('seller');
    const propertyId = params.get('property');

    if (sellerId) {
      setSelectedSellerId(sellerId);
      setPage('seller-profile');
    } else if (propertyId) {
      setSelectedPropertyId(propertyId);
      setPage('detail');
    }
  }, []);

  const handleSearchFocus = useCallback(() => {
    filtersRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const filteredProperties = useMemo(() => {
    let result = allProperties.filter((p) => {
      // Search
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          p.title.toLowerCase().includes(searchLower) ||
          p.address.toLowerCase().includes(searchLower) ||
          p.city.toLowerCase().includes(searchLower) ||
          p.state.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // City
      if (filters.city && p.city !== filters.city) return false;

      // Property type
      if (filters.propertyType && p.propertyType !== filters.propertyType) return false;

      // Listing type
      if (filters.listingType && p.listingType !== filters.listingType) return false;

      // Min price
      if (filters.minPrice && p.price < Number(filters.minPrice)) return false;

      // Max price
      if (filters.maxPrice && p.price > Number(filters.maxPrice)) return false;

      // Bedrooms
      if (filters.bedrooms && p.bedrooms < Number(filters.bedrooms)) return false;

      // Bathrooms
      if (filters.bathrooms && p.bathrooms < Number(filters.bathrooms)) return false;

      return true;
    });

    // Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => b.yearBuilt - a.yearBuilt);
        break;
      case 'sqft':
        result.sort((a, b) => b.sqft - a.sqft);
        break;
      case 'featured':
      default:
        result.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          if (a.isNew && !b.isNew) return -1;
          if (!a.isNew && b.isNew) return 1;
          return 0;
        });
        break;
    }

    return result;
  }, [filters, sortBy, allProperties]);

  const handleSelectProperty = (id: string) => {
    setSelectedPropertyId(id);
    setPage('detail');
    window.history.pushState({}, '', `?property=${id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (target: Page) => {
    setPage(target);
    if (target !== 'detail') {
      setSelectedPropertyId(null);
      window.history.pushState({}, '', window.location.pathname);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewSellerProfile = (sellerId: string) => {
    setSelectedSellerId(sellerId);
    setPage('seller-profile');
    window.history.pushState({}, '', `?seller=${sellerId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignIn = async () => {
    setIsAuthOpen(true);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleBecomeSeller = async () => {
    if (!session?.user) return;
    
    const confirmed = confirm('Switch to Seller account? You\'ll be able to list properties and manage your listings.');
    if (!confirmed) return;

    await supabase
      .from('profiles')
      .update({ role: 'seller' })
      .eq('id', session.user.id);
    
    setProfileRole('seller');
    alert('✅ You\'re now a Seller! Check the menu for "My Listings" and "List Property"');
  };

  const openCreateListing = () => {
    setEditingProperty(null);
    setIsListModalOpen(true);
  };

  const handleToggleSave = async (propertyId: string) => {
    if (!session?.user) {
      setIsAuthOpen(true);
      return;
    }

    const isSaved = savedPropertyIds.includes(propertyId);

    if (isSaved) {
      // Remove from saved
      await supabase
        .from('saved_properties')
        .delete()
        .eq('user_id', session.user.id)
        .eq('property_id', propertyId);

      setSavedPropertyIds(prev => prev.filter(id => id !== propertyId));
    } else {
      // Add to saved
      await supabase
        .from('saved_properties')
        .insert({
          user_id: session.user.id,
          property_id: propertyId,
        });

      setSavedPropertyIds(prev => [...prev, propertyId]);
    }
  };

  const handleDeleteProperty = async (propertyId: string) => {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId);

      if (error) {
        alert('Failed to delete property. Please try again.');
        return;
      }

      // Remove from local list
      setDbProperties(prev => prev.filter(p => p.id !== propertyId));
      alert('Property deleted successfully.');
    } catch (err) {
      console.error('Error deleting property:', err);
      alert('An error occurred while deleting the property.');
    }
  };

  const selectedProperty = allProperties.find((p) => p.id === selectedPropertyId);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        onNavigate={handleNavigate}
        currentPage={page}
        isSignedIn={!!session}
        isSeller={isSeller}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        onListProperty={openCreateListing}
        onBecomeSeller={handleBecomeSeller}
      />

      {page === 'home' ? (
        <>
          <HeroSection onSearchFocus={handleSearchFocus} />

          {/* Main content */}
          <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 w-full -mt-6 relative z-10">
            {/* Filters */}
            <div ref={filtersRef} className="mb-8 scroll-mt-20">
              <SearchFilters
                filters={filters}
                onFiltersChange={setFilters}
                showAdvanced={showAdvancedFilters}
                onToggleAdvanced={() => setShowAdvancedFilters(!showAdvancedFilters)}
                resultCount={filteredProperties.length}
                cities={availableCities}
                propertyTypes={availablePropertyTypes}
              />
            </div>

            {/* Sort bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-gray-900">Properties</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 hidden sm:inline">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="py-2 px-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="newest">Newest Built</option>
                  <option value="sqft">Largest</option>
                </select>
              </div>
            </div>

            {/* Featured section */}
            {sortBy === 'featured' && !Object.values(filters).some(v => v !== '') && (
              <div className="mb-10">
                <div className="flex items-center gap-2 mb-5">
                  <Award className="text-amber-500" size={22} />
                  <h3 className="text-lg font-bold text-gray-900">Featured Properties</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {allProperties
                    .filter((p) => p.isFeatured)
                    .slice(0, 2)
                    .map((property) => (
                      <div key={property.id} className="relative">
                        <div className="absolute -top-2 -right-2 z-10 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center shadow-lg">
                          <Award size={16} className="text-white" />
                        </div>
                        <PropertyCard property={property} onSelect={handleSelectProperty} isSaved={savedPropertyIds.includes(property.id)} onToggleSave={handleToggleSave} />
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Properties grid */}
            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                {filteredProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onSelect={handleSelectProperty}
                    isSaved={savedPropertyIds.includes(property.id)}
                    onToggleSave={handleToggleSave}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Search className="text-gray-400" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No properties found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters to see more results</p>
                <button
                  onClick={() =>
                    setFilters({
                      search: '',
                      city: '',
                      propertyType: '',
                      listingType: '',
                      minPrice: '',
                      maxPrice: '',
                      bedrooms: '',
                      bathrooms: '',
                    })
                  }
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* How it works */}
            <div className="mb-16">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">How It Works</h2>
                <p className="text-gray-500 max-w-xl mx-auto">
                  Experience properties in a whole new way with our immersive technology
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                    <Search className="text-blue-600" size={26} />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">Browse & Filter</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Search properties by location, price, type, and more. Find exactly what you're looking for.
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                    <TrendingUp className="text-purple-600" size={26} />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">Explore in 360° & 3D</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    View panoramic 360° photos and walk through properties with interactive 3D Matterport tours.
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                    <Clock className="text-green-600" size={26} />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">Schedule a Tour</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Connect with agents and schedule virtual or in-person tours of your favorite properties.
                  </p>
                </div>
              </div>
            </div>
          </main>

          <Footer />
        </>
      ) : page === 'my-listings' ? (
        <>
          <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 w-full py-10">
            {/* Share Profile Banner for Sellers */}
            {session?.user && isSeller && (
              <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-6 text-white mb-8 shadow-xl">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1">📊 Your Seller Profile</h3>
                    <p className="text-white/80 text-sm">Share your profile link with clients to showcase all your properties</p>
                  </div>
                  <button
                    onClick={() => handleViewSellerProfile(session.user.id)}
                    className="px-6 py-3 bg-white text-purple-600 rounded-xl font-medium hover:bg-gray-50 transition-colors shadow-lg whitespace-nowrap"
                  >
                    View My Profile Page
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">My Listings</h2>
                <p className="text-gray-500">Manage the properties you have listed.</p>
              </div>
              {isApprovedSeller && (
                <button
                  onClick={openCreateListing}
                  className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
                >
                  List a Property
                </button>
              )}
            </div>

            {!session?.user ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <p className="text-gray-600">Sign in to view your listings.</p>
              </div>
            ) : !isSeller ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <p className="text-gray-600">Only sellers can access listings.</p>
              </div>
            ) : myListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myListings.map((property) => (
                  <div key={property.id} className="relative group">
                    <PropertyCard
                      property={property}
                      onSelect={handleSelectProperty}
                      isSaved={savedPropertyIds.includes(property.id)}
                      onToggleSave={handleToggleSave}
                    />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          setEditingProperty(property);
                          setIsListModalOpen(false);
                        }}
                        className="px-3 py-1.5 bg-white/90 text-gray-700 text-xs font-semibold rounded-lg shadow-lg border border-gray-100 hover:bg-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          if (confirm('Are you sure you want to delete this property? This cannot be undone.')) {
                            handleDeleteProperty(property.id);
                          }
                        }}
                        className="px-3 py-1.5 bg-red-100/90 text-red-700 text-xs font-semibold rounded-lg shadow-lg border border-red-200 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <p className="text-gray-600">You have not listed any properties yet.</p>
              </div>
            )}
          </main>

          <Footer />
        </>
      ) : page === 'seller-profile' && selectedSellerId ? (
        <SellerProfile
          sellerId={selectedSellerId}
          onBack={() => {
            setPage('home');
            setSelectedSellerId(null);
            window.history.pushState({}, '', window.location.pathname);
          }}
          onSelectProperty={handleSelectProperty}
        />
      ) : page === 'detail' && selectedProperty ? (
        <PropertyDetail
          property={selectedProperty}
          onBack={() => handleNavigate('home')}
          onViewSellerProfile={handleViewSellerProfile}
        />
      ) : null}

      {session?.user && (
        <ListPropertyModal
          isOpen={isListModalOpen || !!editingProperty}
          userId={session.user.id}
          onClose={() => {
            setIsListModalOpen(false);
            setEditingProperty(null);
          }}
          onCreated={(property) => setDbProperties((prev) => [property, ...prev])}
          onUpdated={(property) =>
            setDbProperties((prev) =>
              prev.map((item) => (item.id === property.id ? property : item))
            )
          }
          mode={editingProperty ? 'edit' : 'create'}
          initialProperty={editingProperty}
        />
      )}

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
