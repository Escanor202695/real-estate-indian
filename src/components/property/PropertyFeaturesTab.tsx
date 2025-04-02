
import React from 'react';
import { Check } from 'lucide-react';
import { Property } from '@/types/property';

interface PropertyFeaturesTabProps {
  property: Property;
}

const PropertyFeaturesTab: React.FC<PropertyFeaturesTabProps> = ({ property }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-clickprop-text">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-3">
          {property.features.map((feature, index) => (
            <div key={index} className="flex items-center">
              <Check size={16} className="text-clickprop-green mr-2" />
              <span className="text-clickprop-text-secondary">{feature}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-clickprop-text">Amenities</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-3">
          {property.amenities.map((amenity, index) => (
            <div key={index} className="flex items-center">
              <Check size={16} className="text-clickprop-green mr-2" />
              <span className="text-clickprop-text-secondary">{amenity}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyFeaturesTab;
