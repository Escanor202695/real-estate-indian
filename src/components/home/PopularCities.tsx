
import React from 'react';
import CityCard from './CityCard';
import { City } from '@/types/city';

// Mock data for popular cities
const popularCities: City[] = [
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
    id: '2',
    name: 'Delhi',
    state: 'Delhi',
    propertyCount: 1897,
    searchCount: 4980,
    isActive: true,
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=800&auto=format&fit=crop'
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
    id: '4',
    name: 'Hyderabad',
    state: 'Telangana',
    propertyCount: 1756,
    searchCount: 3890,
    isActive: true,
    image: 'https://images.unsplash.com/photo-1572920629925-9e1cc7517fb7?q=80&w=800&auto=format&fit=crop'
  }
];

const PopularCities = () => {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-clickprop-text">
            Popular Cities
          </h2>
          <a href="/cities" className="text-clickprop-blue hover:underline">
            View All Cities
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularCities.map((city) => (
            <CityCard key={city.id} city={city} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCities;
