
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PropertyList from '@/components/properties/PropertyList';
import SearchBar from '@/components/global/SearchBar';
import { Property } from '@/types/property';
import { City } from '@/types/city';
import { MapPin, Building } from 'lucide-react';

// Mock data for properties
const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Luxurious 3BHK Apartment in Bandra',
    description: 'Spacious apartment with modern amenities and great sea view.',
    type: 'flat',
    status: 'sale',
    price: 9500000,
    size: 1450,
    bedrooms: 3,
    bathrooms: 2,
    location: {
      address: 'Palm Avenue',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050'
    },
    amenities: ['Swimming Pool', 'Gym', 'Security'],
    features: ['Modular Kitchen', 'Furnished'],
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop'],
    externalLink: "https://example.com/property/1",
    isActive: true,
    views: 342
  },
  {
    id: '5',
    title: '3BHK Independent House in Adyar',
    description: 'Well-maintained independent house with garden and car parking.',
    type: 'house',
    status: 'sale',
    price: 7800000,
    size: 1800,
    bedrooms: 3,
    bathrooms: 3,
    location: {
      address: 'Adyar',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600020'
    },
    amenities: ['Parking', 'Garden', 'Security'],
    features: ['Modular Kitchen', 'Furnished'],
    images: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=800&auto=format&fit=crop'],
    externalLink: "https://example.com/property/5",
    isActive: true,
    views: 210
  },
  {
    id: '6',
    title: 'Premium 2BHK Flat in Koramangala',
    description: 'Modern apartment with premium amenities in a prime location.',
    type: 'flat',
    status: 'sale',
    price: 8500000,
    size: 1200,
    bedrooms: 2,
    bathrooms: 2,
    location: {
      address: 'Koramangala',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560034'
    },
    amenities: ['Swimming Pool', 'Gym', 'Club House'],
    features: ['Modular Kitchen', 'Furnished', 'Balcony'],
    images: ['https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800&auto=format&fit=crop'],
    externalLink: "https://example.com/property/6",
    isActive: true,
    views: 178
  }
];

// Mock data for cities
const mockCities: City[] = [
  {
    id: '1',
    name: 'Mumbai',
    state: 'Maharashtra',
    propertyCount: 2356,
    searchCount: 5420,
    isActive: true,
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '3',
    name: 'Bangalore',
    state: 'Karnataka',
    propertyCount: 2145,
    searchCount: 5120,
    isActive: true,
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '5',
    name: 'Chennai',
    state: 'Tamil Nadu',
    propertyCount: 1623,
    searchCount: 3750,
    isActive: true,
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=800&auto=format&fit=crop'
  }
];

const CityDetail = () => {
  const { name } = useParams<{ name: string }>();
  const [city, setCity] = useState<City | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call to get city details
    setLoading(true);
    
    setTimeout(() => {
      const foundCity = mockCities.find(c => c.name.toLowerCase() === name?.toLowerCase());
      setCity(foundCity || null);
      
      // Filter properties for the city
      const cityProperties = mockProperties.filter(
        p => p.location.city.toLowerCase() === name?.toLowerCase()
      );
      setProperties(cityProperties);
      
      setLoading(false);
    }, 500);
  }, [name]);
  
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="h-48 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (!city) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-clickprop-text mb-4">City Not Found</h2>
          <p className="text-clickprop-text-secondary mb-6">
            The city you're looking for doesn't exist or has no properties listed.
          </p>
          <a href="/cities" className="text-clickprop-blue hover:underline">
            View All Cities
          </a>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-clickprop-bg-light min-h-screen">
      <div className="relative">
        <div className="h-64 w-full overflow-hidden">
          <img 
            src={city.image || '/placeholder.svg'} 
            alt={city.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Properties in {city.name}
            </h1>
            <div className="flex items-center">
              <MapPin size={16} className="mr-1" />
              <span>{city.state}, India</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 -mt-12 mb-8 relative z-10">
          <SearchBar />
        </div>
        
        <div className="flex items-center mb-6">
          <Building size={20} className="text-clickprop-blue mr-2" />
          <h2 className="text-2xl font-bold text-clickprop-text">
            {properties.length} Properties in {city.name}
          </h2>
        </div>
        
        <PropertyList properties={properties} />
      </div>
    </div>
  );
};

export default CityDetail;
