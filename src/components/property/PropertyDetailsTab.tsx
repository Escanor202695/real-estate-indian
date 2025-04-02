
import React from 'react';
import { Property } from '@/types/property';

interface PropertyDetailsTabProps {
  property: Property;
}

const PropertyDetailsTab: React.FC<PropertyDetailsTabProps> = ({ property }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-clickprop-text">Description</h2>
        <p className="text-clickprop-text-secondary whitespace-pre-line">
          {property.description}
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-clickprop-text">Property Details</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p className="text-clickprop-text-secondary text-sm">Type</p>
            <p className="font-medium text-clickprop-text capitalize">{property.type}</p>
          </div>
          <div>
            <p className="text-clickprop-text-secondary text-sm">Status</p>
            <p className="font-medium text-clickprop-text capitalize">For {property.status}</p>
          </div>
          <div>
            <p className="text-clickprop-text-secondary text-sm">Size</p>
            <p className="font-medium text-clickprop-text">{property.size} sqft</p>
          </div>
          <div>
            <p className="text-clickprop-text-secondary text-sm">Bedrooms</p>
            <p className="font-medium text-clickprop-text">{property.bedrooms}</p>
          </div>
          <div>
            <p className="text-clickprop-text-secondary text-sm">Bathrooms</p>
            <p className="font-medium text-clickprop-text">{property.bathrooms}</p>
          </div>
          <div>
            <p className="text-clickprop-text-secondary text-sm">City</p>
            <p className="font-medium text-clickprop-text">{property.location.city}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsTab;
