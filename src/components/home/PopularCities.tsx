
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { City } from '@/types/city';
import CityCard from './CityCard';

// Static city data for major Indian cities
const staticCities: City[] = [
  {
    id: '1',
    name: 'Mumbai',
    image: 'https://images.unsplash.com/photo-1562979314-bee7453e911c?q=80&w=1974&auto=format&fit=crop',
    propertyCount: 0,
    searchCount: 0,
    description: 'The financial capital of India',
    isActive: true
  },
  {
    id: '2',
    name: 'Delhi',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=2070&auto=format&fit=crop',
    propertyCount: 0,
    searchCount: 0,
    description: 'The capital city of India',
    isActive: true
  },
  {
    id: '3',
    name: 'Bangalore',
    image: 'https://images.unsplash.com/photo-1596796867443-48ab30b5c7fe?q=80&w=1935&auto=format&fit=crop',
    propertyCount: 0,
    searchCount: 0,
    description: 'The Silicon Valley of India',
    isActive: true
  },
  {
    id: '4',
    name: 'Hyderabad',
    image: 'https://images.unsplash.com/photo-1519058621832-2f773fb74150?q=80&w=1974&auto=format&fit=crop',
    propertyCount: 0,
    searchCount: 0,
    description: 'The City of Pearls',
    isActive: true
  },
  {
    id: '5',
    name: 'Chennai',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1974&auto=format&fit=crop',
    propertyCount: 0,
    searchCount: 0,
    description: 'The Detroit of India',
    isActive: true
  },
  {
    id: '6',
    name: 'Kolkata',
    image: 'https://images.unsplash.com/photo-1536421469767-80559bb6f5e1?q=80&w=1974&auto=format&fit=crop',
    propertyCount: 0,
    searchCount: 0,
    description: 'The City of Joy',
    isActive: true
  },
  {
    id: '7',
    name: 'Pune',
    image: 'https://images.unsplash.com/photo-1619430041588-7417ab2a83c3?q=80&w=2070&auto=format&fit=crop',
    propertyCount: 0,
    searchCount: 0,
    description: 'The Oxford of the East',
    isActive: true
  },
  {
    id: '8',
    name: 'Ahmedabad',
    image: 'https://images.unsplash.com/photo-1570863029966-2ae040e0ccb9?q=80&w=2074&auto=format&fit=crop',
    propertyCount: 0,
    searchCount: 0,
    description: 'The Manchester of India',
    isActive: true
  }
];

const PopularCities = () => {
  const navigate = useNavigate();

  const handleCityClick = (city: City) => {
    const params = new URLSearchParams();
    params.append('location', city.name);
    navigate(`/properties?${params.toString()}`);
  };

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
          {staticCities.map((city) => (
            <div key={city.id} onClick={() => handleCityClick(city)} className="cursor-pointer">
              <CityCard city={city} hideCounts={true} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCities;
