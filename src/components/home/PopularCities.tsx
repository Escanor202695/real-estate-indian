
import React, { useEffect, useState } from 'react';
import CityCard from './CityCard';
import { City } from '@/types/city';
import { getPopularCities } from '@/services/cityService';
import { useToast } from '@/components/ui/use-toast';

const PopularCities = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true);
        const response = await getPopularCities();
        setCities(response.data);
      } catch (error) {
        console.error('Error fetching popular cities:', error);
        toast({
          title: 'Error',
          description: 'Failed to load popular cities',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, [toast]);

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
              <CityCard key={city.id} city={city} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularCities;
