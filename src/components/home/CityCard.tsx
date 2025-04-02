
import React from 'react';
import { Link } from 'react-router-dom';
import { Building } from 'lucide-react';
import { City } from '@/types/city';

interface CityCardProps {
  city: City;
}

const CityCard: React.FC<CityCardProps> = ({ city }) => {
  return (
    <Link to={`/cities/${city.name}`} className="city-card block">
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
  );
};

export default CityCard;
