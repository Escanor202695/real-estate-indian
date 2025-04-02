
import React from 'react';
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Bath, Home, ArrowLeft } from 'lucide-react';
import { Property } from '@/types/property';

interface PropertyHeaderProps {
  property: Property;
}

const PropertyHeader: React.FC<PropertyHeaderProps> = ({ property }) => {
  return (
    <div className="mb-6">
      <Button variant="outline" className="mb-4" asChild>
        <a href="/properties">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Properties
        </a>
      </Button>
      <h1 className="text-2xl md:text-3xl font-bold text-clickprop-text mb-2">
        {property.title}
      </h1>
      <p className="flex items-center text-clickprop-text-secondary mb-4">
        <MapPin size={16} className="mr-1" />
        {property.location.address}, {property.location.city}, {property.location.state}
      </p>
      <div className="flex flex-wrap items-center gap-4 text-clickprop-text-secondary">
        <span className="text-2xl font-bold text-clickprop-blue">
          ₹{property.status === 'rent' 
            ? `${property.price?.toLocaleString()}/month` 
            : property.price?.toLocaleString()
          }
        </span>
        <span className="flex items-center">
          <Bed size={16} className="mr-1" />
          {property.bedrooms} Bedrooms
        </span>
        <span className="flex items-center">
          <Bath size={16} className="mr-1" />
          {property.bathrooms} Bathrooms
        </span>
        <span className="flex items-center">
          <Home size={16} className="mr-1" />
          {property.size} sqft
        </span>
      </div>
    </div>
  );
};

export default PropertyHeader;
