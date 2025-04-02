
import React from 'react';
import { Bed, Bath, Home, MapPin } from 'lucide-react';
import { Property } from '@/types/property';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const handleClick = () => {
    if (property.externalLink) {
      window.open(property.externalLink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card 
      className="property-card h-full cursor-pointer hover:shadow-md transition-shadow duration-200"
      onClick={handleClick}
    >
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-clickprop-text line-clamp-2">
            {property.title}
          </h3>
          <span className={`text-xs px-2 py-1 rounded-full ${property.status === 'rent' ? 'bg-clickprop-green/10 text-clickprop-green' : 'bg-clickprop-blue/10 text-clickprop-blue'}`}>
            For {property.status === 'rent' ? 'Rent' : 'Sale'}
          </span>
        </div>
        
        <p className="text-clickprop-text-secondary text-sm line-clamp-2 mb-3">
          {property.description}
        </p>
        
        <p className="font-bold text-clickprop-blue mb-3">
          ₹{property.status === 'rent' 
            ? `${property.price?.toLocaleString()}/month` 
            : property.price?.toLocaleString()
          }
        </p>
        
        <p className="flex items-center text-sm text-clickprop-text-secondary mb-4">
          <MapPin size={14} className="mr-1 text-clickprop-blue" />
          {property.location?.address}, {property.location?.city}
        </p>
      </CardContent>
      
      <CardFooter className="pt-0 border-t">
        <div className="flex items-center justify-between w-full text-sm text-clickprop-text-secondary">
          <span className="flex items-center">
            <Bed size={14} className="mr-1" />
            {property.bedrooms} Beds
          </span>
          <span className="flex items-center">
            <Bath size={14} className="mr-1" />
            {property.bathrooms} Baths
          </span>
          <span className="flex items-center">
            <Home size={14} className="mr-1" />
            {property.size} sqft
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;
