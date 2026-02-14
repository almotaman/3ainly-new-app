import { Search, SlidersHorizontal, X } from 'lucide-react';

export interface Filters {
  search: string;
  city: string;
  propertyType: string;
  listingType: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  bathrooms: string;
}

interface SearchFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  showAdvanced: boolean;
  onToggleAdvanced: () => void;
  resultCount: number;
  cities: string[];
  propertyTypes: string[];
}

export function SearchFilters({
  filters,
  onFiltersChange,
  showAdvanced,
  onToggleAdvanced,
  resultCount,
  cities,
  propertyTypes,
}: SearchFiltersProps) {
  const update = (key: keyof Filters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearAll = () => {
    onFiltersChange({
      search: '',
      city: '',
      propertyType: '',
      listingType: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
    });
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      {/* Main search bar */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by city, address, or property name..."
            value={filters.search}
            onChange={(e) => update('search', e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
        <button
          onClick={onToggleAdvanced}
          className={`px-4 py-3 rounded-xl border transition-all flex items-center gap-2 font-medium ${
            showAdvanced
              ? 'bg-blue-50 border-blue-200 text-blue-600'
              : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
          }`}
        >
          <SlidersHorizontal size={18} />
          <span className="hidden sm:inline">Filters</span>
        </button>
      </div>

      {/* Quick filter chips */}
      <div className="flex gap-2 flex-wrap mb-4">
        {['sale', 'rent'].map(type => (
          <button
            key={type}
            onClick={() => update('listingType', filters.listingType === type ? '' : type)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filters.listingType === type
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            For {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
        <div className="w-px bg-gray-200 mx-1" />
        {propertyTypes.map(type => (
          <button
            key={type}
            onClick={() => update('propertyType', filters.propertyType === type ? '' : type)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all capitalize ${
              filters.propertyType === type
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Advanced filters */}
      {showAdvanced && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">City</label>
            <select
              value={filters.city}
              onChange={(e) => update('city', e.target.value)}
              className="w-full py-2.5 px-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">All Cities</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Min Price</label>
            <input
              type="number"
              placeholder="No min"
              value={filters.minPrice}
              onChange={(e) => update('minPrice', e.target.value)}
              className="w-full py-2.5 px-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Max Price</label>
            <input
              type="number"
              placeholder="No max"
              value={filters.maxPrice}
              onChange={(e) => update('maxPrice', e.target.value)}
              className="w-full py-2.5 px-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Beds</label>
              <select
                value={filters.bedrooms}
                onChange={(e) => update('bedrooms', e.target.value)}
                className="w-full py-2.5 px-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">Any</option>
                {[1,2,3,4,5,6,7].map(n => (
                  <option key={n} value={n}>{n}+</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Baths</label>
              <select
                value={filters.bathrooms}
                onChange={(e) => update('bathrooms', e.target.value)}
                className="w-full py-2.5 px-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">Any</option>
                {[1,2,3,4,5].map(n => (
                  <option key={n} value={n}>{n}+</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Results count & clear */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
        <p className="text-sm text-gray-500">
          <span className="font-bold text-gray-900">{resultCount}</span> properties found
        </p>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
          >
            <X size={14} />
            Clear all filters
          </button>
        )}
      </div>
    </div>
  );
}
