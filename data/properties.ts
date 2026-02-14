export type Property = {
  id: string;
  sellerId?: string;
  title: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  price: number;
  listingType: 'sale' | 'rent';
  propertyType: 'house' | 'condo' | 'apartment' | 'townhouse' | 'villa';
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  yearBuilt: number;
  isNew: boolean;
  isFeatured: boolean;
  description: string;
  features: string[];
  panoramas: { url: string; label: string }[];
  thumbnailUrl?: string;
  matterportUrl: string;
  agent: {
    name: string;
    phone: string;
    email: string;
    photo: string;
  };
};

export const properties: Property[] = [
  {
    id: 'prop-1',
    title: 'Skyline Modern Loft',
    address: '128 Market Street',
    city: 'San Francisco',
    state: 'CA',
    zip: '94105',
    price: 1825000,
    listingType: 'sale',
    propertyType: 'condo',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1460,
    yearBuilt: 2018,
    isNew: true,
    isFeatured: true,
    description:
      'A bright, glass-wrapped loft with skyline views, high ceilings, and a chef-grade kitchen. Steps from the waterfront with effortless access to transit and dining.',
    features: [
      'Floor-to-ceiling windows',
      'Private balcony',
      'Smart home lighting',
      'Concierge service',
      'Fitness center access',
      'EV charging',
    ],
    panoramas: [
      { url: 'https://pannellum.org/images/alma.jpg', label: 'Living Room' },
      { url: 'https://pannellum.org/images/bma-1.jpg', label: 'Kitchen' },
      { url: 'https://pannellum.org/images/cerro-toco-0.jpg', label: 'City View' },
    ],
    matterportUrl: 'https://my.matterport.com/show/?m=CD7sMSjX8rT',
    agent: {
      name: 'Ava Brooks',
      phone: '(415) 555-0191',
      email: 'ava.brooks@panoproperty.com',
      photo: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=400&q=80',
    },
  },
  {
    id: 'prop-2',
    title: 'Mission Garden Flat',
    address: '742 Valencia Street',
    city: 'San Francisco',
    state: 'CA',
    zip: '94110',
    price: 5400,
    listingType: 'rent',
    propertyType: 'apartment',
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1280,
    yearBuilt: 2014,
    isNew: false,
    isFeatured: true,
    description:
      'A sunlit garden flat with modern finishes, in-unit laundry, and a private patio. Walkable to cafes, parks, and nightlife.',
    features: [
      'Private patio',
      'In-unit laundry',
      'Quartz countertops',
      'Pet friendly',
      'Bike storage',
      'Smart thermostat',
    ],
    panoramas: [
      { url: 'https://pannellum.org/images/bma-1.jpg', label: 'Kitchen' },
      { url: 'https://pannellum.org/images/alma.jpg', label: 'Living Room' },
      { url: 'https://pannellum.org/images/cerro-toco-0.jpg', label: 'Patio View' },
    ],
    matterportUrl: 'https://my.matterport.com/show/?m=Gd8A1xAdG7R',
    agent: {
      name: 'Noah Reed',
      phone: '(415) 555-0137',
      email: 'noah.reed@panoproperty.com',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    },
  },
  {
    id: 'prop-3',
    title: 'Pacific Heights Classic',
    address: '2108 Jackson Street',
    city: 'San Francisco',
    state: 'CA',
    zip: '94115',
    price: 3650000,
    listingType: 'sale',
    propertyType: 'house',
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2850,
    yearBuilt: 1922,
    isNew: false,
    isFeatured: false,
    description:
      'A timeless residence with restored detailing, generous entertaining spaces, and a landscaped backyard. Quiet street with nearby parks and schools.',
    features: [
      'Restored hardwood floors',
      'Chef kitchen',
      'Garden terrace',
      'Wine storage',
      'Two-car garage',
      'Fireplace',
    ],
    panoramas: [
      { url: 'https://pannellum.org/images/cerro-toco-0.jpg', label: 'Dining Room' },
      { url: 'https://pannellum.org/images/alma.jpg', label: 'Living Room' },
      { url: 'https://pannellum.org/images/bma-1.jpg', label: 'Kitchen' },
    ],
    matterportUrl: 'https://my.matterport.com/show/?m=ZKPjvLw8jNr',
    agent: {
      name: 'Liam Chen',
      phone: '(415) 555-0188',
      email: 'liam.chen@panoproperty.com',
      photo: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=400&q=80',
    },
  },
  {
    id: 'prop-4',
    title: 'SoMa Skyline Townhome',
    address: '88 Townsend Street',
    city: 'San Francisco',
    state: 'CA',
    zip: '94107',
    price: 9200,
    listingType: 'rent',
    propertyType: 'townhouse',
    bedrooms: 3,
    bathrooms: 3,
    sqft: 2100,
    yearBuilt: 2020,
    isNew: true,
    isFeatured: false,
    description:
      'Contemporary townhome with rooftop lounge, open-concept living, and skyline views. Close to waterfront trails and tech campuses.',
    features: [
      'Rooftop deck',
      'Home office',
      'Two-car garage',
      'Gas range',
      'Smart locks',
      'Floor-to-ceiling windows',
    ],
    panoramas: [
      { url: 'https://pannellum.org/images/alma.jpg', label: 'Great Room' },
      { url: 'https://pannellum.org/images/cerro-toco-0.jpg', label: 'Rooftop View' },
      { url: 'https://pannellum.org/images/bma-1.jpg', label: 'Kitchen' },
    ],
    matterportUrl: 'https://my.matterport.com/show/?m=4S6Sp6V1yo8',
    agent: {
      name: 'Sofia Martinez',
      phone: '(415) 555-0144',
      email: 'sofia.martinez@panoproperty.com',
      photo: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=400&q=80',
    },
  },
  {
    id: 'prop-5',
    title: 'Nob Hill View Residence',
    address: '1501 California Street',
    city: 'San Francisco',
    state: 'CA',
    zip: '94109',
    price: 2350000,
    listingType: 'sale',
    propertyType: 'apartment',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1625,
    yearBuilt: 2011,
    isNew: false,
    isFeatured: true,
    description:
      'An elevated corner residence with sweeping bay views, curated finishes, and hotel-style amenities in the heart of Nob Hill.',
    features: [
      'Bay view terrace',
      '24/7 concierge',
      'Spa and pool',
      'Yoga studio',
      'Guest suite',
      'Package room',
    ],
    panoramas: [
      { url: 'https://pannellum.org/images/cerro-toco-0.jpg', label: 'View Lounge' },
      { url: 'https://pannellum.org/images/bma-1.jpg', label: 'Kitchen' },
      { url: 'https://pannellum.org/images/alma.jpg', label: 'Primary Suite' },
    ],
    matterportUrl: 'https://my.matterport.com/show/?m=9s4WcA9WsnS',
    agent: {
      name: 'Ethan Park',
      phone: '(415) 555-0102',
      email: 'ethan.park@panoproperty.com',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    },
  },
  {
    id: 'prop-6',
    title: 'Marina Bay Villa',
    address: '3250 Scott Street',
    city: 'San Francisco',
    state: 'CA',
    zip: '94123',
    price: 4200000,
    listingType: 'sale',
    propertyType: 'villa',
    bedrooms: 5,
    bathrooms: 4,
    sqft: 3420,
    yearBuilt: 2006,
    isNew: false,
    isFeatured: false,
    description:
      'A serene villa with indoor-outdoor living, a private courtyard, and a light-filled great room. Minutes from the bay and dining.',
    features: [
      'Private courtyard',
      'Chef kitchen',
      'Spa bath',
      'Media room',
      'Outdoor kitchen',
      'Solar panels',
    ],
    panoramas: [
      { url: 'https://pannellum.org/images/alma.jpg', label: 'Great Room' },
      { url: 'https://pannellum.org/images/bma-1.jpg', label: 'Kitchen' },
      { url: 'https://pannellum.org/images/cerro-toco-0.jpg', label: 'Courtyard' },
    ],
    matterportUrl: 'https://my.matterport.com/show/?m=3DgF2D9aK8q',
    agent: {
      name: 'Mia Patel',
      phone: '(415) 555-0159',
      email: 'mia.patel@panoproperty.com',
      photo: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=400&q=80',
    },
  },
];

export const cities = Array.from(new Set(properties.map((p) => p.city))).sort();

export const propertyTypes: Property['propertyType'][] = [
  'house',
  'condo',
  'apartment',
  'townhouse',
  'villa',
];
