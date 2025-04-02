
import React from 'react';
import { Link } from 'react-router-dom';
import { Bed, Bath, Home, MapPin } from 'lucide-react';
import { Property } from '@/types/property';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  return (
    <div className="property-card">
      <div className="property-image-container">
        <img 
          src={property.images?.[0] || '/placeholder.svg'} 
          alt={property.title} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <span className={`property-status ${property.status === 'rent' ? 'bg-clickprop-green' : 'bg-clickprop-blue'}`}>
          For {property.status === 'rent' ? 'Rent' : 'Sale'}
        </span>
      </div>
      
      <div className="property-content">
        <h3 className="property-title">
          <Link to={`/properties/${property.id}`}>{property.title}</Link>
        </h3>
        
        <p className="property-price">
          ₹{property.status === 'rent' 
            ? `${property.price?.toLocaleString()}/month` 
            : property.price?.toLocaleString()
          }
        </p>
        
        <p className="property-location flex items-center text-sm">
          <MapPin size={14} className="mr-1 text-clickprop-blue" />
          {property.location?.address}, {property.location?.city}
        </p>
        
        <div className="property-details">
          <span className="flex items-center">
            <Bed size={16} className="mr-1" />
            {property.bedrooms} Beds
          </span>
          <span className="flex items-center">
            <Bath size={16} className="mr-1" />
            {property.bathrooms} Baths
          </span>
          <span className="flex items-center">
            <Home size={16} className="mr-1" />
            {property.size} sqft
          </span>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
