
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CityCard from './CityCard';
import { City } from '@/types/city';
import { getPopularCities } from '@/services/cityService';
import { useToast } from '@/components/ui/use-toast';

// Fallback city data for major Indian cities
const fallbackCities: City[] = [
  {
    id: '1',
    name: 'Mumbai',
    image: 'https://images.unsplash.com/photo-1562979314-bee7453e911c?q=80&w=1974&auto=format&fit=crop',
    propertyCount: 1245,
    searchCount: 5600,
    description: 'The financial capital of India',
    isActive: true
  },
  {
    id: '2',
    name: 'Delhi',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=2070&auto=format&fit=crop',
    propertyCount: 980,
    searchCount: 4800,
    description: 'The capital city of India',
    isActive: true
  },
  {
    id: '3',
    name: 'Bangalore',
    image: 'https://images.unsplash.com/photo-1596796867443-48ab30b5c7fe?q=80&w=1935&auto=format&fit=crop',
    propertyCount: 1560,
    searchCount: 6200,
    description: 'The Silicon Valley of India',
    isActive: true
  },
  {
    id: '4',
    name: 'Hyderabad',
    image: 'https://images.unsplash.com/photo-1519058621832-2f773fb74150?q=80&w=1974&auto=format&fit=crop',
    propertyCount: 875,
    searchCount: 3900,
    description: 'The City of Pearls',
    isActive: true
  }
];

const PopularCities = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true);
        const response = await getPopularCities();
        if (response.data && response.data.length > 0) {
          setCities(response.data);
        } else {
          // Use fallback data if API returns empty
          setCities(fallbackCities);
        }
      } catch (error) {
        console.error('Error fetching popular cities:', error);
        // Use fallback data on error
        setCities(fallbackCities);
        toast({
          title: 'Notice',
          description: 'Using default city data',
          variant: 'default',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, [toast]);

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
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cities.map((city) => (
              <div key={city.id} onClick={() => handleCityClick(city)} className="cursor-pointer">
                <CityCard city={city} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularCities;
