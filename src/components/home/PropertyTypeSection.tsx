
import React from 'react';
import { Link } from 'react-router-dom';
import { Building, Home, Castle, Map, Store, Users } from 'lucide-react';

const propertyTypes = [
  { name: 'Flats', icon: Building, url: '/properties?type=flat' },
  { name: 'Houses', icon: Home, url: '/properties?type=house' },
  { name: 'Villas', icon: Castle, url: '/properties?type=villa' },
  { name: 'Plots', icon: Map, url: '/properties?type=plot' },
  { name: 'Commercial', icon: Store, url: '/properties?type=commercial' },
  { name: 'PG/Co-living', icon: Users, url: '/properties?type=pg' },
];

const PropertyTypeSection = () => {
  return (
    <section className="py-12 bg-clickprop-bg-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-clickprop-text">
          Browse Properties by Type
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {propertyTypes.map((type) => (
            <Link 
              key={type.name}
              to={type.url}
              className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="w-12 h-12 flex items-center justify-center bg-clickprop-blue/10 text-clickprop-blue rounded-full mb-3">
                <type.icon size={24} />
              </div>
              <span className="text-clickprop-text font-medium">{type.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PropertyTypeSection;
