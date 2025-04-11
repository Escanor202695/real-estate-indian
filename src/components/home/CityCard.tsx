
import React from 'react';
import { City } from '@/types/city';

type CityCardProps = {
  city: City;
  hideCounts?: boolean;
};

const CityCard = ({ city, hideCounts = false }: CityCardProps) => {
  return (
    <div className="relative rounded-lg overflow-hidden h-60 group">
      <img
        src={city.image}
        alt={city.name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex flex-col justify-end p-4">
        <h3 className="text-white text-xl font-bold mb-1">{city.name}</h3>
        {!hideCounts && (
          <p className="text-white/80 text-sm">
            {city.propertyCount} properties
          </p>
        )}
      </div>
    </div>
  );
};

export default CityCard;
