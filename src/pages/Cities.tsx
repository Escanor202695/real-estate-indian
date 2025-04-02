
import React from 'react';
import { Link } from 'react-router-dom';
import { City } from '@/types/city';
import { Building } from 'lucide-react';

// Mock data for cities
const allCities: City[] = [
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
  },
  {
    id: '5',
    name: 'Chennai',
    state: 'Tamil Nadu',
    propertyCount: 1623,
    searchCount: 3750,
    isActive: true,
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '6',
    name: 'Kolkata',
    state: 'West Bengal',
    propertyCount: 1456,
    searchCount: 3210,
    isActive: true,
    image: 'https://images.unsplash.com/photo-1558431382-27e303142255?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '7',
    name: 'Pune',
    state: 'Maharashtra',
    propertyCount: 1845,
    searchCount: 4120,
    isActive: true,
    image: 'https://images.unsplash.com/photo-1564763444435-380d5aecdebf?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '8',
    name: 'Ahmedabad',
    state: 'Gujarat',
    propertyCount: 1378,
    searchCount: 2980,
    isActive: true,
    image: 'https://images.unsplash.com/photo-1595658658481-d53d628f8f86?q=80&w=800&auto=format&fit=crop'
  }
];

const Cities = () => {
  // Group cities by state
  const citiesByState: { [key: string]: City[] } = {};
  
  allCities.forEach(city => {
    if (!citiesByState[city.state]) {
      citiesByState[city.state] = [];
    }
    citiesByState[city.state].push(city);
  });
  
  return (
    <div className="bg-clickprop-bg-light min-h-screen">
      <div className="bg-clickprop-blue py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white text-center">
            Browse Properties by City
          </h1>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {allCities.slice(0, 8).map(city => (
            <Link
              key={city.id}
              to={`/cities/${city.name}`}
              className="city-card block"
            >
              <img 
                src={city.image || '/placeholder.svg'} 
                alt={city.name} 
                className="w-full h-48 object-cover"
              />
              <div className="city-card-overlay">
                <h3 className="text-xl font-semibold">{city.name}</h3>
                <p className="flex items-center text-sm mt-1">
                  <Building size={14} className="mr-1" />
                  {city.propertyCount} Properties
                </p>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-clickprop-text mb-6">
            All Cities by State
          </h2>
          
          <div className="space-y-8">
            {Object.entries(citiesByState).map(([state, cities]) => (
              <div key={state}>
                <h3 className="text-xl font-semibold text-clickprop-blue mb-4">{state}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {cities.map(city => (
                    <Link 
                      key={city.id}
                      to={`/cities/${city.name}`}
                      className="flex items-center space-x-2 p-2 hover:bg-clickprop-bg-gray rounded"
                    >
                      <Building size={16} className="text-clickprop-blue" />
                      <div>
                        <span className="text-clickprop-text">{city.name}</span>
                        <span className="text-xs text-clickprop-text-secondary ml-2">
                          ({city.propertyCount})
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cities;
