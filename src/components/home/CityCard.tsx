
import React from 'react';
import { Building } from 'lucide-react';
import { City } from '@/types/city';

interface CityCardProps {
  city: City;
}

const CityCard: React.FC<CityCardProps> = ({ city }) => {
  return (
    <div className="city-card block rounded-lg overflow-hidden shadow-md transition-transform hover:scale-105">
      <div className="relative h-48">
        <img 
          src={city.image || '/placeholder.svg'} 
          alt={city.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-4">
          <h3 className="text-xl font-semibold text-white">{city.name}</h3>
          <p className="flex items-center text-sm mt-1 text-white">
            <Building size={14} className="mr-1" />
            {city.propertyCount} Properties
          </p>
        </div>
      </div>
    </div>
  );
};

export default CityCard;
