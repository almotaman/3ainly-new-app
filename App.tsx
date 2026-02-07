import { useState, useMemo, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { SearchFilters, type Filters } from './components/SearchFilters';
import { PropertyCard } from './components/PropertyCard';
import { PropertyDetail } from './components/PropertyDetail';
import { Footer } from './components/Footer';
import { properties } from './data/properties';
import { TrendingUp, Award, Clock, Search } from 'lucide-react';

type Page = 'home' | 'detail';

export function App() {
  const [page, setPage] = useState<Page>('home');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortBy, setSortBy] = useState<string>('featured');
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

  const handleSearchFocus = useCallback(() => {
    filtersRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const filteredProperties = useMemo(() => {
    let result = properties.filter((p) => {
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
  }, [filters, sortBy]);

  const handleSelectProperty = (id: string) => {
    setSelectedPropertyId(id);
    setPage('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (target: Page) => {
    setPage(target);
    if (target === 'home') {
      setSelectedPropertyId(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedProperty = properties.find((p) => p.id === selectedPropertyId);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header onNavigate={handleNavigate} currentPage={page} />

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
                  {properties
                    .filter((p) => p.isFeatured)
                    .slice(0, 2)
                    .map((property) => (
                      <div key={property.id} className="relative">
                        <div className="absolute -top-2 -right-2 z-10 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center shadow-lg">
                          <Award size={16} className="text-white" />
                        </div>
                        <PropertyCard property={property} onSelect={handleSelectProperty} />
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
      ) : page === 'detail' && selectedProperty ? (
        <PropertyDetail property={selectedProperty} onBack={() => handleNavigate('home')} />
      ) : null}
    </div>
  );
}
