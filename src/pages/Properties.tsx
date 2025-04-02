
import React, { useState } from 'react';
import PropertyList from '@/components/properties/PropertyList';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Property } from '@/types/property';
import { Search, Filter, Grid, List } from 'lucide-react';

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
    externalLink: "https://example.com/property/2",
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
    externalLink: "https://example.com/property/3",
    isActive: true,
    views: 198
  },
  {
    id: '4',
    title: 'Commercial Space in Tech Park',
    description: 'Ready-to-move commercial space suitable for offices or retail.',
    type: 'commercial',
    status: 'rent',
    price: 80000,
    size: 2000,
    bedrooms: 0,
    bathrooms: 2,
    location: {
      address: 'Electronic City',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560100'
    },
    amenities: ['Parking', 'Security', '24/7 Access'],
    features: ['Air Conditioner', 'Power Backup'],
    images: ['https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=800&auto=format&fit=crop'],
    externalLink: "https://example.com/property/4",
    isActive: true,
    views: 145
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

const Properties = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [loading, setLoading] = useState(false);
  
  // Filter states
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("all");
  const [status, setStatus] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 20000000]);
  const [bedrooms, setBedrooms] = useState("any");
  
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };
  
  const applyFilters = () => {
    setLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Filter logic would be here in a real app
      // This is just mock implementation
      const filtered = mockProperties.filter((property) => {
        // Filter by location
        if (location && !property.location.city.toLowerCase().includes(location.toLowerCase()) && 
            !property.location.address.toLowerCase().includes(location.toLowerCase())) {
          return false;
        }
        
        // Filter by property type
        if (propertyType !== 'all' && property.type !== propertyType) {
          return false;
        }
        
        // Filter by status
        if (status !== 'all' && property.status !== status) {
          return false;
        }
        
        // Filter by price
        if (property.price < priceRange[0] || property.price > priceRange[1]) {
          return false;
        }
        
        // Filter by bedrooms
        if (bedrooms !== 'any' && property.bedrooms !== parseInt(bedrooms)) {
          return false;
        }
        
        return true;
      });
      
      setProperties(filtered);
      setLoading(false);
    }, 500);
  };
  
  return (
    <div className="bg-white">
      <div className="bg-clickprop-blue py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white text-center">
            Browse All Properties
          </h1>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Button 
              variant="outline" 
              className="flex items-center mr-4"
              onClick={toggleFilter}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
          
          <div className="flex items-center">
            <span className="text-clickprop-text-secondary mr-2">
              {properties.length} properties
            </span>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters */}
          <div className={`lg:w-1/4 bg-white p-6 rounded-lg shadow-sm ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <h2 className="text-xl font-semibold mb-4 text-clickprop-text">Filters</h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-clickprop-text-secondary mb-1">
                  Location
                </label>
                <Input
                  id="location"
                  type="text"
                  placeholder="City or locality"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="property-type" className="block text-sm font-medium text-clickprop-text-secondary mb-1">
                  Property Type
                </label>
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger id="property-type">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="flat">Flat</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="plot">Plot</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="pg">PG/Co-living</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-clickprop-text-secondary mb-1">
                  Status
                </label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Buy or Rent" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Buy or Rent</SelectItem>
                    <SelectItem value="sale">Buy</SelectItem>
                    <SelectItem value="rent">Rent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-clickprop-text-secondary mb-3">
                  Price Range (₹)
                </label>
                <Slider
                  defaultValue={[0, 20000000]}
                  max={20000000}
                  step={100000}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-clickprop-text-secondary">
                  <span>₹{priceRange[0].toLocaleString()}</span>
                  <span>₹{priceRange[1].toLocaleString()}</span>
                </div>
              </div>
              
              <div>
                <label htmlFor="bedrooms" className="block text-sm font-medium text-clickprop-text-secondary mb-1">
                  Bedrooms
                </label>
                <Select value={bedrooms} onValueChange={setBedrooms}>
                  <SelectTrigger id="bedrooms">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button
                className="w-full bg-clickprop-blue hover:bg-clickprop-blue-dark"
                onClick={applyFilters}
              >
                <Search className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </div>
          
          {/* Property List */}
          <div className="lg:w-3/4">
            <PropertyList properties={properties} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Properties;
