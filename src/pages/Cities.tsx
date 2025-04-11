
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import CityCard from '@/components/home/CityCard';
import { City } from '@/types/city';
import { getCities } from '@/services/cityService';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const Cities = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data, isLoading } = useQuery({
    queryKey: ['cities'],
    queryFn: getCities
  });

  const cities = data?.data || [];
  
  // Filter cities based on search term
  const filteredCities = cities.filter((city: City) => 
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCityClick = (city: City) => {
    const params = new URLSearchParams();
    params.append('location', city.name);
    navigate(`/properties?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Just filter the existing list, no need to refetch
  };

  return (
    <div className="bg-white">
      <div className="bg-clickprop-blue py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white text-center">
            Browse Properties by City
          </h1>
          <p className="text-white/80 mt-4 text-center max-w-3xl mx-auto">
            Explore real estate options across major cities in India. Find the perfect
            property in your preferred location.
          </p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSearch} className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search cities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-0 top-0 h-full bg-transparent hover:bg-transparent text-gray-500"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </form>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-clickprop-blue"></div>
          </div>
        ) : (
          <>
            {filteredCities.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl">No cities found matching "{searchTerm}"</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredCities.map((city: City) => (
                  <div
                    key={city.id}
                    onClick={() => handleCityClick(city)}
                    className="cursor-pointer"
                  >
                    <CityCard city={city} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Cities;
