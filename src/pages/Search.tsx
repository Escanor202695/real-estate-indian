
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PropertyList from '@/components/properties/PropertyList';
import SearchBar from '@/components/global/SearchBar';
import { Property } from '@/types/property';
import { Button } from "@/components/ui/button";
import { MapPin, BookmarkPlus } from 'lucide-react';

// Mock data
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
    isActive: true,
    views: 342
  },
  {
    id: '2',
    title: 'Modern 2BHK Apartment for Rent',
    description: 'Well-maintained apartment in a prime location with all amenities.',
    type: 'flat',
    status: 'rent',
    price: 35000,
    size: 1050,
    bedrooms: 2,
    bathrooms: 2,
    location: {
      address: 'Indiranagar',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560038'
    },
    amenities: ['Parking', 'Security', 'Power Backup'],
    features: ['Air Conditioner', 'Furnished'],
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&auto=format&fit=crop'],
    isActive: true,
    views: 256
  },
  {
    id: '3',
    title: 'Spacious 4BHK Villa with Garden',
    description: 'Beautiful villa with large garden, modern interiors and premium fittings.',
    type: 'villa',
    status: 'sale',
    price: 15000000,
    size: 2800,
    bedrooms: 4,
    bathrooms: 4,
    location: {
      address: 'Jubilee Hills',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500033'
    },
    amenities: ['Swimming Pool', 'Garden', 'Security'],
    features: ['Modular Kitchen', 'Furnished', 'Terrace'],
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop'],
    isActive: true,
    views: 198
  }
];

const Search = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useState<URLSearchParams>();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchParams(params);
    
    // Simulate API call with search parameters
    setLoading(true);
    
    setTimeout(() => {
      // Filter properties based on search params
      const filteredProperties = mockProperties.filter(property => {
        const locationParam = params.get('location');
        const typeParam = params.get('type');
        const statusParam = params.get('status');
        
        // Check location (city or address)
        if (locationParam && !property.location.city.toLowerCase().includes(locationParam.toLowerCase()) && 
            !property.location.address.toLowerCase().includes(locationParam.toLowerCase())) {
          return false;
        }
        
        // Check property type
        if (typeParam && typeParam !== 'all' && property.type !== typeParam) {
          return false;
        }
        
        // Check status (sale/rent)
        if (statusParam && statusParam !== 'all' && property.status !== statusParam) {
          return false;
        }
        
        return true;
      });
      
      setProperties(filteredProperties);
      setLoading(false);
    }, 1000);
  }, [location.search]);
  
  // Helper function to construct the search summary
  const getSearchSummary = () => {
    if (!searchParams) return 'Properties';
    
    const location = searchParams.get('location');
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    
    let summary = '';
    
    if (type && type !== 'all') {
      summary += type.charAt(0).toUpperCase() + type.slice(1) + 's ';
    } else {
      summary += 'Properties ';
    }
    
    if (status && status !== 'all') {
      summary += `for ${status === 'sale' ? 'sale' : 'rent'} `;
    }
    
    if (location) {
      summary += `in ${location}`;
    }
    
    return summary || 'All Properties';
  };
  
  return (
    <div className="bg-clickprop-bg-light min-h-screen">
      <div className="bg-clickprop-blue py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white text-center mb-8">
            Search Results
          </h1>
          <SearchBar className="lg:w-3/4 mx-auto" />
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-clickprop-text mb-2">
              {getSearchSummary()}
            </h2>
            <p className="text-clickprop-text-secondary">
              Found {properties.length} properties matching your search
            </p>
          </div>
          
          <Button variant="outline" className="mt-4 md:mt-0 flex items-center">
            <BookmarkPlus className="h-4 w-4 mr-2" />
            Save Search
          </Button>
        </div>
        
        {searchParams?.get('location') && (
          <div className="p-4 bg-clickprop-bg-gray rounded-lg flex items-center mb-6">
            <MapPin className="h-5 w-5 text-clickprop-blue mr-2" />
            <span className="text-clickprop-text-secondary">
              Showing properties in <span className="font-medium text-clickprop-text">{searchParams.get('location')}</span>
            </span>
          </div>
        )}
        
        <PropertyList properties={properties} loading={loading} />
      </div>
    </div>
  );
};

export default Search;
