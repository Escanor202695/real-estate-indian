
import React from 'react';
import PropertyList from '../properties/PropertyList';
import { Property } from '@/types/property';

// Mock data for featured properties
const featuredProperties: Property[] = [
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

const FeaturedProperties = () => {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-clickprop-text">
            Featured Properties
          </h2>
          <a href="/properties" className="text-clickprop-blue hover:underline">
            View All Properties
          </a>
        </div>
        
        <PropertyList properties={featuredProperties} />
      </div>
    </section>
  );
};

export default FeaturedProperties;
